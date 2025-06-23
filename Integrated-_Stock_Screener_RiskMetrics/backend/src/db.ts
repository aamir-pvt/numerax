import { Server, Socket } from "socket.io";
import mongoose from "mongoose";

export async function mongodbConnection(ioSocket: Server) {
    const MONGODB_CONNECTION_STRING =
        process.env.MONGODB_CONNECTION_STRING || "";
    console.log(MONGODB_CONNECTION_STRING);
    try {
        mongoose.connect(MONGODB_CONNECTION_STRING).then(() => {
            const database = mongoose.connection.db;
            const coins = database.collection("coins");

            // open a Change Stream on the "messages" collection
            const coinsChangeStream = coins.watch([], {
                fullDocument: "updateLookup",
            });

            // what the dummy document looks like right now, needs to be changed
            // {
            //   Name : "Bitcoin",
            //   Market_Cap : "$384.43B",
            //   Symbol : "BTC",
            //   One_Day_Currency_Change : "$193.14",
            //   One_Day_Volume : "$951.31M"
            // }

            // set up a listener when change events are emitted
            coinsChangeStream.on("change", (next) => {
                // process any change event
                switch (next.operationType) {
                    case "insert": // needs to be updated or removed
                        ioSocket.emit("inserted", next.fullDocument.message);
                        break;

                    case "update":
                        ioSocket.emit("updated", next.fullDocument);
                }
            });
        });
    } catch (err) {
        // Ensures that the client will close when you error
        // await client.close();
        throw err;
    }
}
