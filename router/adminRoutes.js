import express from 'express';
import{ 
    obtenerInfo,
    crearProducto,
    obtenerProducto,
    crearCliente,
    obtenerCliente,
    crearComanda,
    editarComanda,
    eliminarColaborador,
    eliminarComanda,
    buscarColaborador,
    agregarColaborador,
    crearTipoTarea,
    terminarComanda
} from '../controllers/adminController.js';
import { obtenerComanda} from '../controllers/viewController.js';

//Controlador
//CheckAuth
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/')
.get(checkAuth, obtenerInfo)
.post(checkAuth, crearComanda)

router.route('/comanda/:id')
.get(checkAuth, obtenerComanda)
.put(checkAuth, editarComanda)
.delete(checkAuth, eliminarComanda)

//Buscamos colaboradores
router.post('/comanda/colaboradores', checkAuth, buscarColaborador);
router.put('/comanda/colaboradores/:id', checkAuth, agregarColaborador);
//Eliminamos colaboradores de la comanda
router.post('/comanda/eliminar-colaboradores/:id', checkAuth, eliminarColaborador);

router.post('/tipo-tarea', crearTipoTarea);

router.route('/producto')
.get(checkAuth, obtenerProducto)
.post(checkAuth, crearProducto)

router.route('/cliente')
.post(checkAuth, crearCliente)
.get(checkAuth, obtenerCliente)

router.route('/:id')
.post(checkAuth, terminarComanda)




export default router;