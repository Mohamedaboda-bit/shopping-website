const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userInfo = mongoose.Schema({
        email:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
        },
    })

userInfo.methods.ecryptPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
}


 module.exports = mongoose.model('userInfos',userInfo);