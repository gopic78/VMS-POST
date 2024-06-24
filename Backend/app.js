const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path")
const bodyParser = require("body-parser");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000 ;

app.use(cors({credentials :  true , origin : "*"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));


mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser : true,
    useUnifiedTopology :  true
})
.then(()=>{
    console.log("MongoDB connected successfully");
})
.catch((error)=>{
    console.log("MongoDB not connected",error)
})

//routes
const user = require("./Router/login");
const blog = require('./Router/blog');
const blogComment = require('./Router/blogComment');

app.use('/api', user);
app.use('/api', blog);
app.use('/api', blogComment);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    next();
});

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, ()=>{
    console.log(`The server is running on port ${PORT}`)
})