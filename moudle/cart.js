const mongoose = require("mongoose");

const cart = mongoose.Schema({
    _id:{
        required:true,
        type:String,
    },
    totalQuantity:{
        required:true,
        type:Number,
    },
    totalPrize:{
        required:true,
        type:Number,
    },
    selcetedProdects:{
        required:true,
        type:Array,
    },
});


module.exports = mongoose.model('cart',cart);