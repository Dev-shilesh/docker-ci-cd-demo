const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/crud", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model("User", UserSchema);

// Seed default users if collection is empty
async function seedDefaultUsers() {
    const count = await User.countDocuments();
    if (count === 0) {
        await User.insertMany([
            { name: "John Doe", email: "john@example.com" },
            { name: "Jane Doe", email: "jane@example.com" }
        ]);
        console.log("Default users added");
    }
}
seedDefaultUsers();

// GET all users
app.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// POST a new user
app.post("/users", async (req, res) => {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.json(newUser);
});

// UPDATE a user
app.put("/users/:id", async (req, res) => {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
    res.json(updatedUser);
});

// DELETE a user
app.delete("/users/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
