import express from 'express'
const app = express()
import morgan from 'morgan'
import configViewEngine from './config/viewEngine'
import initWebRouter from './routes/home.router'
import http from 'http'
const server = http.createServer(app);
import { Server } from 'socket.io'
const io = new Server(server);
import dotenv from 'dotenv'
dotenv.config()

// config
app.use(morgan('tiny'))
// body-parser
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// 
configViewEngine(app)
// initWebRouter
initWebRouter(app)

io.on('connection', (socket) => {
    console.log(socket.id, 'đã kết nối !');
    socket.on('disconnect', () => {
        console.log(socket.id, 'ngắt kết nối !');
    })
});
server.listen(process.env.PORT, () => {
    console.log(`==> http://localhost:${process.env.PORT}`);
})