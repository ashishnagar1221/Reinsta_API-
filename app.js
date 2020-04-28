const express = require('express');
const app = express();
const mongoose = require('mongoose')
const {MongoURI} = require('./keys')
const port = process.env.PORT || 3600

mongoose.connect(MongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true 
    })
.then(() => console.log("Connected to database ...."))
.catch(err => console.log(err))


require('./models/user')
require('./models/post')
app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))

app.get('/',(req,res) =>{
    res.send("Hello world")
})

app.get('/about',(req,res) =>{
    res.send("About Page")
})


app.listen(port, () =>{
    console.log(`Server will be running at port:${port}`)
})