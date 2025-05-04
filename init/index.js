const mongoose = require("mongoose");
const dataObject = require("./data");
const Listing = require("../models/listing");

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
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