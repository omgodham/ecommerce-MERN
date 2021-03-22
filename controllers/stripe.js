const Product = require('../models/product');
const stripe = require('stripe')(process.env.SECRET_KEY);

//async and await is too important here without that code can be failed
exports.createSession = async (req,res) => {
    const YOUR_DOMAIN = 'https://kind-kirch-8c43f0.netlify.app/';
    const products = req.body;
    const lineItems = [];

    for await ( const thisProduct of products){
      const product = await Product.findById(thisProduct.product); 
      lineItems.push({
        price_data:{
            currency : 'usd',
            product_data: {
               name:product.name
            },
            unit_amount : product.price * 100,
        },
        quantity : thisProduct.quantity
    }); 
    }

// console.log(lineItems);
 const session = await stripe.checkout.sessions.create({
     payment_method_types: ['card'],
     line_items: lineItems,
         mode : 'payment',
         success_url: `${YOUR_DOMAIN}?success=true`,
         cancel_url: `${YOUR_DOMAIN}?canceled=true`,
        }) ;  
       return res.json({id: session.id});
}