const { Router } = require('express')
const router = Router()

const db = require('../database')

router.get('/', async (req, res) => {
    console.log(process.env.A)
    const categorias = await db.query('SELECT * FROM categorias')
    const productos = await db.query('SELECT * FROM productos ORDER BY RAND()')
    
    res.render('index', { categorias, productos })
})

router.post('/buscar', async (req, res) => {
    const busqueda = req.body.busqueda
    const productos = await db.query(`SELECT * FROM productos WHERE name LIKE '%${busqueda}%' OR descripcion LIKE '%${busqueda}%'`)
    
    res.send({ productos })
})

router.get('/get/all/productos', async (req, res) => {
    const productos = await db.query('SELECT * FROM productos ORDER BY RAND()')

    res.send({ productos })
})

router.get('/info', (req, res) => {
    res.render('info')
})

module.exports = router