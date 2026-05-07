import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port: 8080})

//connection event

wss.on('connection', (socket, request) => {
    const ip = request.socket.remoteAddress;

    socket.on('message', (rawData) => {
        const message = rawData.toString()
        console.log({rawData})

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) client.send(`Server broadcast: ${message}`)
        })
    })

    socket.on('error', (error) => {
        console.error(`Error : ${error.message}, ${ip}`)
    })

    socket.on('close', () => {
        console.log('Client Disconnected')
    })
})


console.log(`WebSocket server is running on Ws://localhost:8080`);