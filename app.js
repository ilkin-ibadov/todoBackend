const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://ilkin:123i973i@cluster0.rpxonmz.mongodb.net/todos?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Create schema for cards
const cardSchema = new mongoose.Schema({
  title: String,
  description: String,
});

// Create model for cards
const Card = mongoose.model("Card", cardSchema);

// API Routes

app.get("/cards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/cards", async (req, res) => {
  const { title, description } = req.body;
  const newCard = new Card({ title, description });
  try {
    const savedCard = await newCard.save();
    res.status(201).json(savedCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/cards/:id", async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/cards/:id", async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Card deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start the server
const port = 5001;
app.listen(port, () => console.log(`Server is running on port ${port}...`));
