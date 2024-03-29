const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const productsSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true,
    },
    price: {
        type : Number,
        required : true,
    },
    description: {
        type : String,
        required : true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const product = mongoose.model("Products", productsSchema);

// Create
app.post("/products", async (req, res) => {
    try {
       const newProduct = new product({
            title : req.body.title,
            price : req.body.price,
            description: req.body.description,
        });
        const productData = await newProduct.save();

        return res.send({productData});
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
});

// Read
app.get('/products', async (req, res) => {
    try {
        const price = req.query.price;
        const products = await product.find({price: {$gt: price}});
        if(products)
            return res.send(products);
        else
            return res.status(500).send({message: "Products not found"});
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const products = await product.findOne({_id: req.params.id}, {title: 1, _id: 0, price: 1});
        if(products)
            return res.send({
                success: true,
                message: "return single product",
                data: products
            });
        else
            return res.status(500).send({message: "Products not found"});
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
});

//Update
app.put('/products/:id', async (req, res) => {
    try {
        const products = await product.findByIdAndUpdate({_id: req.params.id}, {$set: {price: 700}}, {new: true});
        if(products)
            return res.send({
                success: true,
                message: "updated single product",
                data: products
            });
        else
            return res.status(500).send({message: "Products not found"});
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
});

// Delete
app.delete('/products/:id', async (req, res) => {
    try {
        const products = await product.findByIdAndDelete({_id: req.params.id});
        console.log(products);
        if(products)
            return res.send({
                success: true,
                message: "deleted single product",
                data: products
            });
        else
            return res.status(500).send({message: "Products not found"});
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
});

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1/testProductDB');
        console.log("db is connected");
    } catch (error) {
        console.log("db is not connected");
        console.log(error.message);
        process.exit(1);
    }
}

app.listen(3000, async () => {
    console.log(`Node api app is running on port 3000`);
    await connectDB();
});