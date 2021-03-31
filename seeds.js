const Player = require('./models/player');

mongoose.connect('mongodb://localhost:27017/cricket', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const seedProducts = [
    {
        name: "Virat Kohli",
        Test: 27,
        ODI: 43,
        T20: 0,
        about: "BEST BATSMAN RIGHT NOW"
    },
    {
        name: "Sachin Tendulkar",
        Test: 51,
        ODI: 49,
        T20: 0,
        about: "GOD"
    },
    {
        name: "AB De Villiers",
        Test: 27,
        ODI: 25,
        T20: 0,
        about: "Mr 360"
    }

]

Player.insertMany(seedProducts)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })

