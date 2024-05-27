import { NextFunction, Request, Response } from "express"

const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const { authorization } = request.headers
  const [authType, token] = authorization.split(' ')

  if (!authorization) return response.status(401).send({ error: 'Unauthorized' })

  if (authType !== 'Basic') return response.status(401).send({ error: 'Invalid authentication type' })
  
  const decodedToken = Buffer.from(token, 'base64').toString('ascii')
  const [username, password] = decodedToken.split(':')

  const expectedUsername = process.env.WEBHOOK_USER
  const expectedPassword = process.env.WEBHOOK_PASS

  if (username !== expectedUsername || password !== expectedPassword) {
    return response.status(401).send({ error: 'Invalid credentials' })
  }

  next()
}

export default authMiddleware