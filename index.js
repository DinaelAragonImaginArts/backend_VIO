import express from "express";
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import usuarioRoutes from './router/usuarioRoutes.js';
import viewRoutes from './router/viewRoutes.js';
import tareaRoutes from './router/tareaRoutes.js';
import adminRoutes from './router/adminRoutes.js';
import cors from 'cors';

const app = express();
app.use(express.json());


dotenv.config();

conectarDB();

//Configuracion de cors

const whileList = [process.env.FRONTEND_URL] ;


const corsOptions = {
    origin:  function(origin, callback){
        if(whileList.includes(origin)){ 
            //Puede consultar la api
            callback(null, true);
        }else{
            //No esta permitido
            callback(new Error('Error de Cross'))
        }
    },

};

app.use(cors(corsOptions));


//Routing
app.use('/api/usuarios', usuarioRoutes);
//Cambio de routes por el viewRoutes
app.use('/api/view',  viewRoutes);
app.use('/api/tareas', tareaRoutes);
app.use('/api/admin', adminRoutes);




const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, ()=>{
    console.log(`servidor corriendo en el puerto ${PORT}`);
})


// Socket io
import { Server } from 'socket.io'

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    },
})

io.on('connection', (socket)=>{
    //Defini los eventos de socket io "Recivir"
    socket.on('abrir comanda', (comanda)=>{
        socket.join(comanda);
    })
    //Definir los eventos de socket io "enviar"
    /*socket.on('nueva tarea', (tarea)=>{
        const comanda = tarea?.comandaId
        socket.on(comanda).emit('tarea agregada', tarea);
    })/*/
    socket.on('tiempoCronometro', tiempo=>{
        console.log(tiempo);
    })
})