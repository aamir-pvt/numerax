function CompanyController(CompanyModel) {
    return {
        async getCompanyByName({ Name }) {
            const company = await CompanyModel.findOne({ Name: Name })
                .exec()
                .then((data) => {
                    return data;
                })
                .catch((err) => console.error(err));
            return company;
        },
    };
}

module.exports = CompanyController;
