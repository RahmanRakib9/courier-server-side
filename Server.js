const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');


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

          //post api 
          app.post('/services', async (req, res) => {
               const services = req.body;
               const result = await serviceCollection.insertOne(services);

               res.json(result);
          })



     }
     finally {
          // await client.close();
     }
}
run().catch(console.dir);







app.listen(port, () => {
     console.log(`Example app listening on port ${port}`)
});