import mongoose from 'mongoose';

const clienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    siglas: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    activo:{
        type: Boolean,
        default: true
    }
},
{
    timestamps: true,
});


const Cliente  =  mongoose.model('Cliente', clienteSchema);

export default Cliente;
