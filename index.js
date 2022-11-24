const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get('/categories', async(req, res) => {
            const query = {}
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
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