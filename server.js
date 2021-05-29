const express = require("express");
const mongoose = require('mongoose');
const mongoDB_password = "svPntO9G49WSt97I"

mongoose.connect('mongodb+srv://ahsan:svPntO9G49WSt97I@cluster0.jilja.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}).then((con) => {
    console.log("connected to mogndodb")
    
})

const app = express();

app.listen(8000, () => {
    console.log("server running on port 8000")
})