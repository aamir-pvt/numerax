import { eodHistoricalDataAPI, apiKey } from "./config";
import axios, { AxiosResponse } from "axios";

/**
 *
 * @param {string} companyName
 * @returns
 */
export const getCompanyStocksDetails = async (companyName: string) => {
    const url1 = `${eodHistoricalDataAPI}/eod/${companyName}?from=2020-08-19&to=2020-08-19&api_token=${apiKey}&fmt=json`;
    const url2 = `${eodHistoricalDataAPI}/fundamentals/${companyName}?from=2020-08-19&to=2020-08-19&api_token=${apiKey}`;

    return axios.all([axios.get(url1), axios.get(url2)]).then(
        axios.spread((val1, val2) => {
            return { val1: val1.data as EOD[], val2: val2.data as Fundamentals };
        })
    );
};

export interface EOD {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    adjusted_close: number;
    volume: number;
}
export interface Fundamentals {
    General: General;
    Highlights: Highlights;
    Valuation: Valuation;
    SharesStats: SharesStats;
    Technicals: { [key: string]: number };
    SplitsDividends: SplitsDividends;
    AnalystRatings: AnalystRatings;
    Holders: Holders;
    InsiderTransactions: { [key: string]: InsiderTransaction };
    ESGScores: ESGScores;
    outstandingShares: OutstandingShares;
    Earnings: Earnings;
    Financials: Financials;
}

export interface AnalystRatings {
    Rating: number;
    TargetPrice: number;
    StrongBuy: number;
    Buy: number;
    Hold: number;
    Sell: number;
    StrongSell: number;
}

export interface ESGScores {
    Disclaimer: string;
    RatingDate: Date;
    TotalEsg: number;
    TotalEsgPercentile: number;
    EnvironmentScore: number;
    EnvironmentScorePercentile: number;
    SocialScore: number;
    SocialScorePercentile: number;
    GovernanceScore: number;
    GovernanceScorePercentile: number;
    ControversyLevel: number;
    ActivitiesInvolvement: { [key: string]: ActivitiesInvolvement };
}

export interface ActivitiesInvolvement {
    Activity: string;
    Involvement: Involvement;
}

export enum Involvement {
    No = "No",
    Yes = "Yes",
}

export interface Earnings {
    History: { [key: string]: History };
    Trend: { [key: string]: { [key: string]: null | string } };
    Annual: { [key: string]: Annual };
}

export interface Annual {
    date: Date;
    epsActual: number;
}

export interface History {
    reportDate: Date;
    date: Date;
    beforeAfterMarket: BeforeAfterMarket | null;
    currency: Currency;
    epsActual: number | null;
    epsEstimate: number | null;
    epsDifference: number | null;
    surprisePercent: number | null;
}

export enum BeforeAfterMarket {
    AfterMarket = "AfterMarket",
    BeforeMarket = "BeforeMarket",
}

export enum Currency {
    Usd = "USD",
}

export interface Financials {
    Balance_Sheet: BalanceSheet;
    Cash_Flow: CashFlow;
    Income_Statement: IncomeStatement;
}

export interface BalanceSheet {
    currency_symbol: Currency;
    quarterly: { [key: string]: { [key: string]: null | string } };
    yearly: { [key: string]: { [key: string]: null | string } };
}

export interface CashFlow {
    currency_symbol: Currency;
    quarterly: { [key: string]: { [key: string]: null | string } };
    yearly: { [key: string]: { [key: string]: null | string } };
}

export interface IncomeStatement {
    currency_symbol: Currency;
    quarterly: { [key: string]: { [key: string]: null | string } };
    yearly: { [key: string]: { [key: string]: null | string } };
}

