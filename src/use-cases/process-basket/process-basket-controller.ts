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

    try {
      // TODO: possivelmente trocar para um mapa de intents
      if (body.queryResult.intent.displayName === 'order.finish') {
        this.processBasektCase.finish(agent)
      }

      this.processBasektCase.execute(body, agent)
    } catch (error) {
      return response.status(500).send('Internal server error')
    }
  }
}

export default ProcessBasketController