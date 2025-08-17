// importing modules 
import dotenv from 'dotenv';
import express from 'express';

//routes
import productRoutes from './routes/product.route.js';

//database connection 
import connectMongoDB from './db/connectMongoDB.js';

//configuring the dotenv file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

//*This middleware parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true })) // for put and post to form the data and gives us a response of that data that was created or edited
//routes for api
app.use("/api/products", productRoutes);

app.get('/', (req,res) => {
    res.send("server is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectMongoDB();
});