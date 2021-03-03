const User = require('../models/user');


//get user by id middleware
exports.getUserById = (req, res, next, id) => {
    User.findById(id, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: 'there is no user of this id'
            })
        }
        req.profile = user;
        next();
    });
}


//get cart product by id middleware
exports.getProductInCartById = (req, res, next, id) => {
    User.find({ "cart.product": id }, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: 'there is no user of this id'
            })
        }
        //here we get array containing that user object hence user[0].cart
        user[0].cart.map((thisProduct, index) => {
            if (thisProduct.product === id)
                req.cartProduct = thisProduct;
        });
        next();
    })
}


//get product by id
exports.getProductInCart = (req, res) => {
    return res.status(200).json(req.cartProduct);
}



//get user whole cart  by id of user
exports.getUserCart = (req, res) => {
    User.findOne({ _id: req.profile._id }, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: 'there is no user of this id'
            })
        }
        //here we get direct matching user object hence user.cart 
        res.status(200).json(user.cart);
    })
}

//create cart for particular user by id of that user
exports.createCart = (req, res) => {
    User.findOne({ _id: req.profile._id }, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: 'there is no user of this id'
            })
        }
        user.cart.push(req.body);
        // console.log(user.cart[0]);
        user.save((err, user) => {
            if (err) console.log(err);
            else res.status(200).json(user);
        });
        // console.log(user.cart);
    });
}


//update product in cart by id of that product
exports.updateProductInCart = (req, res) => {
    User.findOneAndUpdate({ "cart.product": req.cartProduct.product, _id: req.profile._id },
        { $set: { 'cart.$.quantity': req.body.quantity } },
        { new: true, useFindAndModify: false },
        (err, updatedUser) => {
            if (err) {
                return res.status(400).json({
                    error: 'Not able to update'
                });
            }
            updatedUser.cart.map(thisProduct => {
                if (thisProduct.product === req.cartProduct.product)
                    res.status(200).json(thisProduct);
            })
        });
}

exports.deleteProdctFromCart = (req, res) => {
    User.find({ "cart.product": req.cartProduct.product, _id: req.profile._id },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    err,
                    error: 'Not able to delete'
                });
            }
            //let newCart = JSON.parse(user[0].cart);
            let newCart = JSON.parse(JSON.stringify(user[0].cart))
            console.log("before",newCart);
            newCart = newCart.filter(thisProduct => {
                if (thisProduct.product !== req.cartProduct.product)
                    return thisProduct;
            });
            console.log("after",newCart);
            user.cart = newCart;
            user.save((err, user) => {
                if (err) console.log(err);
                else res.status(200).json(user);
            }); 
});
}


//get user by id
exports.getUser = (req, res) => {
    User.findOne({ _id: req.profile._id }, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: 'there is no user of this id'
            })
        }
        user.encryPassword = undefined;
        res.status(200).json(user);
    });
}

//update user by id
exports.updateUser = (req, res) => {
    const user = new User(req.body);
    User.findByIdAndUpdate(req.profile._id,
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (err, updatedUser) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'User not found for updation'
                });
            }
            res.status(200).json(updatedUser);
        });
}

//push order in purchase list middleware
exports.pushOrderInPurchaseList = (req, res, next) => {
    let order = req.body;
    User.findById(req.profile._id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found for pushing order'
            });
        }
        user.orders.push(order);
        user.save();
    });
    next();
}