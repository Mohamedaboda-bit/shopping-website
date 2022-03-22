const passport = require('passport');
const L_passport = require('passport-local').Strategy;
const Schema = require('../moudle/usersShcema');
const bcrypt = require('bcrypt');
const Cart = require('../moudle/cart')

passport.serializeUser((user,done)=>{
    return done(null,user)
})

passport.deserializeUser((id,done)=>{
    Schema.findById(id,('email'),(err,user)=>{
        Cart.findById(id , (err,cart)=>{
            if(!cart){
                return done(err,user)
            }
            user.cart = cart;
            return done(err , user);

        })
    })
})


passport.use('sign_up_passport', new L_passport({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
} , function(req, email, password, done)  {
    Schema.findOne({ email: email }, (err, user) => {
        if (err) {
            return done(err)
        }
        if (! user) {
            return done(null, false, req.flash('sign_up_errs', 'this eamil done not exists'))
        }
        console.log(Schema.password)

        const compareF =function(password){bcrypt.compare(password , user.password ,(errs,match)=>{
            if(errs){
                throw errs
            }
            if(match){
                console.log('pass match',user)
                return done(null,user)
            }else{
                console.log('dose not match')
                return done(null, false, req.flash('sign_up_errs', 'pass dose not match'))
            }
        })}
        compareF(password)

    }
    )}))

    

  passport.use('local_signin', new L_passport({
      usernameField:"email",
      passwordField:"password",
      passReqToCallback:true,
  },(req,email,password,done)=>{
    Schema.findOne({email:email},(err,user)=>{
        if(err){
            return done(err)
        }
        if(user){
            return done(null,false,req.flash('local_signin','this email already exist'))
        }
       const newUser = new Schema({
           email:email,
           password: new Schema().ecryptPassword(password),
       })
       newUser.save((err,user)=>{
            if(err){
                return done(err)
            }
            return done(null,user)
            
       })
    })
  }))