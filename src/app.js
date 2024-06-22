const port = process.env.PORT || 8000;
const express = require("express");
const db = require("./db/db");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const users = require("./models/schema");
const cors = require("cors");
const bodyParser = require("body-parser");
const token = process.env.CRM;
const axios = require("axios");

db();
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get("/userdata/:email", async (req, res) => {
  const finduser = await users.findOne({ email: req.params.email });
  if (finduser) {
    res.send(finduser);
  } else {
    res.send("No User with this Email");
  }
});
app.post("/send", async (req, res) => {
  const { name, email, phone, address } = req.body;
  const existemail = await users.findOne({ email });
  const existphone = await users.findOne({ phone });
  if (existemail) {
    return res.status(400).json({ error: "Email already Registered" });
  } else if (existphone) {
    return res.status(400).json({ error: "Phone already Registered" });
  } else {
    const newUser = new users({
      name,
      email,
      phone,
      address,
    });
    const save = await newUser.save();
    res.status(201).send({ message: "Registration Successful", content: save });
  }
});
app.post("/pushtocrm", async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        name,
        email,
        phone,
        address,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error pushing to CRM:", error);
    res.status(500).json({ error: "Failed to push data to CRM" });
  }
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
