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
console.log(data)

let setInt
let scoreAll = []

io.on('connection', function(socket) {
    console.log('User Connected')
    console.log(player)
    socket.on('gameOn', () => {
        if (!gameOnStatus) {
            io.emit('gameOn', true)
        }
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
    io.emit('startGame')
    let timeGame = 100
    // data.forEach(el => {
        // emit data soal
        let indexSoal = 0
        io.emit('send-data',data[indexSoal])
        console.log(data[indexSoal], '<<<<<')
        // emit soal data
        
        let gameInt =  setInterval(() => {
            if (timeGame < 1) {
                indexSoal++
                if (indexSoal >= data.length) {
                    clearInterval(gameInt)
                } else {
                    console.log(indexSoal)
                    resultPerQuest(data[indexSoal-1].id)
                    console.log(player)
                    io.emit('resultCurrent', player)
                    io.emit('send-data',data[indexSoal])
                    // emit data index+1
                    // emit biar dia buka page result
                    timeGame = 160
                }
                
            }
            
            // on dia udh jawab

            // if (timeGame == 100 ) {
            //     // io emmit balik ke laman game yg baru
            // }
            io.emit('startTimer', timeGame)
            timeGame -= 10
            console.log(timeGame)
        }, 1000)
        timeGame = 100
    // })

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
    console.log(scoreAll)
    console.log(arrayScoreResult)
    player.forEach(el => {
        arrayScoreResult.forEach(el2 => {
            if (el2.id == el.id && el2.questId == questId) {
                el.score += el2.scoreQuest
            }
        })
    })

}

server.listen(port,()=> console.log(`Listening on port ${port}`))