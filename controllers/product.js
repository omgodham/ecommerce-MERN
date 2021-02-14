const Product = require('../models/product');
const formidable = require('formidable');
const fs = require('file-system');
const _ = require('lodash');
//get product by id param
exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate('category')
    .exec((err,product) =>{
    if(err){
        return res.status(400).json({
            error:'No product of this id'
        });
    }
        req.product = product;
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
        const {name,description,price,category,stock} = fields;
        if(!name || !description || !price || !category || !stock ){
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
        products.photo = undefined;
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
exports.updateStock = (req,res,next) =>{
    const myOperations = req.body.order.products.map(product => {
        return {updateOne : {
            filter:{_id:product._id},
            update:{$set : {stock:prod.stock-1,sold:prod.sold+1}}
        }}
    });
    Product.bulkWrite(myOperations,{},(err,products)=>{
        if (err)
        return res.status(400).json({
            error:'failed update stock'
        });
        next();
    });
}