const express = require('express');
const app = express();

app.get('/api',(req,res)=>{
    res.send('This is the API Page');
})

app.listen('8000',()=>{
console.log('Running at port 8000');
});