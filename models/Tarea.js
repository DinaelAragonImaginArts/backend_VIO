import mongoose from "mongoose";

const tareaSchema = mongoose.Schema ({
    nombre:{
        type: String,
        trim: true,
        required: true,
    },
    descripcion: {
        type: String,
        trim: true,
        default: "Sin comentarios",
    },
    tiempo:{
        type: Number,
        default: 0,
    },
    estado: {
        type: Boolean,
        default: false,
    },
    fechaEntrega: {
        type: Date,
        require: true,
        default: Date.now()
    },
    cuenta:{
        type: String,
        require: true
    },
    comanda: {
        type: String,
        required: true,
    }, 
    comandaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comanda',
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    usuario: {
       type: String,
       require: true,
    },
    area: {
        type: String,
        require: true,
     },
     semana: {
        type: Date,
        default: Date.now()
     },
},{
    timestamps: true
});

const Tarea = mongoose.model('Tarea', tareaSchema);
export default Tarea;