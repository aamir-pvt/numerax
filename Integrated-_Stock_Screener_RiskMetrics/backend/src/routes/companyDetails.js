const router = require("express").Router();
const CompanyController = require("../Controllers/company.controller");
const Company = require("../models/companies.model");

//Returns details of the company
//In the body we capture the name of the ticker
function CompanyRouter(companyController) {
    // route for getting getting company details
    router.route("/").post(async (req, res) => {
        const { companyName } = req.body;
        const company = await companyController.getCompanyByName({
            Name: companyName,
        });
        res.json(company);
    });

    return router;
}

module.exports = CompanyRouter(CompanyController(Company));
