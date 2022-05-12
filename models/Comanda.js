import mongoose from "mongoose";

const comandaSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    comentario: {
        type: String,
        trim: true,
    },
    crudo:{
        type: String,
        trim: true,
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now(),
    },
    numero: {
        type: Number,
        required: true,
    },
    creador: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
    }],
    tareas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tarea',
        }
    ],
    cuenta: {
        type: String,
        trim: true,
    },
    terminado: {
        type: Boolean,
        default: false,
    },
    productoComanda: {
        type: String,
        trim: true,
    },
    creadorNombre: {
        type: String,
        trim: true,
    },
    colaboradores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
        },
    ],
},
    {
        timestamps: true,
    });


const Comanda = mongoose.model("Comanda", comandaSchema);

export default Comanda;