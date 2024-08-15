const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());
app.set('view engine', 'ejs')

// MongoDB configuration
const mongoUrl = "mongodb://localhost:27017";
const dbName = "Eventsdb";
const collectionName = "nudges";

app.get('/', (req, res) => {
    res.render('home')
})

async function connectToDatabase() {
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

app.post("/api/v3/app/nudges", async (req, res) => {
  try {
    const db = await connectToDatabase();

    const nudge = {
        tag: req.body.tag,
        title: req.body.title,
        coverImage: req.body.coverImage,
        schedule: {
          date: req.body.date,
          time: {
            start: req.body.startTime,
            end: req.body.endTime
          }
        },
        description: req.body.description,
        icon: req.body.icon,
        invitationText: req.body.invitationText
      
    };

    const result = await db.collection(collectionName).insertOne(nudge);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all nudges
app.get("/api/v3/app/nudges", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const nudges = await db.collection(collectionName).find({}).toArray();
    res.json(nudges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get nudge by ID
app.get("/api/v3/app/nudges/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const nudge = await db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(req.params.id) });

    if (nudge) {
      res.json(nudge);
    } else {
      res.status(404).json({ error: "Nudge not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a nudge
app.put("/api/v3/app/nudges/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const nudgeId = req.params.id;

    const existingNudge = await db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(nudgeId) });
    if (!existingNudge) {
      return res.status(404).json({ error: "Nudge not found" });
    }

    const updateData = {
        $set: {
          tag: req.body.tag,
          title: req.body.title,
          coverImage: req.body.coverImage,
          schedule: {
            date: req.body.date,
            time: {
              start: req.body.startTime,
              end: req.body.endTime
            }
          },
          description: req.body.description,
          icon: req.body.icon,
          invitationText: req.body.invitationText
        }
      };

    const result = await db
      .collection(collectionName)
      .updateOne({ _id: new ObjectId(nudgeId) }, { $set: updateData });

    if (result.modifiedCount === 1) {
      res.json({ message: "Nudge updated", nudge: updateData });
    } else {
      res.status(404).json({ error: "Nudge not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a nudge
app.delete("/api/v3/app/nudges/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const result = await db
      .collection(collectionName)
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 1) {
      res.json({ message: "Nudge deleted" });
    } else {
      res.status(404).json({ error: "Nudge not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
