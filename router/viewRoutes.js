import express from 'express';
import {
    obtenerComandas,
    obtenerComanda,
} from '../controllers/viewController.js';
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();
router.route('/')
//ruta de inicio Obtiene y lista todas las comandas
.get(checkAuth, obtenerComandas)
//Ruta con id de la comanda obtiene la informacion de esa comanda
router.get('/:id', checkAuth, obtenerComanda)


export default router;
