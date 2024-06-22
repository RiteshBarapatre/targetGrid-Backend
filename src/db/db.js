const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({path : path.join(__dirname, '../../config.env')})
const uri = process.env.DATABASE
mongoose.set('strictQuery',false)

const db = ()=>{mongoose.connect(uri).then(()=>console.log("Connection Successful...")).catch((err)=>console.log(err))}

module.exports = db