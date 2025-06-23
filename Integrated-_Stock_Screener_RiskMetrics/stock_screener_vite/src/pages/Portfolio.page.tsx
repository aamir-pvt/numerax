import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppSelector } from "@/app/hooks";
import { selectPortfolio } from "@/features/portfolio/portfolioSlice";
import { Company } from "@/hooks/useCompanyStockFilter";

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import axios from "axios";
import { CircularProgress } from "@mui/material";
import CustomTable from "@/components/shared/CustomTable";


const LOCAL_API = import.meta.env.VITE_LOCAL_API;

export interface IHistoricalDataRecord {
    adjusted_close: number;
    close: number;
    date: string;
    high: number;
    low: number;
    open: number;
    volume: number;
}

interface IRequestBody {
    tickerList: string[];
    start: string;
    to: string;
    country: string;
}

export interface IHistoricalDataResponse {
    ticker: string;
    start: string;
    to: string;
    data: IHistoricalDataRecord[];
}


export type RiskMetrics = {
    [key: string]: {
        mean: number;
        sample_std: number;
        skew: number;
        kurt: number;
        annualized_return: number;
        m_squared: number;
        beta: number;
        t_stats: number;
        minrisk_weights: number;
    };
};


export default function Portfolio() {

    const navigate = useNavigate();
    const portfolio = useAppSelector(selectPortfolio);

    const [expanded, setExpanded] = React.useState<string | false>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [historicalData, setHistoricalData] = React.useState<IHistoricalDataResponse[]>([]);
    const [riskMetrics, setRiskMetrics] = React.useState<RiskMetrics>({})
    const [loading, setLoading] = React.useState<boolean>(false);


    // console.log("[Portfolio page] : historical data:", historicalData)

    useEffect(() => {
        setLoading(true);
        // console.log("Portfolio page");c
        // console.log(portfolio);
        const data: IRequestBody = {
            tickerList: [],
            start: "2016-01-04",
            to: "2016-12-31",
            country: "US"
        }

        // Add the ticker codes of the companies in the portfolio to the data object
        portfolio.companies.map((company: Company) => {
            data.tickerList.push(company.Name);
        });

        // console.log(data)

        const url = `${LOCAL_API}/riskmetrics`;


        // const riskMetricsResp: RiskMetrics[] = [];

        axios.put(url, data)
            .then((response) => {
                // console.log(response);

                setRiskMetrics(response.data);
                // console.log(riskMetricsResp)
            })
            .catch((error) => {
                console.log(error);

            })

        setLoading(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClick = (companyName: string) => {
        navigate(`/companyDetails?code=${companyName}`);
    }

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        // console.log("panel", panel);
        setExpanded(isExpanded ? panel : false);
    };

    // const getHistoricalData = (ticker: string) => {
    //     const data = historicalData.filter((item) => {
    //         // remove country code to make comparison
    //         const tickerCode = item.ticker.split(".")[0];
    //         return tickerCode === ticker
    //     }
    //     );
    //     return data;
    // }

    return (
        <div>
            {loading ?
                <div className="pt-24">
                    <CircularProgress size={100} thickness={2.5} sx={{ marginLeft: '45%' }} />
                </div> : (
                    <Stack spacing={1} >
                        {/* <div className="flex w-full justify-center mt-['2%']">
                            <Skeleton variant="rectangular" width={800} height={400} sx={{ marginTop: '2%' }} />
                        </div> */}
                        <main className="w-full pt-4">
                            <div className="max-w-7xl mx-auto">
                                <div className="w-full space-y-2 mt-2">
                                    <div className="grid grid-cols-8 w-full bg-gray-700 text-white rounded-t-lg py-3 px-3">
                                        <h1>Ticker</h1>
                                        <h1 className="col-span-2">Name</h1>
                                        <h1>MarketCap</h1>
                                        <h1>Price</h1>
                                        <h1>P/E</h1>
                                        <h1>P/B</h1>
                                        <h1>P/S</h1>
                                    </div>

                                    {portfolio.companies.map((company, index) => (
                                        <div key={index} >
                                            <Accordion expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1bh-content"
                                                    id="panel1bh-header"
                                                >
                                                    <div className="w-full hover:bg-slate-200 " key={index} onDoubleClick={() => handleClick(company.Name)} >
                                                        <div className="grid grid-cols-8  h-8 pt-1">
                                                            <h3 className="text-blue-900">
                                                                {" "}
                                                                {/* Link to CompanyDetails page */}
                                                                {/* <a href={`/companyDetails?code=${company.Name}`} /> */}
                                                                <Link to={`/companyDetails?code=${company.Name}`}>
                                                                    {company.Name}
                                                                </Link>
                                                            </h3>
                                                            <h3 className="col-span-2 text-nowrap">{company.CompanyName}</h3>
                                                            <h3 className="pl-2">
                                                                <span>
                                                                    {new Intl.NumberFormat("en", {
                                                                        notation: "compact",
                                                                        compactDisplay: "short",
                                                                    }).format(company.MarketCapitalizationMln)}
                                                                </span>
                                                            </h3>
                                                            <h3 className="pl-2">
                                                                <span>${company.PriceBookMRQ}</span>
                                                            </h3>

                                                            <h3 className="pl-4">{company.PERatio}</h3>
                                                            <h3 className="pl-5">{company.PriceBookMRQ}</h3>
                                                            <h3 className="pl-6">{company.PriceSales}</h3>
                                                        </div>
                                                    </div>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <CustomTable riskMetrics={riskMetrics[company.Name]} />
                                                </AccordionDetails>
                                            </Accordion>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </main >
                    </Stack>
                )}
        </div>
    );

}
