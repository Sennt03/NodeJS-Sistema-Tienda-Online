const { Router } = require('express')
const router = Router()
const passport = require('passport')

const { isLoggedIn, isNotLoggedIn, isAdminPlus } = require('../lib/auth')

const db = require('../database')

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/login')
})

router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/cuenta',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next)
})

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/register')
})

router.get('/signup/admin', isAdminPlus, (req, res) => {
    res.render('auth/register-admin')
})

router.post('/signup', (req, res, next) => {
    const { username, apellido, email, password, rol } = req.body
    console.log(rol)
    if(username && apellido && email && password[0] && password[1]){
        if(password[0] == password[1]){
            if(password[0].length >= 8){
                passport.authenticate('local.signup', {
                    successRedirect: '/cuenta',
                    failureRedirect: '/signup',
                    failureFlash: true
                })(req, res, next)
            }else{
                req.flash('err', 'La contraseña debe tener al menos 8 caraceteres')
                res.redirect('/signup')
            }
        }else{
            req.flash('err', 'Las contraseñas no coinciden')
            res.redirect('/signup')
        }
    }else{
        req.flash('err', 'Llene todos los campos porfavor')
        res.redirect('/signup')
    }
})

router.get('/cuenta', isLoggedIn, async (req, res) => {
    const user_id = req.user.id
    const pedidos = await db.query('SELECT * FROM pedidos WHERE estado="pendiente" AND user_id=?', [user_id])
    
    res.render('cuenta', { pedidos })
})

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout()
    res.redirect('/signin')
})

module.exports = router