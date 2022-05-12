import mongoose from 'mongoose';

const TipoTareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true,
    },
    area: {
        type: String,
        trim: true,
        required: true,
    },
    activo:{
        type: Boolean,
        default: true
    }
},
{
    timestamps: true,
});


const TipoTarea  =  mongoose.model('TipoTarea', TipoTareaSchema);

export default TipoTarea;
