const app= require('../app')
const http= require('http')
const port= process.env.PORT || 3000
const server= http.createServer(app)
const io = require('socket.io')(server)

let users = []

io.on('connection', function(socket) {
    console.log('User Connected')

    socket.on('disconnect', function() {
        console.log('User Disconnected')
    })

    socket.on('user-connect', function(data) {
        users.push(data)
        console.log(data.name, ' - connected')
        io.emit('user-connect', users)
    })
})

server.listen(port,()=> console.log(`Listening on port ${port}`))