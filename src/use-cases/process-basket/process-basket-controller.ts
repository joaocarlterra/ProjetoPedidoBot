import { Request } from "express"
import { WebhookClient  } from "dialogflow-fulfillment"

import ProcessBasketCase from "./process-basket-case"

class ProcessBasketController {
  private processBasektCase: ProcessBasketCase

  constructor(processBasketCase: ProcessBasketCase) {
    this.processBasektCase = processBasketCase
  }

  async handle(request: Request, response: any) {
    const { body } = request

    const agent = new WebhookClient({ request, response })

    const itemsContext = body.queryResult.outputContexts[1]
    const basketContext = body.queryResult.outputContexts[0]

    try {
      if (body.queryResult.intent.displayName === 'order.finish') {
        this.processBasektCase.finish(agent, basketContext)
      }

      if (body.queryResult.intent.displayName === 'order.showbasket'
        || body.queryResult.intent.displayName === 'item.confirm.yes'
      ) {
        this.processBasektCase.execute(body, agent, itemsContext, basketContext)
      }
    } catch (error) {
      return response.status(500).send('Internal server error')
    }
  }
}

export default ProcessBasketController