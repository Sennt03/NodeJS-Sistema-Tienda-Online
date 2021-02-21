module.exports = {

    isLoggedIn(req, res, next){
        if(req.isAuthenticated()){  // Por passport ya que nos ha poblado de metodos
            return next()
        }else{
            return res.redirect('/signin')
        }
    },

    isNotLoggedIn(req, res, next){
        if(!req.isAuthenticated()){
            return next()
        }else{
            return res.redirect('/cuenta')
        }
    },

    isAdmin(req, res, next){
        if(req.user == undefined){
            return res.redirect('/signin')
        }else{
            if(req.user.rol == 'admin'){
                return next()
            }else{
                res.redirect('/')
            }
        }
    },

    isAdminPlus(req, res, next){
        if(req.user == undefined){
            return res.redirect('/signin')
        }else{
            if(req.user.rol == 'admin'){
                if(req.user.email == 'david@david.com'){
                    next()
                }else{
                    res.redirect('/')
                }
            }else{
                res.redirect('/')
            }
        }
    }

}