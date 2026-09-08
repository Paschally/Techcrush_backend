const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');

const userRoute = require('./routes/userRoutes.js');
const productRoute = require('./routes/productRoutes.js')

dns.setServers(['8.8.8.8', '1.1.1.1']);


const atlas_string = "mongodb+srv://paschal506_db_user:paschal506@cluster0.2xlfgy8.mongodb.net/cohort8_db?appName=Cluster0"

mongoose.connect(atlas_string)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error("Connection Error: ", err));

const port = 5000;
const app = express();

app.use(express.json());

app.get('/home', (req, res) => {
    res.send('Server is active');
});

app.use('/users', userRoute);
app.use('/products', productRoute);

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});