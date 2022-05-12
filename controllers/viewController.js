import Comanda from '../models/Comanda.js';
import Producto from '../models/Producto.js';
//Obtiene todos las comandas y las lista
const obtenerComandas = async (req, res) => {
    const comandas = await Comanda.find({
        '$or':[
            {colaboradores: {$in: req.usuario}},
            {creador: {$in: req.usuario}},         
        ]
    }).select('-tareas');
    res.json(comandas);
}

//Obtiene y lista las caracteristicas de 1 Comanda
const obtenerComanda = async (req, res) => {
    //Obtenemos el id de la comanda
    const { id } = req.params;
    //Obtenemos la comanda del modelo Comanda por el id
    const comanda = await Comanda.findById(id)
    .populate("tareas")
    .populate('colaboradores', 'nombre email');
    
    //Comprobamos si la comanda existe
    //Caso contrario retornamos un error 404
    if (!comanda) {
        const error = new Error("No Encontrado");
        return res.status(404).json({ msg: error.message });
    }
    //Comparamos el creador de la comanda con el usuario que solicita
    //Si son el mismo dejamos la consulta
    //Caso contrario devolvemos error
    if(comanda.creador.toString() !== req.usuario._id.toString() 
    && !comanda.colaboradores.some(colaborador => colaborador._id.toString()) === req.usuario._id.toString()){
       const error = new Error ('Accion no Valida');
       return res.status(404).json({msg: error.message}); 
    }
    res.json(comanda);
};

export {
    obtenerComandas,
    obtenerComanda,
}