const express = require("express");

const app = express(); //creation of express js application

// this will only handle get call to the /user
app.get("/user", (req, res) => {
  res.send({firstName : "Neha", lastName: "Thakur"});
});

app.post("/user", (req, res) => {
    // saving data to db
  res.send("Data successfully saved to DB");
});

// request handler arrow functions
// app.use matches all the http request to the /test route
app.use("/test", (req, res) => {
  res.send("Hello test route");
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is successfully listening on port: ${PORT}`);
});
