import express from "express"
import router from "./router"
import fs from "fs"
import https from "https"
import WebSocket from "ws"

const application = express()

const privateKey = fs.readFileSync('./ssl/key.pem', 'utf8')
const certificate = fs.readFileSync('./ssl/cert.pem', 'utf8')

const credentials = { key: privateKey, cert: certificate }

application.use(express.json())
application.use(express.urlencoded({ extended: true }))

application.use(router)

const httpsServer = https.createServer(credentials, application)
const webSocketServer = new WebSocket.Server({ server: httpsServer })

export let clients: WebSocket[] = []

webSocketServer.on('connection', (ws) => {
  clients.push(ws);
  ws.on('close', () => {
      clients = clients.filter(client => client !== ws);
  });
});

httpsServer.listen(
  process.env.PORT || 5000, 
  () => console.log(`Server is running on port: ${ process.env.PORT || 5000 }`)
)

// ngrok http https://localhost:5000