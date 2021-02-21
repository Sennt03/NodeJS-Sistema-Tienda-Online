const { Router } = require('express')
const router = Router()

const db = require('../database')

router.get('/', async (req, res) => {
    let costo_total = 0
    if(req.session.carrito){
        req.session.carrito.forEach(producto => {
            costo_total = costo_total + producto.precio * producto.unidades
        });
    }
    res.render('carrito', { costo_total })
})

router.get('/get/all', (req, res) => {
    if(req.session.carrito){
        res.send({carrito: req.session.carrito})
    }else{
        res.send('el carrito esta vacio')
    }
})

router.post('/add/:id', async (req, res) => {
    const id = req.params.id
    const producto = await db.query('SELECT * FROM productos WHERE id = ?', [id])
    
    if(req.session.carrito){
        let counter = 0
        req.session.carrito.forEach(producto => {
            if(producto.producto_id == id){
                producto.unidades++
                counter++
            }
        });
        if(counter == 0){
            req.session.carrito.push({
                producto_id: producto[0].id,
                precio: producto[0].precio,
                unidades: 1,
                producto: producto[0]
            })
        }
    }else{
        req.session.carrito = []
        req.session.carrito.push({
            producto_id: producto[0].id,
            precio: producto[0].precio,
            unidades: 1,
            producto: producto[0]
        })
    }

    let total = 0
    req.session.carrito.forEach(producto => {
        total = total + producto.unidades
    });

    req.session.total = total

    res.send({carrito: req.session.carrito, total: req.session.total})
})


router.post('/mas/:id', (req, res) => {
    const id = req.params.id
    req.session.carrito.forEach(producto => {
        if(producto.producto_id == id){
            producto.unidades++
        }
    })

    let total = 0
    req.session.carrito.forEach(producto => {
        total = total + producto.unidades
    });

    req.session.total = total

    res.send({carrito: req.session.carrito})
})

router.post('/menos/:id', (req, res) => {
    const id = req.params.id
    req.session.carrito.forEach(producto => {
        if(producto.producto_id == id){
            producto.unidades--
        }
    });

    let total = 0
    req.session.carrito.forEach(producto => {
        total = total + producto.unidades
    });

    req.session.total = total

    res.send({carrito: req.session.carrito})
})

router.get('/delete', (req, res) => {
    req.session.carrito.forEach((producto, index) => {
        if(producto.unidades == 0){
            req.session.carrito.splice(index, 1)
        }
    });

    let total = 0
    req.session.carrito.forEach(producto => {
        total = total + producto.unidades
    });

    req.session.total = total
    
    res.send(req.session.carrito)
})


router.get('/get/precio/:id', (req, res) => {
    const id = req.params.id
    let costo = false
    req.session.carrito.forEach(producto => {
        if(producto.producto_id == id){
            costo = producto.unidades * producto.precio
        }
    })
    res.send({costo})
    
})


router.get('/get/total/costo', (req, res) => {
    let costo = 0
    req.session.carrito.forEach(producto => {
        costo = costo + producto.precio * producto.unidades
    })

    res.send({costo})
})

router.delete('/delete/all', (req, res) => {
    if(req.session.carrito){
        req.session.carrito = []
    }

    if(req.session.total){
        req.session.total = 0
    }

    res.send({'message': 'ok'})
})

module.exports = router