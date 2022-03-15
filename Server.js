const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


//use environment file
require('dotenv').config();

// use middlewar
app.use(bodyParser.json());
app.use(cors());


//root API for confirming the connection
app.get('/', (req, res) => {
     res.send('Hello courier service !!!')
});

//server Uniform Resource Identifier 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tjr1x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri);


async function run() {
     try {
          await client.connect();

          const database = client.db('courierService');
          const serviceCollection = database.collection('Services');

          //post api (get data from admin panel and post them into mongodb)
          app.post('/services', async (req, res) => {
               const services = req.body;
               const result = await serviceCollection.insertOne(services);

               res.json(result);
          });

          //get api (get all services from mongodb)
          app.get('/services', async (req, res) => {
               const cursor = serviceCollection.find({});
               const result = await cursor.toArray();

               res.json(result);
          });

          //get api (get specific user based on their _id for implement updating method)
          app.get('/services/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) };
               const service = await serviceCollection.findOne(query);

               res.json(service);
          });

          //update api
          app.put('/services/:id', async (req, res) => {
               const id = req.params.id;
               const serviceInfo = req.body;
               const filter = { _id: ObjectId(id) };
               const options = { upsert: true };

               const updateDoc = {
                    $set: {
                         name: serviceInfo.name,
                         description: serviceInfo.description,
                         image: serviceInfo.image
                    },
               };

               const result = await serviceCollection.updateOne(filter, updateDoc, options);

               res.json(result);
          });




     }
     finally {
          // await client.close();
     }
}
run().catch(console.dir);







app.listen(port, () => {
     console.log(`Example app listening on port ${port}`)
});