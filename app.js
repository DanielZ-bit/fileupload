require("dotenv").config()
const auth = require('./routes/authrouter')
const express = require("express");
const notFound = require('./middleware/notfound');
const connect = require('./db/connect')
const imageUpload = require('./routes/imageroute')
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.get('/', (req,res)=>{
    res.send("test");
})
app.use('/api/v1',auth);
app.use('/api/v1', imageUpload)
app.use(notFound);


const start = async() => {
    try{
        await connect(process.env.MONGO_URI)
        app.listen(port, () => console.log('server on 3000'));
    }
    catch (err){
        console.log(err);
    }
}

start();

