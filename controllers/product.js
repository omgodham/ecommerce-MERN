const Product = require('../models/product');
const formidable = require('formidable');
const fs = require('file-system');
const _ = require('lodash');
const product = require('../models/product');

//get product by id param
exports.getProductById = (req,res,next,id) => {
    // console.log(id);
    Product.findById(id)
    .populate('category')
    .exec((err,product) =>{
    if(err){
        return res.status(400).json({
            error:'No product of this id'
        });
    }
        req.product = product;
        // console.log(req.product);
        next();
    });
    }

 //create product
 exports.createProduct = (req,res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file)=>{
        if(err){
           return res.status(400).json({
            error:'error in creating form'
           });
        }
        const {name,description,price,category,stock,subcategory} = fields;
        if(!name || !description || !price || !category || !stock || !subcategory ){
            console.log(name,description,price,category,subcategory,stock);
            return res.status(400).json({
                error:'please enter all fields'
            });
        }

        let product = new Product(fields);
        if(file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error:'file size is too big'
                   });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.ContentType = file.photo.type;
        }

        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    err,
                    error:'product saved in DB failed'
                   });
            }
            product.photo = undefined;
            res.status(200).json(product);
        });
    });
 }


 //get the product
exports.getProduct = (req,res) =>{
    // console.log(req.product);
        Product.findById(req.product._id).exec((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:'product not found'
                   });
            }
            product.photo = undefined;
            res.status(200).json(product);
        });
}


//delete product
exports.deleteProduct = (req,res) =>{
    Product.findByIdAndRemove((req.product._id),{
        useFindAndModify:false
    },(err,deletedProduct) =>{
        if(err){
            return res.status(400).json({
                error:'product deletion failed'
               });
        }
        res.status(200).json({
            message:'deleted successfully'
        });
    });
}


//get all products
exports.getAllProducts = (req,res) => {
    Product.find()
    .select('-photo')
    .exec((err,products) =>{
        if(err){
            return res.status(400).json({
                error:'products not found'
               });
        }
        res.status(200).json(products);
    });
}
 
//update the product
exports.updateProduct = (req,res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file)=>{
        if(err){
           return res.status(400).json({
            error:'error in creating form'
           });
        }

        let product = _.extend(req.product,fields);

        if(file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error:'file size is too big'
                   });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.ContentType = file.photo.type;
        }

        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:'product saved in DB failed'
                   });
            }
            product.photo = undefined;
            res.status(200).json(product);
        });
    });
}


//get the photo of the product
exports.getPhoto = (req,res) =>{
    if(req.product.photo){
        res.set('Content-Type',req.product.photo.ContentType);
       return res.send(req.product.photo.data);
    }else{
        return res.status(400).json({
            error:'there is no photo of product'
        });
    }
}


//middleware to update the stock
exports.updateStock =   (req,res,next) => {

 req.body.products.map( async (currentProduct) => {

    const thisProduct = await Product.findById(currentProduct.product);
    
    Product.findByIdAndUpdate(currentProduct.product,{stock:(thisProduct.stock - currentProduct.quantity) , sold:(thisProduct.sold + parseInt(currentProduct.quantity))},{new:true,useFindAndModify:false},(err,updatedUser) => {
        if(err) res.status(400).json({err,error:'unable to update the stock'});
    });
 });
 next();
}


//get products by category
exports.getProductsByCategory = (req,res) =>{
    Product.find({category:req.query.category})
    .select('-photo')
    .exec((err,products) => {
        if (err)
        return res.status(400).json({
            error:'products not found for particular category'
        });
        res.status(200).json(products);
    });
}

//get products having particular category and subcategory
exports.getProductsByCategoryAndSubcategory = (req,res) =>{
    Product.find({category:req.query.category,subcategory:req.query.subcategory})
    .select('-photo')
    .exec((err,products) => {
        if (err)
        return res.status(400).json({
            error:'products not found for particular category'
        });
        res.status(200).json(products);
    });
}


//get the products having particular subcategory
exports.getProductsBySubCategory = (req,res) =>{
    Product.find({subcategory:req.query.subcategory})
    .select('-photo')
    .exec((err,products) => {
        if (err)
        return res.status(400).json({
            error:'products not found for particular category'
        });
        res.status(200).json(products);
    });
}

exports.searchProducts = async (req,res) => {
    const {query} = req.body;
    const products = await Product.find({}).select('-photo');
    const searchProducts = [];
    products.map(product => {
       const name = product.name.toLowerCase();
       if(name.includes(query.toLowerCase())) 
       searchProducts.push(product);
    });
    res.status(200).json(searchProducts);
}