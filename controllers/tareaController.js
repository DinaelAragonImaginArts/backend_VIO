import Comanda from '../models/Comanda.js';
import Tarea from '../models/Tarea.js';

//Agregamos la tarea
const agregarTarea = async (req, res) => {
    //obtenemos el id de la comanda mediante la destructuracion del objeto tarea
    const { comandaId } = req.body;
    //buscamos la comanda en el modelo Comanda para verificar su existencia
    const existeComanda = await Comanda.findById(comandaId);
    //Comprobamos la comanda, caso contrario arrojamos un mensaje 404
    if (!existeComanda) {
        const error = new Error('La comanda no existe');
        return res.status(404).json({ msg: error.message });
    }
    //Comprobamos que el creador-usuario asignado a la comanda sean el mismo que el que hace el request
    if(existeComanda.creador.toString() !== req.usuario._id.toString() 
    && !existeComanda.colaboradores.some(colaborador => colaborador._id.toString()) === req.usuario._id.toString()){
       const error = new Error ('No tienes los permisos necesarios');
       return res.status(404).json({msg: error.message}); 
    }
    //Conectamos con la base de datos mediante un try catch
    try {
        //Creamos una constante con la tarea y creamos la misma en el modelo Tarea
        const tareaAlmacenada = await Tarea.create(req.body);
        // Almacenamos la constante con el objeto tarea en la comanda consultada anteriormente
        existeComanda.tareas.push(tareaAlmacenada._id);
        //esperamos la respuesta del servidor y almacenamos la comanda
        await existeComanda.save();
        //Devolvemos un objeto con la informacion de la tarea creada
        res.json(tareaAlmacenada);
    } catch (error) {
        //En caso de fallar se arroja un error por la consola
        res.jon(error);
    }
};

const obtenerTarea = async (req, res) => {
    //Obtenemos el id de la tarea mediante el request
    const { id } = req.params;
    //Buscamos la tarea mediante el id en el modelo Tarea
    const tarea = await Tarea.findById(id);
    //comprobamos que la tarea exista
    //Caso contrario devolvemos un error 404 
    if (!tarea) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ msg: error.message });
    }
    //Comprobamos que el usuario que creo la tarea sea el mismo que hace el request
    //caso contrario devolvemos error 403
    if (tarea.usuario !== req.usuario.nombre){
        const error = new Error("accion no valida");
        return res.status(403).json({ msg: error.message })
    }
    //Retornamos un objetos con la tarea
    res.json(tarea);
};
//Edicion de tareas
const actualizarTarea = async (req, res) => {
    //obtenemos el id del request
    const { id } = req.params;
    //buscamos la tarea mediante el id en el modelo Tarea y obtenemos la comanda por su id
    const tarea = await Tarea.findById(id).populate('comandaId');
    //Comprobamos que la tarea exista
    //Caso contrario arrojamos un error 404
    if (!tarea) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ msg: error.message });
    }
    //Si tarea.proyecto.creador y el request usuario._id NO son iguales mandamos error 
    /*if (tarea.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida");
        return res.status(403).json({ msg: error.message });
    }*/
    //definimos nombre,descripcion, prioridad, fechaEntrega como request.body."" 
    //Si la requisicion esta vacia se deja el parametro que ya estaba
    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;
    /*Agregamos tiempo al controlador request.body.tiempo
    Si esta vacio se deja el actual*/
    tarea.tiempo = req.body.tiempo || tarea.tiempo;
    tarea.estado = req.body.estado || tarea.estado;
    //declaramos tareaAlmacenada como constante y la guardamos
    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada)
    } catch (error) {
        res.jon(error);
    }

};

//Eliminacion de tareas
const eliminarTarea = async (req, res) => {
    //obtenemos el id del request
    const { id } = req.params;
    //Consultamos el modelo Tarea mediante el id para obtener la tarea
    const tarea = await Tarea.findById(id)
    //Comprobamos si la tarea existe
    //caso contrario devolvemos un error
    if (!tarea) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ msg: error.message });
    }
    //Comprobamos que el creador y quien hace el request sean el mismo
    //Caso contrario devolvemos error 403
    if (tarea.usuario.toString() !== req.usuario.nombre.toString()) {
        const error = new Error("Accion no valida");
        return res.status(403).json({ msg: error.message });
    }
    //Conectamos con la base de datos con un try catch
    try {
        //esperamos la respuesta borramos la tarea
        await tarea.deleteOne();
        //Retornamos un mensaje de exito en forma de objeto
        res.json({ msg: "Tarea eliminada" });

    } catch (error) {
        //En caso de fallar devolvemos un error mediante la consola
        res.jon(error);
    }

};

/*const cambiarEstado = async (req, res) => {
    const { id } = req.params
    const tarea = await Tarea.findById(id)
    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json({ msg: error.message });
    }
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no valida');
        return res.status.json({ msg: error.message });
    }
    tarea.nombre = tarea.nombre;
    tarea.descripcion = tarea.descripcion;
    tarea.prioridad = tarea.prioridad;
    tarea.fechaEntrega = tarea.fechaEntrega;
    tarea.tiempo = req.body.tiempo || tarea.tiempo;
    tarea.estado = req.body.tiempo || tarea.estado;
    try {
        const tareaTerminada = await tarea.save();
        res.json(tareaTerminada)
    }
    catch (error) {
        console.log(error);
    }
};
*/



export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
}