const prodouct = require('../moudle/shcema')
const mongoose =require('mongoose')


mongoose.connect('mongodb://localhost/eShop',(error)=>{
  if(error){
    console.log(error)
  }
  console.log("DB CONECTED")
})


const prosData = [
    new prodouct({
        img: '../images/apple-iphone-x.jpg',
        title: 'IPONE x',
        info: {
            stornge: "128G",
            ram: '4',
            prosser: "A12 BIONIC",
        },
        prize: '700',
    }),
    new prodouct({
        img: '../images/iPhone11-1.png',
        title: 'IPONE 11 ',
        info: {
            stornge: "256G",
            ram: '5',
            prosser: "A13+ BIONIC",
        },
        prize: '900',
    }), 
    new prodouct({
        img: '../images/Apple-iPhone-SE-2020-2.jpg',
        title: 'IPONE SE 2020',
        info: {
            stornge: "64G",
            ram: '3',
            prosser: "A13 BIONIC",
        },
        prize: '400',
    })
] 
done = 0;
for(var i = 0 ; i < prosData.length ; i++){
    console.log(i)
     prosData[i].save((error,doc)=>{
        if(error){
            console.log(error)
        }else{

            console.log(doc)
        }
        done++
        if( done === prosData.length){
            mongoose.disconnect();
        }
     })
}