export interface General {
    Code: string;
    Type: string;
    Name: string;
    Exchange: string;
    CurrencyCode: Currency;
    CurrencyName: string;
    CurrencySymbol: string;
    CountryName: string;
    CountryISO: string;
    OpenFigi: string;
    ISIN: string;
    LEI: string;
    PrimaryTicker: string;
    CUSIP: string;
    CIK: string;
    EmployerIdNumber: string;
    FiscalYearEnd: string;
    IPODate: Date;
    InternationalDomestic: string;
    Sector: string;
    Industry: string;
    GicSector: string;
    GicGroup: string;
    GicIndustry: string;
    GicSubIndustry: string;
    HomeCategory: string;
    IsDelisted: boolean;
    Description: string;
    Address: string;
    AddressData: AddressData;
    Listings: Listings;
    Officers: { [key: string]: Officer };
    Phone: string;
    WebURL: string;
    LogoURL: string;
    FullTimeEmployees: number;
    UpdatedAt: Date;
}

export interface AddressData {
    Street: string;
    City: string;
    State: string;
    Country: string;
    ZIP: string;
}

export interface Listings {}

export interface Officer {
    Name: string;
    Title: string;
    YearBorn: string;
}

export interface Highlights {
    MarketCapitalization: number;
    MarketCapitalizationMln: number;
    EBITDA: number;
    PERatio: number;
    PEGRatio: number;
    WallStreetTargetPrice: number;
    BookValue: number;
    DividendShare: number;
    DividendYield: number;
    EarningsShare: number;
    EPSEstimateCurrentYear: number;
    EPSEstimateNextYear: number;
    EPSEstimateNextQuarter: number;
    EPSEstimateCurrentQuarter: number;
    MostRecentQuarter: Date;
    ProfitMargin: number;
    OperatingMarginTTM: number;
    ReturnOnAssetsTTM: number;
    ReturnOnEquityTTM: number;
    RevenueTTM: number;
    RevenuePerShareTTM: number;
    QuarterlyRevenueGrowthYOY: number;
    GrossProfitTTM: number;
    DilutedEpsTTM: number;
    QuarterlyEarningsGrowthYOY: number;
}

export interface Holders {
    Institutions: { [key: string]: Fund };
    Funds: { [key: string]: Fund };
}

export interface Fund {
    name: string;
    date: Date;
    totalShares: number;
    totalAssets: number;
    currentShares: number;
    change: number;
    change_p: number;
}

export interface InsiderTransaction {
    date: Date;
    ownerCik: null;
    ownerName: string;
    transactionDate: Date;
    transactionCode: TransactionCode;
    transactionAmount: number;
    transactionPrice: number;
    transactionAcquiredDisposed: TransactionAcquiredDisposed;
    postTransactionAmount: number;
    secLink: string;
}

export enum TransactionAcquiredDisposed {
    D = "D",
}

export enum TransactionCode {
    S = "S",
}

export interface SharesStats {
    SharesOutstanding: number;
    SharesFloat: number;
    PercentInsiders: number;
    PercentInstitutions: number;
    SharesShort: null;
    SharesShortPriorMonth: null;
    ShortRatio: null;
    ShortPercentOutstanding: null;
    ShortPercentFloat: null;
}

export interface SplitsDividends {
    ForwardAnnualDividendRate: number;
    ForwardAnnualDividendYield: number;
    PayoutRatio: number;
    DividendDate: Date;
    ExDividendDate: Date;
    LastSplitFactor: string;
    LastSplitDate: Date;
    NumberDividendsByYear: { [key: string]: NumberDividendsByYear };
}

export interface NumberDividendsByYear {
    Year: number;
    Count: number;
}

export interface Valuation {
    TrailingPE: number;
    ForwardPE: number;
    PriceSalesTTM: number;
    PriceBookMRQ: number;
    EnterpriseValue: number;
    EnterpriseValueRevenue: number;
    EnterpriseValueEbitda: number;
}

export interface OutstandingShares {
    annual: { [key: string]: AnnualValue };
    quarterly: { [key: string]: AnnualValue };
}

export interface AnnualValue {
    date: string;
    dateFormatted: Date;
    sharesMln: string;
    shares: number;
}
