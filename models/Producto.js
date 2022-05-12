import mongoose from "mongoose";

const productoSchema = mongoose.Schema({
    nombre:{
        type: String,
        trim: true,
        required: true,
    },
    descripcion:{
        type: String,
        trim: true,
    },
    numero: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    activo:{
        type: String,
        default: "true",
    }
},
{
    timestamps: true,
});
 


const Producto = mongoose.model("Producto", productoSchema);

export default Producto;