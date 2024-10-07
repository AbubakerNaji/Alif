const express = require("express");
const connectMongoDB = require('./utils/mongoConfig');
const globalErrorHandler = require('./controllers/errorController');
const path = require('path');

const cors = require('cors'); 
const helmet = require('helmet'); 
const morgan = require('morgan'); 
const compression = require('compression'); 


const authRoutes = require('./routes/authRoutes');
const kidsRoutes = require('./routes/kidsRoutes');
const locationRoutes = require('./routes/locationRoutes');
const myUserRoutes = require('./routes/myUserRoutes');
const serviceTypeRoute = require('./routes/servicesRoutes/serviceTypeRoute');
const serviceCategoriesRoute = require('./routes/servicesRoutes/serviceCategoriesRoutes');
const serviceRoutes = require('./routes/servicesRoutes/serviceRoutes');
const serviceDateRoutes = require('./routes/servicesRoutes/serviceDateRoutes');
const CompanyInfoRoutes = require('./routes/CompanyInfoRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const passRoutes = require('./routes/passRoutes');






require('dotenv').config();

const app = express();
//kkk
app.use(cors()); 
app.use(helmet()); 
app.use(morgan('dev')); 
app.use(compression()); 

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

connectMongoDB();
app.get("/", (req, res) => res.send("Hello World!"));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/kids', kidsRoutes);
app.use('/api/v1/location', locationRoutes);
app.use('/api/v1/user', myUserRoutes);

app.use('/api/v1/service/type', serviceTypeRoute);
app.use('/api/v1/service/categories', serviceCategoriesRoute);
app.use('/api/v1/service/', serviceRoutes);
app.use('/api/v1/service/date', serviceDateRoutes);
app.use('/api/v1/company', CompanyInfoRoutes);
app.use('/api/v1/favorite', favoriteRoutes);
app.use('/api/v1/pass', passRoutes);









app.use(globalErrorHandler);



module.exports = app;





