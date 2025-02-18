const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './config.env' });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.ATLAS_URI);

async function main() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('codeconnect');
    const collections = await db.collections();
    collections.forEach((collection) => console.log(collection.s.namespace.collection));
    
    // Example route to get all documents from a collection
    app.get('/api/collection/:name', async (req, res) => {
      try {
        const collectionName = req.params.name;
        const collection = db.collection(collectionName);
        const documents = await collection.find({}).toArray();
        res.json(documents);
      } catch (e) {
        res.status(500).json({ error: 'Error fetching documents' });
      }
    });

  } catch (e) {
    console.error(e);
  } finally {
    // Do not close the client here, as we want to keep the connection open for the server
  }
}

main().catch(console.error);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});