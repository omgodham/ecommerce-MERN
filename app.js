const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
//DB Connection
mongoose.connect('mongodb://localhost:27017/ecommerce',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log('MongoDB Connnected')
}).catch((err)=>{
    console.log('Error Occured Connecting To DB');
})

//middelwares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use('/api',userRoutes);
app.use('/api',authRoutes);

app.get('/',(req,res)=>{
    res.send('This is the API Page');
})

app.listen('8000',()=>{
console.log('Running at port 8000');
});