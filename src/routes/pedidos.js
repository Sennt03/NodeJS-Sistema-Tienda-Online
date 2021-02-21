const { Router } = require('express')
const router = Router()
const db = require('../database')
const { isLoggedIn, isAdmin } = require('../lib/auth')

router.get('/', isLoggedIn, (req, res) => {
    const total = parseInt(req.session.total)
    if(req.session.carrito && total > 0){
        let costo_total = 0

        req.session.carrito.forEach(producto => {
            costo_total = costo_total + producto.precio * producto.unidades
        });

        res.render('pedidos/index', { costo_total })
    }else{
        req.flash('err', 'El carrito esta bacio añade algun producto')
        res.redirect('/carrito')
    }
})

router.get('/gestion', isAdmin, async (req, res) => {
    const pendientes = await db.query("SELECT * FROM pedidos WHERE estado = 'pendiente'")
    const enviados = await db.query("SELECT * FROM pedidos WHERE estado = 'enviado'")
    const entregados = await db.query("SELECT * FROM pedidos WHERE estado = 'entregado'")

    res.render('pedidos/gestion', { pendientes, enviados, entregados })
})

router.post('/edit/estado/:estado/:id', async (req, res) => {
    const { estado, id } = req.params
    await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id])
    res.send('ok')
})

router.get('/detalle/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id
    const pedido = await db.query('SELECT * FROM pedidos WHERE id = ?', [id])
    if(pedido[0]){
        if(pedido[0].user_id == req.user.id  || req.user.rol == 'admin'){
            const productos = await db.query('SELECT lp.*, p.name, p.imagen, p.descripcion, p.precio FROM linea_pedidos lp INNER JOIN productos p ON lp.producto_id = p.id WHERE lp.pedido_id = ?', [id])
            const user = await db.query('SELECT * FROM users WHERE id = ?', [pedido[0].user_id])
            res.render('pedidos/detalles', { pedido: pedido[0], productos, usuario: user[0] })
        }else{
            res.redirect('/cuenta')
        }
    }else{
        req.flash('err', 'El pedido no existe')
        res.redirect('/cuenta')
    }
})


router.post('/pedir', async (req, res) => {
    const { provincia, ciudad, direccion } = req.body
    if(provincia && ciudad && direccion){
        // HACER PEDIDO
        let costo_total = 0

        req.session.carrito.forEach(producto => {
            costo_total = costo_total + producto.precio * producto.unidades
        });

        let meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
        let f = new Date();
        const fecha = f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();

        const newPedido = {
            user_id: req.user.id,
            cantidad_productos: req.session.total,
            costo: costo_total,
            provincia,
            ciudad,
            direccion,
            fecha,
            estado: 'pendiente'
        }
        const row = await db.query('INSERT INTO pedidos SET ?', [newPedido])

        // HACER LINEA_PEDIDO

        for(let producto of req.session.carrito) {
            let precio = producto.unidades * producto.precio
            const newLineaPedido = {
                pedido_id: row.insertId,
                producto_id: producto.producto_id,
                cantidad: producto.unidades,
                costo: precio
            }
            let linea_pedido = await db.query('INSERT INTO linea_pedidos SET ?', [newLineaPedido])
            // REDUCIR STOCK
            let linea = await db.query('SELECT * FROM linea_pedidos WHERE id = ?', [linea_pedido.insertId])
            linea = linea[0]
            let menos = linea.cantidad
            let res_producto = await db.query('SELECT * FROM productos WHERE id = ?', [linea.producto_id])
            let stock = res_producto[0].stock
            stock = stock - menos
            await db.query('UPDATE productos SET stock = ? WHERE id = ?', [stock, linea.producto_id])
        }
        req.session.carrito = []
        req.session.total = 0

        req.flash('ok', 'Pedido realizado correctamente')
        res.redirect('/cuenta')
    }else{
        req.flash('err', 'Llene todos los campos porfavor')
        res.redirect('/pedido')
    }
})

module.exports = router