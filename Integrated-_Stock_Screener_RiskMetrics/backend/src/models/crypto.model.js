const mongoose = require("mongoose");

const schema = mongoose.Schema;

const cryptoListSchema = new schema({
    Name: {
        type: String,
        unique: true,
    },
    "1_Day_Currency_Change": String,
    "1_Week_Currency_Change": String,
    "2_Week_Currency_Change": String,
    "1_Month_Currency_Change": String,
    Circulating_Supply: String,
    Id: String,
    Market_Cap: String,
    Symbol: String,
    Volume: String,
});

const Crypto = mongoose.model("coin", cryptoListSchema);

module.exports = Crypto;
