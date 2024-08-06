import express from "express"
import http from "node:http"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:*"],
  },
})

const PORT = Number(process.env.PORT || 3000)

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

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
