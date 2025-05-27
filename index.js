require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = process.env.MONGO_URI;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const jobsCollection = client.db("alvinmonir411").collection("myjobs");
    const applicantcollections = client
      .db("alvinmonir411")
      .collection("applicant");

    app.get("/jobs", async (req, res) => {
      try {
        const result = await jobsCollection.find({}).toArray(); // Empty filter
        console.log("result ", result);
        res.send(result);
      } catch (err) {
        console.error("❌ Error in /jobs:", err);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
    app.post("/applicantCollection", async (req, res) => {
      const applicanttion = req.body;
      const result = await applicantcollections.insertOne(applicanttion);
      res.send(result);
    });
    app.get("/applicant", async (req, res) => {
      const email = req.query.email;
      const query = {
        email: email,
      };
      const result = await applicantcollections.find(query).toArray();
      res.send(result);
    });
    app.get("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const result = await jobsCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    // Ping MongoDB
    await client.db("admin").command({ ping: 1 });
    console.log("🏓 Pinged MongoDB. Connection OK!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}
// ✅ Start the server AFTER MongoDB is connected
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
run().catch(console.dir);
