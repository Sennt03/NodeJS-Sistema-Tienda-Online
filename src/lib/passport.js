const passport = require('passport')
const Strategy = require('passport-local').Strategy

const db = require('../database')
const helpers = require('./helpers')


// LOGIN
passport.use('local.signin', new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    
    const rows = await db.query('SELECT * FROM users WHERE email = ?', [email])
    
    if(rows.length > 0){
        const user =  rows[0]
        const validate = await helpers.matchPassword(password, user.password)
        if(validate){
            done(null, user, req.flash('ok', 'Welcome'))
        }else{
            done(null, false, req.flash('err', 'Contraseña incorrecta'))
        }
    }else{
        done(null, false, req.flash('err', 'El correo no existe'))
    }
}))



// REGISTER
passport.use('local.signup', new Strategy({
    usernameField: 'username', 
    passwordField: 'apellido',
    passReqToCallback: true  // SI QUIERES RECIBIR MAS DATOS
}, async (req, username, apellido, done) => {
    const { email, password, rol } = req.body
    const newUser = {
        name: username,
        lastname: apellido,
        email,
        password: password[0],
        rol: 'user'
    }
    console.log(rol)
    if(rol){
        newUser.rol = rol
    }
    newUser.password = await helpers.encryptPassword(password[0])
    try{
        const result = await db.query('INSERT INTO users SET ?', [newUser])
        newUser.id = result.insertId
        done(null, newUser)
    }catch(e){
        done(null, false, req.flash('err', 'El correo ya esta registrado'))
    }
}))


// SERIALIZE esto es que cuando nos identificamos lo almacena en la session
passport.serializeUser((user, done) => {
        done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    const rows = await db.query('SELECT * FROM users WHERE id = ?', [id])
    done(null, rows[0])
})