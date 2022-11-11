import dotenv from "dotenv"
dotenv.config()
import express from "express"
import morgan from "morgan"
import {Server as Socketserver} from "socket.io"
import http from "http"
import cors from "cors"
import mongoose from "mongoose"
import router from "./routes/message.js"
import bodyParser from "body-parser"


// Configuração mongoose
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS
const port = process.env.PORT
const url =`mongodb+srv://${dbUser}:${dbPass}@cluster0.nd3xdvb.mongodb.net/?retryWrites=true&w=majority`

mongoose.Promise = global.Promise

const app = express()

// Criando servidor com modulo http
const server = http.createServer(app)
// Usando servidor fornecido pelo Socket.io
const io = new Socketserver(server, {
    core:{
        origin: '*'
    }
})

// Configuração CORS 
app.use(cors())
// Configuração MORGAN
app.use(morgan("dev"))
// Configuração BodyParser
app.use(bodyParser.urlencoded({extended:false}))
// Convertendo requisições para json
app.use(bodyParser.json())

// Podemos observar as conexões dos usuarios, e acessar seu id
io.on("connection", (socket)=>{

    socket.on("message", (message, nickname)=>{
        // Envio para usuarios com broadcast.emit
        socket.broadcast.emit("message",{
            body: message,
            from: nickname,
        })
    })
})

//Rotas
app.use("/api", router)



//Conexção ao banco de dados pela porta definida em .env
mongoose.connect(url,{useNewUrlParser:true}).then(()=> {
    console.log("Conectado ao banco de dados")
    server.listen(port, ()=>{
        console.log(`Servidor na porta ${port}`)
    })
})
