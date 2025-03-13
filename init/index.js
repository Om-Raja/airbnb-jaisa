const mongoose = require("mongoose");
const dataObject = require("./data");
const Listing = require("../models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("Database connected successfully");
}).catch((err)=>{
    console.log(err);
});

const init = async (dataObject)=>{
    await Listing.deleteMany({});
    dataObject.data = dataObject.data.map((obj) => {return {...obj, owner: "67d08d1c77973de01e362b37"}});
    await Listing.insertMany(dataObject.data);
    console.log("DB initialised");
};
init(dataObject);