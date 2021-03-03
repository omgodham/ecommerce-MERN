const Category = require('../models/category');


//get category by id param
exports.getCategoryById = (req,res,next,id) => {
Category.findById(id,(err,category) =>{
if(err){
    return res.status(400).json({
        error:'No category of this id'
    });
}
    req.category = category;
    next();
});
}


//create category
exports.createCategory = (req,res) =>{
    const category = new Category(req.body);
    category.save((err,category)=>{
        if(err){
            return res.status(400).json({
                err,
                  error:'category cannot be create' 
              });
          }
          res.status(200).json(category);
    });    
    }

//get category by id
exports.getCategory = (req,res) => {
    Category.findOne({_id:req.category._id},(err,category)=>{
        if(err){
            return res.status(400).json({
                error:'there is no category of this id'
            })
        }
        res.status(200).json(category);
    });
  }

  //get all categories
  exports.getAllCategories = (req,res) => {
    Category.find({},(err,categories)=>{
        if(err){
            return res.status(400).json({
                error:'there is no category of this id'
            })
        }
        res.status(200).json(categories);
    });
  }

  //update category
  exports.updateCategory = (req,res) =>{
    Category.findByIdAndUpdate(req.category._id,
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,updatedCategory)=>{
        if(err || !updatedCategory){
          return res.status(400).json({
                error:'category not found for updation' 
            });
        }
        res.status(200).json(updatedCategory);
    });
}

//delete category
exports.deleteCategory = (req,res) =>{
    Category.findByIdAndRemove(req.category._id,{
        useFindAndModify:false
    },(err,category)=>{
        if(err){
        return res.status(400).json({
            error:'category deletion failed' 
        });
    }
    res.status(200).json({
        message:'Deleted Successfully'
    });
});
}
