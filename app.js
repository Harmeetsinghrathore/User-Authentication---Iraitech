const express = require('express');
const app = express();

const bcrypt = require('bcrypt');

app.set('view engine','ejs');

app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});


// user routes
const userRoute = require("./routes/userRoute");

app.use("/", userRoute);


app.listen(3000, function() {
    console.log("The server running on the port 3000");
});