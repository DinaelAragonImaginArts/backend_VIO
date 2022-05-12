import Tarea from '../models/Tarea.js';
//import Usuario from '../models/Usuario.js';
import Cliente from '../models/Cliente.js';
import Comanda from '../models/Comanda.js';
import Producto from '../models/Producto.js';
import Usuario from '../models/Usuario.js';
import TipoTarea from '../models/TipoTarea.js';

const obtenerInfo = async (req, res) => {
    const tareas = await Tarea.find();
    const cliente = await Cliente.find();
    const producto = await Producto.find();
    const comanda = await Comanda.find();
    const tipoTarea = await TipoTarea.find();
    const resultado = { tareas, cliente, producto, comanda, tipoTarea };
    res.json(resultado);
}

const crearProducto = async (req, res) => {
    const producto = new Producto(req.body);
    try {
        const productoAlmacenado = await producto.save();
        res.json(productoAlmacenado);
    } catch (error) {
        res.jon(error);
    }
}

const obtenerProducto = async (req, res) => {
    const productos = await Producto.find();
    res.json(productos);
}

const crearCliente = async (req, res) => {
    const cliente = new Cliente(req.body);
    try {
        const clienteNuevo = await cliente.save();
        res.json(clienteNuevo);
    } catch (error) {
        res.json(error);
    }
}

const obtenerCliente = async (req, res) => {
    const cliente = await Cliente.find();
    res.json(cliente);
}


const crearComanda = async (req, res) => {
    const comanda = new Comanda(req.body);
    try {
        const comandaAlmacenada = await comanda.save();
        res.json(comandaAlmacenada);
    } catch (error) {
        res.json(error);
    }
}


const terminarComanda = async (req, res) => {
    //Obtenemos el id de la comanda
    const { id } = req.params;
    //obtenemos la comanda
    const comanda = await Comanda.findById(id);
    if (!comanda) {
        const error = new Error("Producto no encontrado");
        return res.status(404).json({ msg: error.message });
    }
    comanda.nombre = req.body.nombre || comanda.nombre;
    comanda.crudo = comanda.crudo;
    comanda.numero = comanda.numero;
    comanda.productoComanda = comanda.productoComanda;
    comanda.creadorNombre = comanda.creadorNombre;
    comanda.terminado = true;
    try {
        const comandaTerminada = await comanda.save();
        return res.json(comandaTerminada);
    } catch (error) {
        console.log(error);
    }

}


//Editamos la comanda
const editarComanda = async (req, res) => {
    //obtenemos id por medio del req.body
    const { id } = req.params;
    //Obtenemos la comanda por medio del id
    const comanda = await Comanda.findById(id);
    //Si la comanda no existe devolvemos error
    if (!comanda) {
        const error = new Error("No Encontrado");
        return res.status(404).json({ msg: error.message });
    }
    //Igualamos la comanda dependiendo de la requisicion
    //Si la requesicion a editar existe, sustituye el registo
    //Caso contrario el valor registrado prevalece
    comanda.nombre = req.body.nombre || comanda.nombre;
    comanda.descripcion = req.body.descripcion || comanda.descripcion;
    comanda.fecha = req.body.fecha || comanda.fecha;
    comanda.cliente = req.body.cliente || comanda.cliente;
    //Creamos la conexion con la base de datos mediante un try catch
    try {
        //Guardamos la comanda en el modelo comanda
        const comandaAlmacenada = await comanda.save();
        //Retornamos lo guardado en forma de objeto
        return res.json(comandaAlmacenada);
    } catch (error) {
        //En caso que la conexion falle, devolvemos un error 
        res.json(error);
    }
}
//Eliminamos la comanda
const eliminarComanda = async (req, res) => {
    //Obtenemos id mediante el request
    const { id } = req.params;
    //buscamos la comanda mediante el id obtenido
    const comanda = await Comanda.findById(id);
    //Comprobamos si la comanda existe
    //Caso contrario devolvemos error 404
    if (!comanda) {
        const error = new Error("No Encontrado");
        return res.status(404).json({ msg: error.message });
    }
    //Comparamos el creador con el usuario para impedir la accion en caso de no ser el mismo
    if (comanda.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida");
        return res.status(401).json({ msg: error.message });
    }
    //Conectamos con la base de datos mediante un try Catch 
    try {
        //Esperamos la conexion y borramos la comanda
        await comanda.deleteOne();
        //retornamos el mensaje en forma de objeto
        res.json({ msg: "Comanda eliminada" });
    } catch (error) {
        //En caso de fallar devolvemos error
        res.json(error);
    }
}

//Buscamos colaborador
const buscarColaborador = async (req, res) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -password -token -updatedAt -__v')
    if (usuario === "" || usuario === null) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ msg: error.message });
    }
    res.json(usuario);
};
//Agregamos colaborador a la comanda
const agregarColaborador = async (req, res) => {
    const comanda = await Comanda.findById(req.params.id)
    if (!comanda) {
        const error = new Error('Comanda no encontrada');
        return res.status(404).json({ msg: error.message });
    }
    /*if(comanda.creador.toString() !== req.usuario._id.toString()){
        const error = new Error ("Acción no valida");
        return res.status(404).json({msg: error.message});
    }*/
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email }).select("-confirmado -createdAt -password -token -__v");
    if (!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({ msg: error.message });
    }
    //El colaborador no es el administrador
    /*if(comanda.creador.toString() === usuario._id.toString()){
        const error = new Error('El administrador no puede ser agregado como colaborador');
        return res.status(404).json({msg: error.message});        
    }*/

    if (comanda.colaboradores.includes(usuario._id)) {
        const error = new Error(
            "El usuario ya pertenece a la comanda"
        )
        return res.status(404).json({ msg: error.message });
    }

    //Agregar a la comanda

    comanda.colaboradores.push(usuario._id);
    await comanda.save();
    res.json({ msg: 'Colaborador agregado a comanda correctamente' });
}
//Eliminarmos colaborador de la comanda
const eliminarColaborador = async (req, res) => {
    const comanda = await Comanda.findById(req.params.id)
    if (!comanda) {
        const error = new Error('Comanda no encontrada');
        return res.status(404).json({ msg: error.message });
    }
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email }).select("-confirmado -createdAt -password -token -__v");
    //Eliminar colaborador
    comanda.colaboradores.pull(usuario?._id);
    await comanda.save();
    res.json({ msg: 'Colaborador Eliminado Correctamente' });
}

const crearTipoTarea = async (req, res) => {
    const tipoTarea = new TipoTarea(req.body);

    try {
        const TipoTareaNew = await tipoTarea.save();
        res.json(TipoTareaNew);
    } catch (error) {
        console.log(error);
    }
}



export {
    obtenerInfo,
    crearProducto,
    obtenerProducto,
    crearCliente,
    obtenerCliente,
    crearComanda,
    editarComanda,
    eliminarComanda,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
    crearTipoTarea,
    terminarComanda
}