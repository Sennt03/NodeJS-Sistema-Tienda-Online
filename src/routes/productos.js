const { Router } = require('express')
const router = Router()
const { unlink } = require('fs-extra')
const path = require('path')

const db = require('../database')
const { isAdmin } = require('../lib/auth')

const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

router.get('/gestion', isAdmin, async (req, res) => {
    const categorias = await db.query('SELECT * FROM categorias')

    res.render('productos/index', { categorias })
})

router.get('/:id', async (req, res) => {
    
    const id = req.params.id
    const producto = await db.query('SELECT p.*, c.name as "categoria" FROM productos p INNER JOIN categorias c ON p.categoria_id = c.id WHERE p.id = ?', [id])
    
    res.render('productos/detalles', { producto: producto[0] })
})

router.get('/edit/:id', isAdmin, async (req, res) => {
    const id = req.params.id
    const producto = await db.query('SELECT * FROM productos WHERE id = ?', [id])
    const categorias = await db.query('SELECT * FROM categorias')
    res.render('productos/edit', { producto: producto[0], categorias })
})

router.post('/edit/:id', isAdmin, async (req, res) => {
    const id = req.params.id
    const { name, descripcion, precio, stock, categoria } = req.body
    const imagen = req.file
    console.log(req.body)
    console.log(imagen)
    if(name && descripcion && precio && stock && categoria){
        if(imagen){
            const response = await cloudinary.v2.uploader.upload(imagen.path)
            const public_id = response.public_id
            const secure_url = response.secure_url
            unlink(path.resolve('./src/public/uploads/'+imagen.filename))
            const producto = await db.query('SELECT * FROM productos WHERE id = ?', [id])
            await cloudinary.v2.uploader.destroy(producto[0].public_id)
            await db.query('UPDATE productos SET imagen=?, public_id=? WHERE id=?', [secure_url, public_id, id])
        }
        
        const sql = `UPDATE productos SET categoria_id=${categoria}, name='${name}', descripcion='${descripcion}', precio=${precio}, stock=${stock} WHERE id = ${id}`
        await db.query(sql)
        req.flash('ok', 'Producto actualizado correctamente')
        res.redirect('/producto/gestion')
    }else{
        req.flash('err', 'LLene todos los campos porfavor')
        res.redirect('/producto/edit/'+id)
    }
})


// API
router.get('/get/all', async (req, res) => {
    const productos = await db.query('SELECT p.*, c.name as "categoria" FROM productos p INNER JOIN categorias c ON p.categoria_id = c.id ORDER BY p.id DESC')
    if(productos[0]){
        res.send(productos)
    }else{
        res.send({'message': 'No hay productos !Añade uno¡'})
    }
})

router.post('/add', async (req, res) => {
    const { name, descripcion, precio, stock, categoria } = req.body
    const imagen = req.file
    if(name && descripcion && precio && stock && categoria && imagen){
        const response = await cloudinary.v2.uploader.upload(imagen.path)
        const public_id = response.public_id
        const newProduct = {
            categoria_id: categoria,
            name,
            descripcion,
            precio,
            stock,
            imagen: response.secure_url,
            public_id
        }
        const rows = await db.query('INSERT INTO productos SET ?', [newProduct])
        unlink(path.resolve('./src/public/uploads/'+imagen.filename))
        req.flash('ok', 'Producto añadido correctamente')
        res.redirect('/producto/gestion')
    }else{
        if(imagen){
            unlink(path.resolve('./src/public/uploads/'+imagen.filename))
        }
        req.flash('err', 'Llene todos los campos porfavor')
        res.redirect('/producto/gestion')
    }
})

router.get('/get/one/:id', async (req, res) => {
    const id = req.params.id
    const producto = await db.query('SELECT * FROM productos WHERE id = ?', [id])
    if(producto[0]){
        res.send(producto[0])
    }else{
        res.send('El producto no existe')
    }
})

router.delete('/delete-one/:id', async (req, res) => {
    const id = req.params.id
    const producto = await db.query('SELECT * FROM productos WHERE id = ?', [id])
    await db.query('DELETE FROM productos WHERE id = ?', [id])
    await cloudinary.v2.uploader.destroy(producto[0].public_id)
    res.send('ok')
})

module.exports = router