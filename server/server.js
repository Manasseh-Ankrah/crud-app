import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Cards from "./dbCards.js";
import Pusher from "pusher";
// import Random from "random-number";
// import connectToDb from "../server/database/db";

//  password
// KJYQYIPgdgkkbfID

// app config
const app = express();
const port = process.env.PORT || 8001;

const pusher = new Pusher({
  appId: "1296667",
  key: "3f4a53efe35be9da4c17",
  secret: "b8752eef1329825d2a07",
  cluster: "eu",
  useTLS: true,
});

// middleware
app.use(express.json());
app.use(cors());
// db config

const connection_url =
  "mongodb+srv://admin:KJYQYIPgdgkkbfID@cluster0.pwmw9.mongodb.net/tinderdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  useNewURLParser: true,
  //   useCreateIndex: true,
  useUnifiedTopology: true,
});

// const options = {
//   min: 1,
//   max: 1000,
//   integer: true,
// };
// database connection check
mongoose.connection.once("open", () => {
  console.log("Connected to database!!");

  const changeStream = mongoose.connection.collection("cards").watch();

  changeStream.on("change", (change) => {
    // console.log("Change triggered by pusher");
    // console.log(change);
    // console.log("End of Change");

    try {
      // enable pusher on insert
      if (change.operationType === "insert") {
        console.log("Pusher Inserting");
        const postDetails = change.fullDocument;
        pusher.trigger("cards", "inserted", {
          name: postDetails.name,
          imgUrl: postDetails.imgUrl,
          newId: postDetails.newId,
        });
      } else if (change.operationType === "delete") {
        // const postDetails = change.fullDocument;
        try {
          pusher.trigger("cards", "deleted");
          console.log("Pusher Deleting");
        } catch (error) {
          console.log(error);
        }

        // pusher.trigger(channel, "deleted", change.documentKey._id);
      } else if (change.operationType === "update") {
        console.log("Pusher Updating");
        const postDetails = change.fullDocument;
        console.log(postDetails);
        // pusher.trigger("cards", "updated", {
        //   name: postDetails.name,
        // });
      } else {
        console.log("Unknown trigger from pusher");
      }
    } catch (error) {
      console.log(error);
    }
  });
});

// api endpoints
app.get("/", (req, res) => {
  res.status(200).send("You're doing very well Manasseh!!");
});

app.post("/tinder/cards", (req, res) => {
  const dbCard = req.body;
  Cards.create(dbCard, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// fetching all data
app.get("/tinder/cards", (req, res) => {
  // const dbCard = req.body;
  Cards.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
      // console.log(data);
    }
  });
});

// fetching specific data
app.get("/tinder/cards/:cardId", async (req, res) => {
  try {
    const cardItem = await Cards.findById(req.params.cardId);
    res.status(200).send(cardItem);
  } catch (error) {
    res.json({ message: error });
  }
});

// deleting data
// app.delete("/tinder/cards/:cardId", (req, res) => {
//   try {
//     const removeCard = Cards.remove({ _id: req.params.cardId });
//     res.status(200).json(removeCard);
//   } catch (error) {
//     res.json({ message: error });
//   }
// });

app.delete("/tinder/cards/:cardId", async (req, res) => {
  try {
    const card = await Cards.findById(req.params.cardId);
    if (!card) {
      return res.status(404).json({ msg: "card not found" });
    }
    await card.remove();
    res.json(card);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "card not found" });
    }
    res.status(500).send("unable to delete card");
  }
});

//Update Card
app.patch("/tinder/cards/:cardId", async (req, res) => {
  console.log(req.body.name);
  console.log(req.params.cardId);

  try {
    const updatedCard = await Cards.updateOne(
      { _id: req.params.cardId },
      { $set: { name: req.body.name } }
      // imgUrl: req.body.imgUrl
    );
    res.json(updatedCard);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("unable to update name");
  }
});

// listner
app.listen(port, () => {
  console.log(`App is running on ${port}`);
});
