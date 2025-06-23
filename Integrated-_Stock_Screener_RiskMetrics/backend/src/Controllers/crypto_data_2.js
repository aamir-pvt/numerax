//import  u from "../Models/user.js";
const u = require("../models/crypto.model.js")
exports.Companies2 = (req, res) => {
    u.find().exec((err, ud) => {
        // if(err){
        //     res.status(400).json({
        //         error:"no user found"
        //     })
        // }
        count=0
        var ans=[]
        ud.forEach(element => {
            // console.log(element);
            // break;
            if(element.Name=='Bitcoin')
                ans.push(element)
            
            // console.log(element.Circulating_Supply)

            count=count+1
        });
        // console.log(ud)

        res.json(ans)
    })
}

//export {allusersRoutes}