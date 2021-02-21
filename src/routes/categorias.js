const { Router } = require('express')
const router = Router()
const db = require('../database')

const { isAdmin } = require('../lib/auth')

router.get('/', isAdmin, async (req, res) => {
    const categorias = await db.query('SELECT * FROM categorias ORDER BY id DESC')
    
    res.render('categorias/index', { categorias })
})

router.post('/add/:name', async (req, res) => {
    const name = req.params.name
    const rows = await db.query('SELECT * FROM categorias WHERE name = ?', [name])
    if(rows[0]){
        res.send({'message': 'La categoria ya existe'})
    }else{
        const result = await db.query('INSERT INTO categorias VALUES(null, ?)', [name])
        
        res.send(result)
    }
})

router.get('/edit/:id', isAdmin, async (req, res) => {
    const id = req.params.id
    const rows = await db.query('SELECT * FROM categorias WHERE id  = ?', [id])
    
    res.render('categorias/edit', { categoria: rows[0] })
})

router.post('/edit/:id', isAdmin, async (req, res) => {
    const id = req.params.id
    const { name } = req.body
    const rows = await db.query('SELECT * FROM categorias WHERE name = ?', [name])
    if(rows[0]){
        req.flash('err', 'La categoria ya existe')
        res.redirect('/categoria/edit/'+id)
    }else{
        await db.query('UPDATE categorias SET name=? WHERE id = ?', [name, id])
        req.flash('ok', 'Categoria actualizada correctamente')
        res.redirect('/categoria')
    }
})

router.get('/:name', async (req, res) => {
    const name = req.params.name
    const categoria = await db.query('SELECT * FROM categorias WHERE name = ?', [name])
    let productos = false
    if(categoria[0]){
        productos = await db.query('SELECT * FROM productos WHERE categoria_id = ?', [categoria[0].id])
    }
    res.render('categorias/detalles', { categoria: categoria[0], productos, name })
})


// API
router.get('/getAll', async (req, res) => {
    const rows = await db.query('SELECT * FROM categorias ORDER BY id DESC')
    if(rows[0]){
        res.send(rows)
    }else{
        res.send({'message': 'No hay categorias'})
    }
})

router.get('/get-one/:id', async (req, res) => {
    const id = req.params.id
    const result = await db.query('SELECT * FROM categorias WHERE id = ?', [id])
    if(result[0]){
        res.status(200).send(result[0])
    }else{
        res.send({'message': 'La categoria no existe'})
    }
})

router.delete('/delete-one/:id', async (req, res) => {
    const id = req.params.id
    const result = await db.query('DELETE FROM categorias WHERE id = ?', [id])
    
    res.send({'message': 'ok'})
})

module.exports = router