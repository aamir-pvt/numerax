const paths = {};
Object.defineProperty(paths, "COMPANYSTOCKS", {
    value: "/returnedCompanies",
    configurable: false,
    writable: false,
});
Object.defineProperty(paths, "HOME", {
    configurable: false,
    value: "/",
    writable: false,
});
Object.defineProperty(paths, "COMPANYDETAILS", {
    value: "/companyDetails",
    writable: false,
    configurable: true,
});
Object.defineProperty(paths, "CRYPTODETAILS", {
    value: "/cryptoDetails",
    writable: false,
    configurable: true,
});
Object.defineProperty(paths, "CRYPTOS", {
    configurable: false,
    writable: false,
    value: "/cryptos",
});

export default paths;
