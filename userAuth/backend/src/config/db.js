const mongoose=require("mongoose")

const connect=()=>{
    console.log('db connect success')
    return mongoose.connect("mongodb://127.0.0.1:27017/userAuth")
}


module.exports = connect