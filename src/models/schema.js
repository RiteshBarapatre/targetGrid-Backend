const mongoose = require('mongoose')
const validator = require('validator')

const schema = new mongoose.Schema({
    name  :{
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        validate(v){
            if(!validator.isEmail(v)){
                console.log("Please Enter Valid Email...")
            }
        }
    },
    phone : {
        type : String,
        validate(v){
            if(!validator.isNumeric(v)){
                throw new Error('Phone number only contain Numbers')
            }
        }
    },
    address  :{
        type : String,
        required : true,
    },
})

const info = new mongoose.model('users',schema)

module.exports = info