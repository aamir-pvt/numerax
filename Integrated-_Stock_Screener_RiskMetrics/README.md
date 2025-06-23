(Use online branch to update the remote website)

Steps to run program:

1. Create a .env file by creating your own mongodb atlas database and get the connnection string the create a .env file in the root of the project and follow the .env.example file to set everything up

2. install dependencies (npm i)

3. navigate to backend and "npm start", then navigate to Stock-Screener-MERN-Front-End and "npm start"


Tasks to be completed:

Crypto Chart: Chart for the cryptoDetailsPage is incomplete and requires the price infomation requested from the api to be parsed (look at eodResponse at fetchCryptoData for details). This makes the other chart used for stocks to be unavailable. What can be done is continue working on the new chart only for crypto or make some conditions for the previous chart which parses data coming from cryptos. (Currently the chart on cryptoDetailsPage is hard coded for AAPL - Apple)

Similar companies list, Company news and Industry news for stocks: Within the CompanyDetail page there are currently button placeholders for these 3 tasks

Improving the pagination: The pagination has issues on the stock side

Improve list of crypto: Possibly add a list within the data similar to what was done for companys

Add CSV Export for cryptos: Look at newHomePage for details on how it was done for the stocks, should be able to be easily migrated to cryptos page

Less urgent tasks:

Add filtering for cryptos: Similar concept as what was done for stocks

Improve Efficency for api requests: Info will sometimes load slow, many possible solutions (Pagination, etc)

Improve general look and consistency of the pages: Keeping the colour scheme in line with the logo colours and keeping pages looking clean, profesional and consistent

Linking websites: Crypto details page has a card for info with websites listed, add functionality to the urls so they will bring you to the website on click


Feel free to contact me at ryan.m.tapp@gmail.com for any questions or issues


## PROJECTS INCLUDED IN REPOSITORY
1. BACKEND: This project was made with node.js (express.js). It uses mongo db as a database for storing infrequent company fundamentals and technicals and contains c++ bindings for different analysis. Before running the project please read the project's [README](`backend/README.md`) so as to compile the c++ code before running the project.
2. POPULATE-MONGODB: Since the BACKEND project depends on a mongo db database, this project was intended to seed/populate the database with information from [eodhistoricaldata.com](https://eodhd.com/). It uses an array of companies from [this file](Populate-MongoDB/src/utils/constants/companyList.js) to fetch each company and store their fundamentals, technicals and any other information in the mongo database. For more information please read the README from the project [here](Populate-MongoDB/README.md)
3. STOCK-SCREENER-MERN-FRONT-END: This contains the old version of the frontend application. This was ported to a new project due to too many breaking changes with pre-existing packages.
4. stock_screener_vite: This is the new frontend application containing the main application. This was ported from the Stock-Screener-MERN-Front-End which contains most of the features and more. This project uses vite instead of create-react-app.
