const app= require('../app')
const http= require('http')
const port= process.env.PORT || 3000
const server= http.createServer(app)
const io = require('socket.io')(server)
let player = []
let gameOnStatus = false
const fs= require('fs')

let resource= fs.readFileSync('./resource.json')
let data = JSON.parse(resource)

let setInt
let scoreAll = []

io.on('connection', function(socket) {
    console.log('User Connected')
    console.log(player)
    socket.on('gameOn', () => {
        if (gameOnStatus) {
            io.emit('gameOn', true)
        } else {
            io.emit('gameOn', false)
        }
    })
    socket.on('clear-all-client', () => {
        console.log('ini clear all')
        io.emit('clear-all-client')
    })
    socket.on('user-connect', (user) => {
        player.push(user) 
        console.log(player)
        io.emit('stateNewPlayer', player)
        clearInterval(setInt)
    })
    socket.on('answer', (data) => {
        scoreAll.push(data)
        console.log(scoreAll)
    })
    socket.on('changeStatus', (data) => {
        player = []
        player = data
        let statusNow = true
        player.forEach(el => {
            if (el.status == 'Waiting') {
                statusNow = false
                clearInterval(setInt)
                return 
            }
        })
        if (statusNow) {
            let time = 10
                setInt = setInterval(() => {
                    time-- 
                    if (time < 1) {
                        clearInterval(setInt)
                        gameOn(socket)
                    }
                    io.emit('startTimer', time)
            }, 1000)            
        }
        io.emit('stateNewPlayer', player)
    })

    socket.on('disconnect', function() {
        console.log('User Disconnected')  
    })

    setTimeout(function() {
        for(let i = 0; i < data.length; i++) {
            io.emit('send-data',data[i])
        }
    },10000) 
    
})

const gameOn = (socket) => {
    gameOnStatus = true
    io.emit('startGame')
    let timeGame = 100
        let indexSoal = 0
        io.emit('send-data',data[indexSoal])
        console.log(data[indexSoal], '<<<<<')
        let gameInt =  setInterval(() => {
            if (timeGame <= 0) {
                indexSoal++
                if (indexSoal >= data.length) {
                    clearInterval(gameInt)
                    resultPerQuest(data[indexSoal-1].id)
                    player.sort(function(a, b) {
                        return b.score - a.score;
                    });
                    scoreAll = []
                    io.emit('finalScore', player)
                    player = []
                    io.emit('finished', true)
                    console.log(player, 'hasil nih')
                    gameOnStatus = false
                } else {
                    console.log(indexSoal)
                    resultPerQuest(data[indexSoal-1].id)
                    console.log(player, 'ini ternyata')
                    io.emit('resultCurrent', player)
                    io.emit('send-data',data[indexSoal])
                    timeGame = 110
                }                
            }            
            io.emit('startTimer', timeGame)
            timeGame -= 10
            console.log(timeGame)
        }, 1000)
        timeGame = 100
}
let arrayScoreResult = []

const resultPerQuest = (questId) => { 
    scoreAll.forEach(el => {
        let dataRet
        if (el.questId == questId) {
            data.forEach(el2 => {
                if (el2.id == el.questId) {
                    if (el2.answer == el.choice) {
                        dataRet = {
                            id: el.id,
                            questId: el.questId,
                            scoreQuest: el.time
                        }
                    } else {
                        dataRet = {
                            id: el.id,
                            questId: el.questId,
                            scoreQuest: 0
                        }
                    }
                    return
                }
            })
            arrayScoreResult.push(dataRet)
        }
    })
    console.log(scoreAll, 'SCOREALL')
    console.log(arrayScoreResult, '<<<<<<<')
    player.forEach(el => {
        arrayScoreResult.forEach(el2 => {
            if (el2.id == el.id && el2.questId == questId) {
                el.score += el2.scoreQuest
            }
        })
    })

}
console.log(player)

server.listen(port,()=> console.log(`Listening on port ${port}`))