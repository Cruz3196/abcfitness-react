// importing modules 
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';

//routes
import productRoutes from './routes/product.route.js';
import authRoutes from './routes/auth.route.js';
// import trainerRoutes from './routes/trainer.route.js';
// import bookingRoutes from './routes/booking.route.js';

//database connection 
import connectMongoDB from './db/connectMongoDB.js';

//configuring the dotenv file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

//*This middleware parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true })) // for put and post to form the data and gives us a response of that data that was created or edited
app.use(cookieParser()); //enable cookie parser for cookies 

//routes for api
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/trainer', trainerRoutes);
// app.use('/api/booking', bookingRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectMongoDB();
});