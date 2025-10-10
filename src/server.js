const express = require('express');

const app = express();  //creation of express js application

// request handler arrow functions
app.use("/Hello",(req, res)=>{
    res.send("Hello Hello")
})
app.use("/test",(req, res)=>{
    res.send("Hello test route")
})

app.use("/",(req, res)=>{
    res.send("Hello frome the server side")
})
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server is successfully listening on port: ${PORT}`)
});
