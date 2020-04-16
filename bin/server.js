const app= require('../app')
const http= require('http')
const port= process.env.PORT || 3000
const server= http.createServer(app)
const io = require('socket.io')(server)

io.on('connection', function(socket) {
    console.log('User Connected')

    socket.on('disconnect', function() {
        console.log('User Disconnected')
    })
})

server.listen(port,()=> console.log(`Listening on port ${port}`))