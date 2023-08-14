const mongoose = require("mongoose");

module.exports=()=>{
    mongoose.connect(process.env.DATABASE,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
  // ...
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
    console.log("Connected successfully");
  });
}  
