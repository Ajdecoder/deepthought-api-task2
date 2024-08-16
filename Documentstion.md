
## API Endpoints
## BASE_URL: http://localhost:3000/api/v3/app

### 1. Create a Nudge

- **Method:** `POST`
- **Endpoint:** `/nudges`
- **Payload:**
    ```json
    {
      "tag": "string",
      "title": "string",
      "coverImage": "string",
      "schedule": {
        "date": "string",
        "time": {
          "start": "string",
          "end": "string"
        }
      },
      "description": "string",
      "icon": "string",
      "invitationText": "string"
    }
    ```
- **Description:** Creates a new nudge and stores it in the MongoDB collection.

### 2. Read/Get a Nudge

- **Method:** `GET`
- **Endpoint:** `/nudges/:id`
- **Description:** Fetches the details of a specific nudge by its ID.

### 3. Update a Nudge

- **Method:** `PUT`
- **Endpoint:** `/nudges/:id`
- **Payload:** Similar to the create endpoint payload.
- **Description:** Updates an existing nudge's details in the database.

### 4. Delete a Nudge

- **Method:** `DELETE`
- **Endpoint:** `/nudges/:id`
- **Description:** Deletes a nudge by its ID from the MongoDB collection.

### 5. Get All Nudges

- **Method:** `GET`
- **Endpoint:** `/nudges`
- **Description:** Fetches all nudges with optional pagination and sorting.

## CRUD Functionalities Using MongoDB

### Create a Nudge

Use the `insertOne()` method of MongoDB to add a new nudge document to the collection.

#### Example:
```javascript
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
const result = await db.collection('nudges').insertOne(nudge);
res.status(201).json({ id: result.insertedId });