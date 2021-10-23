const express = require('express')
const {MongoClient} = require('mongodb')
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')

const app = express()
const port = 5000;

//Midleware
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://mydbuser1:00w20hMIWLUw9fGF@cluster0.pgkyz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("productMaster");
    const productCollection = database.collection("products");

    // GET API
    app.get('/products', async(req, res)=> {
        const cursor = productCollection.find({});
        const products = await cursor.toArray();
        res.send(products)
        console.log('hitting the products')
    })

    app.get('/products/:id', async(req, res)=> {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const product = await productCollection.findOne(query)
        res.send(product)
    })

    // POST API
    app.post('/products', async(req, res)=> {
        const newProduct = req.body
        const result = await productCollection.insertOne(newProduct)
        console.log('added new user', result)
        res.json(result)
    })

    //UPDATE API 
    app.put('/products/:id', async(req, res)=> {
        const id = req.params.id;
        const updateProduct = req.body;
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              name: updateProduct.name,
              price: updateProduct.price,
              quantity: updateProduct.quantity 
            },
          };
          const result = await productCollection.updateOne(filter,  updateDoc, options,)
          console.log('hitting updating', result)
          console.log(req)
          res.json(result)

    })

    //DELETE API
    app.delete('/products/:id', async(req, res)=> {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await productCollection.deleteOne(query)
        console.log('deleting result id', result)
        res.json(result)

    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=> {
    res.send('This is my product CRUD server')
})

app.listen(port, ()=> {
    console.log('listing the port', port)
})