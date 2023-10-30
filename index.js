const express = require('express')
const app = express()
const mongoDB = require('./db');
mongoDB();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://go-food-frontend-gamma.vercel.app");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    next();
})
app.use(express.json())
app.use('/api', require("./Routes/CreateUser"))
app.use('/api', require("./Routes/DisplayData"))
app.use('/api', require("./Routes/OrderData"))

app.get('/', (req, res) => {
    res.send('Ha bhai 5000 chal rha hai')
})
app.listen(5000, () => {
    console.log(`Server is running on port 5000`)
})