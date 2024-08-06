import express from "express"
import getPort, { portNumbers } from "get-port"
import http from "node:http"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:*"],
  },
})

const desiredPort = Number(process.env.PORT || 3000)
const portToUse = await getPort({
  port: portNumbers(desiredPort, desiredPort + 100),
})

app.use(express.static("public"))

io.on("connection", (socket) => {
  console.log(`connect ${socket.id}`)

  socket.on("disconnect", () => {
    console.log(`disconnect ${socket.id}`)
  })

  socket.on("message", (msg: string) => {
    console.log("message:", msg)
    socket.broadcast.emit("notification", msg)
  })
})

server.listen(portToUse, () => {
  console.log(`Listening on *:${portToUse}`)
})