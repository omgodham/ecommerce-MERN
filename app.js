const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
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
app.use(bodyParser.urlencoded({ extended: false }));
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin": "*")
//   }); 
//Routes
app.use('/api',userRoutes);
app.use('/api',authRoutes);
app.use('/api',categoryRoutes);
app.use('/api',productRoutes);
app.use('/api',orderRoutes);

app.get('/',(req,res)=>{
    res.send('This is the API Page');
})

app.listen('8000',()=>{
console.log('Running at port 8000');
});