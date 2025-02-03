const express = require("express");
const path = require("path"); // no need to install
const app = express();

//configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));








app.listen(8080, ()=>{
    console.log("Listening at 8080");
})
