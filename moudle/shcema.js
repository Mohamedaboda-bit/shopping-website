const mongoose = require('mongoose')

const prodouct = mongoose.Schema({
    img :{
        type:String,
        required:true,
    },

   title:{
      type:String,
      required:true,
   },

   info:{
      type:{
         stornge:String,
         ram:Number,
         prosser:String, 
      },
      required:true
   },
    
   prize:{
      type:Number,
      required:true
   },
})
module.exports = mongoose.model('schema',prodouct)