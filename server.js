require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;
const bodyParser = require("body-parser")



//Routes
const registerRoutes = require('./routes/authRoutes/register')
const loginRoutes = require('./routes/authRoutes/login')
const resetRoutes = require('./routes/authRoutes/reset')
const refreshRoutes = require('./routes/authRoutes/refresh')
const logoutRoute = require('./routes/authRoutes/logout')
const categoryRoutes = require('./routes/api/categoryRoutes')
const userRoutes = require('./routes/api/userRoutes')
const mainTaskRoutes = require('./routes/api/mainTaskRoutes')
const subtaskRoutes = require('./routes/api/subtaskRoutes')
const notificationRoutes = require('./routes/api/notificationRoutes')
const publicRoute = require('./routes/api/publicRoute')
const fileUploadRoutes=require('./routes/api/fileUploadRoutes')

// Connect to MongoDB
// connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// routes (No access token check)
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/refresh', refreshRoutes);
app.use('/logout', logoutRoute);
app.use('/password', resetRoutes);
app.use('/public', publicRoute);

// access token check for below routes
app.use(verifyJWT);

app.use('/notifications', notificationRoutes)
app.use('/categories', categoryRoutes)
app.use('/users', userRoutes)
app.use('/mainTasks', mainTaskRoutes)
app.use('/subtasks', subtaskRoutes)
app.use('/fileUpload',fileUploadRoutes)
// app.use('/personal', )

// 404
app.all('*', (req, res) => {
    res.sendStatus(404);
});

app.use(errorHandler);

module.exports = app