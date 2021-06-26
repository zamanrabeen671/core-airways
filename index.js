const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7kyx1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookingsCollection = client.db("bea-cruiser").collection("bookings");
    const seatCollection = client.db("bea-cruiser").collection("seats");

    //booking 
    app.post('/booking', (req, res) => {
        const booked = req.body;
        bookingsCollection.insertOne(booked)
            .then(result => {
                console.log(result)
                res.send(result.insertedCount > 0)
            })
    })
    //seats
    app.post('/seat', (req, res) => {
        const seatBooked = req.body;
        seatCollection.insertOne(seatBooked)
            .then(result => {
                console.log(result)
                res.send(result.insertedCount > 0)
            })
    })
    //get seat
    app.get('/bookedSeat', (req, res) => {
        seatCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    //get bookings
    app.get('/flightDetails', (req, res) => {
        bookingsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    console.log('database connected');
    console.log(err)

});
//root path
app.get('/', (req, res) => {
    res.send('hello world')
})
app.listen(process.env.PORT || 4000);
