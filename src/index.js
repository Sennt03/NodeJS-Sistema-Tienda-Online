const express  = require('express')
const path = require('path')
const session = require('express-session')
const mySqlSession = require('express-mysql-session')
const flash = require('connect-flash')
const { database } = require('./keys')
const passport = require('passport')
const multer = require('multer')

if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}

// Inicializaciones
const app = express()
require('./lib/passport')

// Settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Middlewars
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(session({
    secret: 'sennt',
    resave: 'false',
    saveUninitialized: 'false',
    store: new mySqlSession(database)
}))
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime()+path.extname(file.originalname))
    }
})
app.use(multer({
    storage: storage
}).single('imagen'))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

// Variables Globales
app.use((req, res, next) => {
    app.locals.ok = req.flash('ok')
    app.locals.err = req.flash('err')
    app.locals.user = req.user
    app.locals.carrito = req.session.carrito
    app.locals.total = req.session.total

    next()
})

// Routes
app.use(require('./routes/index'))
app.use(require('./routes/auth'))
app.use('/carrito', require('./routes/carrito'))
app.use('/producto', require('./routes/productos'))
app.use('/categoria', require('./routes/categorias'))
app.use('/pedido', require('./routes/pedidos'))

// Statics Files
app.use(express.static(path.join(__dirname, 'public')))

// Server
app.listen(app.get('port'), () => {
    console.log('Server on port:', app.get('port'))
})