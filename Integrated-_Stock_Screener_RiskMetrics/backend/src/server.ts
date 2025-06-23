import express from "express";
import cors from "cors";
import http from "http";
const https = require("https");
const fs = require("fs");
const path = require("path");

import { Server } from "socket.io";
import { testBindings, bindings } from "./bindings";

const options = {
  key: fs.readFileSync(path.join(__dirname, "../key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../cert.pem")),
};

const app = express();
const server = http.createServer(app);
var httpsServer = https.createServer(options, app).listen(8443);

// var httpsServer = https.createServer(options, app).listen(8443);

const io = new Server(server, {
  cors: {
    origin: ["*"],
  },
});

app.use(cors());
app.use(express.json());

//This allows us to use the route we created
const fetchCompaniesRouter = require("./routes/getData");
const companyDetailsRouter = require("./routes/companyDetails");
const crypto = require("./routes/crypto_data");
const riskMetrics = require("./Controllers/riskMetrics.controller");
// const cryptoDetails = require("./routes/cryptoDetails");

//Now we are adding that route using express
app.use("/companies", fetchCompaniesRouter);
app.use("/companyDetails", companyDetailsRouter);
app.use("/crypto", crypto);
app.use("/riskmetrics", riskMetrics);
// app.use("/cryptoDetails", crypto);.env

// testBindings()

export default { server, ioSocket: io };

//To make sure our link is encrypted

// async function run() {
//     try {
//         const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
//         await client.connect();
//         const database = client.db('numeraxial');
//         const coins = database.collection('coins');

//         // open a Change Stream on the "messages" collection
//         coinsChangeStream = coins.watch(
//             [],
//             { fullDocument: "updateLookup" }
//         );

//         // what the dummy document looks like right now, needs to be changed
//         // {
//         //   Name : "Bitcoin",
//         //   Market_Cap : "$384.43B",
//         //   Symbol : "BTC",
//         //   One_Day_Currency_Change : "$193.14",
//         //   One_Day_Volume : "$951.31M"
//         // }

//         // set up a listener when change events are emitted
//         coinsChangeStream.on("change", next => {
//             // process any change event
//             switch (next.operationType) {

//                 case 'insert': // needs to be updated or removed
//                     io.emit('inserted', next.fullDocument.message);
//                     break;

//                 case 'update':
//                     io.emit('updated', next.fullDocument);
//             }
//         });

//     } catch {
//         // Ensures that the client will close when you error
//         await client.close();
//     }
// }

// run().catch(console.dir);

//Starts the server
// server.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });
