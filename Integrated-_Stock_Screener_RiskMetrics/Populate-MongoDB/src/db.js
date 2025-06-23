const mongoose = require("mongoose");

module.exports = async function mongodbConnection() {
    try {
        const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

        console.log(MONGODB_CONNECTION_STRING);
        mongoose.connect(MONGODB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        throw err;
    }
};
