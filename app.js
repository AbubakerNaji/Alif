const express = require("express");
const connectMongoDB = require('./utils/mongoConfig');
const globalErrorHandler = require('./controllers/errorController');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const kidsRoutes = require('./routes/kidsRoutes');
const locationRoutes = require('./routes/locationRoutes');
const myUserRoutes = require('./routes/myUserRoutes');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

connectMongoDB();
app.get("/", (req, res) => res.send("Hello World!"));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/kids', kidsRoutes);
app.use('/api/v1/location', locationRoutes);
app.use('/api/v1/user', myUserRoutes);





app.use(globalErrorHandler);



module.exports = app;





