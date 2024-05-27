import { WebhookClient } from "dialogflow-fulfillment"
import { response } from "express"
import generateBasketOutput from "src/helpers/generate-basket-output"
import { clients } from "src/index"
import { WebSocket } from "ws"

class ProcessBasketCase {
  constructor() {}

  async execute(data: any, agent: any) {
    const getBasketItems = (agent: any) => {
      const basket = agent.context.get('basket')

      if ((basket.parameters as any)?.items) {
        return (basket.parameters as any).items
      } else {
        return agent.context.get('item').parameters
      }
    }

    const showBasket = () => {
      if (agent.context.get('basket')) {
        const basketItems = getBasketItems(agent)
        const itemKeys = Object.keys(basketItems).filter(key => !key.includes('.original'))

        itemKeys.forEach(key => {
          if (key.includes('.original')) {
            delete basketItems[key]
          }
        })

        const basketOutput = `Ate agora você tem no carrinho: ${generateBasketOutput(itemKeys, basketItems)}`

        agent.add(basketOutput)
      } else {
        agent.add(`Você ainda não tem nenhum item no carrinho.`)
      }
    }

    const confirmItem = () => {
      const item = agent.context.get('item')

      // TODO: refatorar a forma de pegar os parametros
      const burgerType = item.parameters['burger-type' as keyof typeof item.parameters]
      const burgerAmount = item.parameters['burger-amount' as keyof typeof item.parameters]
      const sideDishes = item.parameters['side-dishes' as keyof typeof item.parameters]
      const sideDishesAmount = item.parameters['side-dishes-amount' as keyof typeof item.parameters]
      const drinks = item.parameters['drinks' as keyof typeof item.parameters]
      const drinksAmount = item.parameters['drinks-amount' as keyof typeof item.parameters]

      const basketContext = {
        'name': 'basket',
        'lifespan': 50,
        'parameters': {},
      }

      var items: any = {}

      if (agent.context.get('basket').parameters) {
        items = (agent.context.get('basket').parameters as any)?.items
      }

      items[data?.responseId as keyof typeof items] = {
        "burger-type": burgerType,
        "burger-amount": burgerAmount,
        "side-dishes": sideDishes,
        "side-dishes-amount": sideDishesAmount,
        "drinks": drinks,
        "drinks-amount": drinksAmount,
      }

      basketContext.parameters = items

      agent.context.set(basketContext)
      agent.add(`Ok, mais alguma coisa?`)
    }

    let intentMap = new Map()
    intentMap.set('order.showbasket', showBasket)
    intentMap.set('item.confirm.yes', confirmItem)

    try {
      agent.handleRequest(intentMap)
    } catch (error) {
      console.error('Error while processing the basket: ', error)
    }
  }

  async finish(agent: any) {
    const orderFinish = () => {
      const basket = agent.context.get('basket')?.parameters

      if (!basket) {
        agent.add('Desculpe, não encontrei itens no seu carrinho.');
        return;
      }

      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(basket))
          agent.add('Adicionei seus itens ao carrinho da loja, qualquer coisa só me chamar!')
        }
      })
    }

    let intentMap = new Map()
    intentMap.set('order.finish', orderFinish)

    try {
      agent.handleRequest(intentMap)
    } catch (error) {
      console.error('Error while processing the basket: ', error)
    }
  }
}

export default ProcessBasketCase