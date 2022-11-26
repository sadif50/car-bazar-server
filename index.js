const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB URI & CLEINT
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gh0wlz3.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() => {
    try{
        const categoriesCollection = client.db('CarBazar').collection('categories');
        const usersCollection = client.db('CarBazar').collection('users');
        const productCollection = client.db('CarBazar').collection('products');
        const bookingCollection = client.db('CarBazar').collection('booking');

        // Get All Category
        app.get('/categories', async(req, res) => {
            const query = {}
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
        })

        // Find One Specific Category
        app.get('/category/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const category = await categoriesCollection.findOne(query);
            res.send(category);
        })

        // Get Product By Category Name
        app.get('/category', async(req, res) => {
            const category_name = req.query.category_name;
            const query = {category: category_name};
            const category_data = await productCollection.find(query).toArray();
            res.send(category_data);
        })

        // Get Single User By Email
        app.get('/user', async(req, res) => {
            const email = req.query.email;
            const query = {email};
            const user = await usersCollection.findOne(query);
            res.send(user);
        })

        // get all seller and all buyers seperetly
        app.get('/users', async(req,res) => {
            const role = req.query.role;
            const query = {role: role};
            if(role === 'seller'){
                const all_sellers = await usersCollection.find(query).toArray();
                res.send(all_sellers);
            }
            if(role === 'buyer'){
                const all_buyer = await usersCollection.find(query).toArray();
                res.send(all_buyer);
            }
        })

        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result);
        })

        app.post('/addProduct', async(req, res) => {
            const user = req.body;
            const result = await productCollection.insertOne(user)
            res.send(result);
        });

        // Get all products and Seller wise products
        app.get('/products', async(req, res) => {
            const seller_email = req.query.seller_email;
            if(seller_email){
                const query = {seller_email};
                const sellerProduct = await productCollection.find(query).toArray();
                res.send(sellerProduct);
            }
            else {
                const query = {};
                const products = await productCollection.find(query).toArray();
                res.send(products);
            }
            
        });

        // Booking data store to server
        app.post('/booking', async(req, res) => {
            const bookingdata = req.body;
            const result = await bookingCollection.insertOne(bookingdata);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('Car Bazar Server Running!');
});

app.listen(port, ()=>{
    console.log(`Car Bazar Server Running on ${port}`);
});