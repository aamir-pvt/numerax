import {
    Highlights,
    Valuation,
} from "../utils/requests/getCompanyStockDetails";
const Company = {
    // information for the company
    code: "HPQ",
    name: "HP Inc",
    exchange: "NYSE",
    currencyCode: "USD",
    currencyName: "US Dollar",
    currencySymbol: "$",
    countryName: "USA",
    primaryTicker: "HPQ.US",
    sector: "Technology",
    industry: "Computer Hardware",
    ipoDate: "1962-01-02",
    description:
        "HP Inc. provides personal computing and other access devices, imaging and printing products, and related technologies, solutions, and services in the United States and internationally. The company operates through three segments: Personal Systems, Printing, and Corporate Investments. The Personal Systems segment offers commercial and consumer desktops and notebooks, workstations, commercial mobility devices, thin clients, retail point-of-sale systems, displays and peripherals, software, support, and services, as well as video conferencing solutions, cameras, headsets, voice, and related software products. The Printing segment provides consumer and commercial printer hardware, supplies, solutions, and services, as well as focuses on graphics and 3D imaging solutions in the commercial and industrial markets. The Corporate Investments segment is involved in the HP Labs and business incubation, and investment projects. It serves individual consumers, small- and medium-sized businesses, and large enterprises, including customers in the government, health, and education sectors. The company was formerly known as Hewlett-Packard Company and changed its name to HP Inc. in October 2015. HP Inc. was founded in 1939 and is headquartered in Palo Alto, California.",
    address: "1501 Page Mill Road, Palo Alto, CA, United States, 94304",
    street: "1501 Page Mill Road",
    city: "Palo Alto",
    state: "CA",
    country: "United States",
    zip: "94304",
    Officers: {
        "0": {
            Name: "Mr. Enrique J. Lores",
            Title: "CEO, Pres & Director",
            YearBorn: "1966",
        },
        "1": {
            Name: "Ms. Marie E. Myers",
            Title: "Chief Financial Officer",
            YearBorn: "1968",
        },
    },
    phone: "650 857 1501",
    webURL: "https://www.hp.com",
    logoURL: "/img/logos/US/HPQ.png",
    fullTimeEmployees: 58000,
    // Values for the company
    highlights: {
        marketCapitalization: 30564634624,
        peRatio: 11.6105,
        pegRatio: 8.5131,
        bookValue: -2.519,
        dividendShare: 1.025,
        dividendYield: 0.0339,
        earningsShare: 2.67,
        epsEstimateCurrentYear: 3.36,
        epsEstimateNextYear: 3.55,
        epsEstimateNextQuarter: 0,
        epsEstimateCurrentQuarter: 0.76,
        profitMargin: 0.0475,
        operatingMarginTTM: 0.0781,
        returnOnAssetsTTM: 0.0719,
        returnOnEquityTTM: 0,
    },

    valuation: {
        trailingPE: 11.6105,
        forwardPE: 8.4602,
        priceSalesTTM: 0.4185,
        priceBookMRQ: 0,
    },

    technicals: {
        beta: 1.0158,
        "52WeekHigh": 34.4933,
        "52WeekLow": 23.439,
        "50DayMA": 30.0468,
        "200DayMA": 28.5135,
        sharesShort: 20625144,
        sharesShortPriorMonth: 20401353,
        shortRatio: 2.88,
    },

    splitsDividend: {
        forwardAnnualDividendRate: 1.05,
        forwardAnnualDividendYield: 0.0339,
        payoutRatio: 0.3016,
    },

    eod: [
        {
            open: 31.21,
            high: 31.27,
            low: 30.77,
            close: 31,
            adjusted_close: 31,
            volume: 13963100,
        },
    ],
};
