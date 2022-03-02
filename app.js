const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://Arbii_xD:madnimunna@cluster0.08grc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true  , useUnifiedTopology: true }).then(() => {
    console.log('Connected to database!');
}).catch((err) => {
    console.log(`Connection failed! ${err}`);
});



const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});



const product = new mongoose.model('Product', productSchema);




const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());




// Read/getting  all products 

app.get('/api/v1/viewProducts', async(req, res) => {
    const products = await product.find();
    res.status(200).json({
        success : true,
        products
    });
});




// Create a new product

app.post('/api/v1/product/new', async(req, res) => {
    const Product = await product.create(req.body);


    res.status(200).json({
        success: true,
        Product
    })


});




// Update a product

app.put('/api/v1/updateProduct/:id', async(req, res) => {
    let products = await product.findById(req.params.id);
    products = await product.findByIdAndUpdate(req.params.id, req.body, {new:true , useFindAndModify:true , runValidators:true});
    if (!products) return res.status(404).send('The Product with the given ID was not found.');
    res.status(201).json({
        success: true,
        products
    })

});



// delete a product

app.delete('/api/v1/delProduct/:id', async(req, res) => {
    const products = await product.findById(req.params.id);
    if (!products){
         return res.status(500).json({
            success: false,
            message: 'Product not found'
         });}

    await products.remove();

    res.status(200).json({
        success: true,
        message: 'Product deleted!'
    })
});





app.listen(3000, () => {
    console.log('Server started on port 3000');
});