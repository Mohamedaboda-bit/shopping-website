var express = require('express');
const shcema = require('../moudle/shcema');
var router = express.Router();
const schema = require('../moudle/shcema');
const Cart = require('../moudle/cart')

/* GET home page. */
router.get('/', function(req, res, next) {

    var productquantity = null

  if(req.isAuthenticated()){
    if(req.user.cart){
    productquantity = req.user.cart.totalQuantity;
    }else{
      productquantity = 0
    }
  }

 /* cart.deleteMany({},(err,doc)=>{
    if(err){console.log(err)}
    console.log(doc)
  })*/
  schema.find({},(error,doc)=>{
    if(error){
      console.log(error)
    }
    const prodactdata = [];
    const  grid = 1;
    for(var i=0; i<doc.length; i+=grid){
    prodactdata.push(doc.slice(i,i+grid))
    }

    res.render('index', { title: 'testing', data:prodactdata , ifLotedOut:req.isAuthenticated() , productquantity  :productquantity} );
  })
  // for delete all the data from the database (schema)
 /* schema.deleteMany({},(error,doc)=>{
    if(error){
      console.log(error)
    }
    console.log(doc)
  })  */
 
});

router.get('/addToCart/:id/:prize/:title',(req,res,next)=>{



  const cartID = req.user._id
  const productPrize = parseInt(req.params.prize,10)


  const prodactData = {
    id:req.params.id,
    prize:productPrize,
    name: req.params.title,
    Quantity:1,
  }

  console.log(cartID)
  console.log(req.params.id)

 
Cart.findOne({_id:cartID},(error,cart)=>{
  if(error){
    console.log(error)
  }

  if(!cart){
  
    const newCart = new Cart({
       _id:cartID,
       totalQuantity:1,
       totalPrize:productPrize,
       selcetedProdects:[prodactData],
    })
    

    newCart.save((err,doc)=>{

      if(err){console.log(err)}

      console.log(doc)
    })

   
}


if(cart){
  var productIndexN = -1
  for(var i=0 ; i<cart.selcetedProdects.length ; i++){
    if(req.params.id===cart.selcetedProdects[i].id){
      productIndexN = i;
      break;
    }
  }
  if(productIndexN>=0){
    cart.selcetedProdects[productIndexN].Quantity = cart.selcetedProdects[productIndexN].Quantity + 1;
    cart.selcetedProdects[productIndexN].prize = cart.selcetedProdects[productIndexN].prize + productPrize;
    cart.totalQuantity =  cart.totalQuantity +1;
    cart.totalPrize =  cart.totalPrize + productPrize;

    Cart.updateOne({_id:cartID} , {$set:cart} , (error,doc)=>{
      if(error){
        console.log(error)
      }
      console.log(doc)
      console.log(cart)
    })



  }else{

    cart.totalQuantity = cart.totalQuantity+1;
    cart.totalPrize = cart.totalPrize+productPrize;
    cart.selcetedProdects.push(prodactData);

    Cart.updateOne({_id:cartID} , {$set:cart} , (error,doc)=>{
      if(error){
        console.log(error)
      }
      console.log(doc)
      console.log(cart)
    })
    
  }
}
})

res.redirect("/")

})

router.get('/shopping-cart', (req, res, next)=>{


   if(req.isAuthenticated()){

    if(req.user.cart){
      productquantity = req.user.cart.totalQuantity;
    }else{
      productquantity = 0
    }

    shopCart = req.user.cart
    res.render('shopping-cart', {shopCart:shopCart ,  productquantity : productquantity})
   }else{
     res.redirect('/')
   }

})

router.get('/increase/:index', (req, res, next)=>{
  const prodactIndex = req.params.index;
  const userCart = req.user.cart;
  const prodactPrice = userCart.selcetedProdects[prodactIndex].prize / userCart.selcetedProdects[prodactIndex].Quantity;

  userCart.selcetedProdects[prodactIndex].Quantity = userCart.selcetedProdects[prodactIndex].Quantity + 1;
  userCart.selcetedProdects[prodactIndex].prize = userCart.selcetedProdects[prodactIndex].prize  + prodactPrice;

  userCart.totalQuantity = userCart .totalQuantity + 1;
  userCart.totalPrize = userCart.totalPrize + prodactPrice;

  Cart.updateOne({_id : userCart._id} , {$set : userCart} , (err,doc)=>{
    if(err){
      console.log(err)
    }else{
      console.log(doc)
    }
  })
  res.redirect('/shopping-cart')
})


router.get('/decrease/:index', (req, res, next)=>{
  const prodactIndex = req.params.index;
  const userCart = req.user.cart;
  const prodactPrice = userCart.selcetedProdects[prodactIndex].prize / userCart.selcetedProdects[prodactIndex].Quantity;

  userCart.selcetedProdects[prodactIndex].Quantity = userCart.selcetedProdects[prodactIndex].Quantity - 1;
  userCart.selcetedProdects[prodactIndex].prize = userCart.selcetedProdects[prodactIndex].prize  - prodactPrice;

  userCart.totalQuantity = userCart .totalQuantity - 1;
  userCart.totalPrize = userCart.totalPrize - prodactPrice;

  Cart.updateOne({_id : userCart._id} , {$set : userCart} , (err,doc)=>{
    if(err){
      console.log(err)
    }else{
      console.log(doc)
    }
  })
  res.redirect('/shopping-cart')
})


router.get('/deleteindex/:index', (req,res,next)=>{

 const index = req.params.index;
 const userCart = req.user.cart;
console.log(userCart.selcetedProdects.length)
 if(userCart.selcetedProdects.length <= 1){
 Cart.deleteOne({_id:userCart._id},(err,doc)=>{
  if(err){
    console.log(err)
  }

  res.redirect('/shopping-cart')
 })}else{
 userCart.totalPrize = userCart.totalPrize - userCart.selcetedProdects[index].prize;
 userCart.totalQuantity = userCart.totalQuantity - userCart.selcetedProdects[index].Quantity;
 userCart.selcetedProdects.splice(index,1)

 Cart.updateOne({_id:userCart._id},{$set:userCart},(err,doc)=>{
   if(err){
     console.log
   }
   console.log(doc)
   res.redirect('/shopping-cart')
 })
}
//test
})


module.exports = router;