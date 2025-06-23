//import  u from "../Models/user.js";
const u = require("../models/crypto.model.js")
exports.Companies = (req, res) => {
    u.find().exec((err, ud) => {
        // if(err){
        //     res.status(400).json({
        //         error:"no user found"
        //     })
        // }
        count=0
        // console.log(ud)

        res.json(ud)
    })
}

//export {allusersRoutes}