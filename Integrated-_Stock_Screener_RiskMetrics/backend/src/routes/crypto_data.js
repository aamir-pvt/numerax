const express = require("express")
var router = express.Router();

const Crypto = require('../models/crypto.model.js');

const { Companies } = require("../Controllers/crypto_data.js");
const { Companies2 } = require("../Controllers/crypto_data_2.js");

//Returns details of the company
//In the body we capture the name of the ticker

router.get('/', (req, res) => {
    console.log(req.params);
    
    // replace with the specified params
    Crypto.find({}, 'Name')
    .then((data) => res.json(data))
});

router.post('/', (req, res) => {
    if (req.body.action) {
        Crypto.create(req.body)
          .then((data) => res.json(data));
      } else {
        res.json({
          error: 'The input field is empty',
        });
      }
});

router.delete('/todos/:id', (req, res, next) => {
    // delete placeholder
});

module.exports = router;