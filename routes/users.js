var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const userInfo = require('../moudle/usersShcema');
const passport =require('passport');
const { use } = require('passport');
const { compile } = require('hbs');
const csrf = require('csurf');

/* GET users listing. */

router.use(csrf())

router.get('/signs', function (req, res, next) {
  console.log(req.isAuthenticated())
  var flashMassage = req.flash('local_signin')
  res.render('user/sign_in', {massage:flashMassage, token:req.csrfToken()})
});

router.post('/signs', [
  check('email').not().isEmpty().withMessage('please enter your email'),
  check('email').isEmail().withMessage('please enter your A email'),
  check('password').not().isEmpty().withMessage('please enter your password'),
  check('password').isLength({ min: 5 }).withMessage("password lenght must be more than 5"),
  check('c-password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('password and confirm-password dosent match')
    }
     return true;
  })
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.errors);
    var logInErrors = [];
    for(var i=0;i<errors.errors.length;i++){
      logInErrors.push(errors.errors[i].msg);
    }
    req.flash('local_signin',logInErrors);
    res.redirect('/users/signs')
    return;
  } next();
},
  passport.authenticate('local_signin',{
    session:false,
    successRedirect:'sign_up',
    failureRedirect:'signs',
    failureFlash:true,
  })
);



router.get('/sign_up',isNotSigned,(req,res,next)=>{
  console.log(req.isAuthenticated())
  const flashMassage = req.flash('sign_up_errs')
  res.render('user/sign_up', {flashMassage:flashMassage, token:req.csrfToken()})
})

router.get('/profile' ,isSigned, (req , res , next)=>{
 // var productquantity = 0 
  console.log(req.user.cart)
  if(req.user.cart){
    productquantity = req.user.cart.totalQuantity;
  }else{
    productquantity = 0
  }

  res.render('user/profile',{ifLotedOut:true,inProfile:true ,  productquantity : productquantity})
})

router.post('/sign_up',[
  check('email').not().isEmpty().withMessage('please enter your email'),
  check('email').isEmail().withMessage('please enter your A email'),
  check('password').not().isEmpty().withMessage('please enter your password'),
  check('password').isLength({ min: 5 }).withMessage("password lenght must be more than 5"),
],(req, res ,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.errors);
    var logInErrors = [];
    for(var i=0;i<errors.errors.length;i++){
      logInErrors.push(errors.errors[i].msg);
    }
    req.flash('sign_up_errs',logInErrors);
    res.redirect('/users/sign_up')
    return;
  }
  
  next();

},passport.authenticate('sign_up_passport' ,{
  successRedirect:'profile',
  failureRedirect:'sign_up',
  failureFlash:true,
} ))

router.get('/logout',isSigned,(req,res,next)=>{
  req.logOut();
  res.redirect('/')
})

function isSigned(req,res,next){
  if(! req.isAuthenticated()){
    res.redirect('sign_up')
    return ;
  }
  next();
}


function isNotSigned(req,res,next){
  if( req.isAuthenticated()){
    res.redirect('profile')
    return ;
  }
  next();
}



module.exports = router;

















