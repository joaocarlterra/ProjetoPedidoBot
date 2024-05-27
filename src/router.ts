import { Request, Response, Router } from "express"
import processBasketController from "./use-cases/process-basket"

const router = Router()

router.get("/ping", (request: Request, response: Response) => {
  return response.status(200).send('Pong!')
})

router.post('/webhook', (request: Request, response: any) => {
  return processBasketController.handle(request, response)
})

export default router