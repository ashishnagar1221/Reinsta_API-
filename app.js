const express = require('express');
const app = express();
const mongoose = require('mongoose')
const {MongoURI} = require('./keys')
const port = 3600


require('./models/user')
app.use(express.json())

app.use(require('./routes/auth'))

mongoose.connect(MongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true 
    })
.then(() => console.log("Connected to database ...."))
.catch(err => console.log(err))

app.get('/',(req,res) =>{
    res.send("Hello world")
})

app.get('/about',(req,res) =>{
    res.send("About Page")
})


app.listen(port, () =>{
    console.log(`Server will be running at port:${port}`)
})