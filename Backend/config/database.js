const mongoose = require('mongoose');
require('dotenv').config();
const connectionDb =async()=>{
  try{
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database connected successfully");

  }catch(err){
   console.log("Error in database connection");
   console.error(err);
   process.exit(1);
  }
}
module.exports = connectionDb;
