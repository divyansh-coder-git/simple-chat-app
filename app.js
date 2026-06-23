let express = require('express')
let path = require('path')
let app = express()
let PORT = process.env.PORT || 4000
let server = app.listen(PORT, () => console.log(`Server on port ${PORT}`))
let io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))

let socketsConnected = new Set()

io.on('connection', onConnected)

function onConnected(socket){
    console.log(socket.id)
    socketsConnected.add(socket.id)

    io.emit('clients-total', socketsConnected.size)

    socket.on('disconnect', () => {
        console.log('Socket disconnected: ', socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total', socketsConnected.size)
    })

    socket.on('message', (data)=>{
        console.log(data)
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback', (data)=>{
        socket.broadcast.emit('feedback', data)
    })
    
}