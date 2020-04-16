const app= require('../app')
const http= require('http')
const port= process.env.PORT || 3000
const server= http.createServer(app)
const io = require('socket.io')(server)
let player = []

let data = [
    {
        "id":1,
        "question": "Lampu apa yang kalo dipecahkan akan keluar orang?",
        "choices": [
            {
                "id": "A",
                "choice": "Lampu ajaib"
            },
            {
                "id": "B",
                "choice": "Lampu jin"
            },
            {
                "id": "C",
                "choice": "Lampu bohlam"
            },
            {
                "id": "D",
                "choice": "Lampu tetangga"
            }
        ],
        "answer": "Lampu tetangga"
    },
    {
        "id":2,
        "question": "Jika umur kaka sekarang 4 tahun maka umur adik setengah umur kaka, jika umur kaka sekarang 100 tahun. Berapakah umur adik?",
        "choices": [
            {
                "id": "A",
                "choice": "49"
            },
            {
                "id": "B",
                "choice": "50"
            },
            {
                "id": "C",
                "choice": "98"
            },
            {
                "id": "D",
                "choice": "Tidak ada yang benar"
            }
        ],
        "answer": "98"
    },
    {
        "id":3,
        "question": "Apa yang harus dilakukan ketika pacar pms?",
        "choices": [
            {
                "id": "A",
                "choice": "Ajak shopping"
            },
            {
                "id": "B",
                "choice": "Duet minum kiranti"
            },
            {
                "id": "C",
                "choice": "Ajak berkembangbiak"
            },
            {
                "id": "D",
                "choice": "Pura pura mati aja gais!"
            }
        ],
        "answer": "Pura pura mati aja gais!"
    },
    {
        "id":4,
        "question": "Manakah diantara berikut ini yang merupakan bangunan 'bersejarah'",
        "choices": [
            {
                "id": "A",
                "choice": "Taj Mahal"
            },
            {
                "id": "B",
                "choice": "Rumah Mantan"
            },
            {
                "id": "C",
                "choice": "Colosseum"
            },
            {
                "id": "D",
                "choice": "Semua jawaban benar"
            }
        ],
        "answer": "Semua jawaban benar"
    },
    {
        "id":5,
        "question": "Manakah diantara pilihan berikut yang benar untuk 'Dua kosong dua empat'?",
        "choices": [
            {
                "id": "A",
                "choice": "2024"
            },
            {
                "id": "B",
                "choice": "0044"
            },
            {
                "id": "C",
                "choice": "0024"
            },
            {
                "id": "D",
                "choice": "2044"
            }
        ],
        "answer": "0044"
    },
    {
        "id":6,
        "question": "Selalu potong rambut tiap hari tapi tak pernah botak?",
        "choices": [
            {
                "id": "A",
                "choice": "Pakai ramuan penumbuh"
            },
            {
                "id": "B",
                "choice": "Rambutnya banyak"
            },
            {
                "id": "C",
                "choice": "Rambutnya tumbuh terus"
            },
            {
                "id": "D",
                "choice": "Tukang potong rambut"
            }
        ],
        "answer": "Tukang potong rambut"
    },
    {
        "id":7,
        "question": "Kenapa bebek goreng rasanya enak?",
        "choices": [
            {
                "id": "A",
                "choice": "Dagingnya lembut"
            },
            {
                "id": "B",
                "choice": "Harganya mahal"
            },
            {
                "id": "C",
                "choice": "Ada huruf B nya"
            },
            {
                "id": "D",
                "choice": "Dagingnya banyak"
            }
        ],
        "answer": "Ada huruf B nya"
    },
    {
        "id":8,
        "question": "Tahu-tahu apa yang paling besar di Indonesia?",
        "choices": [
            {
                "id": "A",
                "choice": "Tahu jumbo"
            },
            {
                "id": "B",
                "choice": "Tahu sutra"
            },
            {
                "id": "C",
                "choice": "Tahu isi sumedang"
            },
            {
                "id": "D",
                "choice": "Tahu ah gelap"
            }
        ],
        "answer": "Tahu isi sumedang"
    },
    {
        "id":9,
        "question": "Berapakah total uang yang diperlukan untuk membeli kuota untuk online class hacktiv8 ?",
        "choices": [
            {
                "id": "A",
                "choice": "Rp 50.000"
            },
            {
                "id": "B",
                "choice": "Rp 100.000"
            },
            {
                "id": "C",
                "choice": "Rp 150.000"
            },
            {
                "id": "D",
                "choice": "udah lebih dari semua pilihan :("
            }
        ],
        "answer": "udah lebih dari semua pilihan :("
    }
]

io.on('connection', function(socket) {
    console.log('User Connected')
    console.log(player)
    socket.on('user-connect', (user) => {
        player.push(user)
        console.log(player)
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

server.listen(port,()=> console.log(`Listening on port ${port}`))