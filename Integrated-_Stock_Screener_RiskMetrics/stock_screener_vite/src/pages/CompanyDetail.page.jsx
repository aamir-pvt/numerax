
import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Cards from "../components/pages/CompanyDetail/CardBox.tsx";
import ChartWrapperCS from "../components/pages/CompanyDetail/ChartWrapperCS";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useLocation, useNavigate } from "react-router-dom";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Grid, Stack } from "@mui/material";
import CustomBackButton from "../components/shared/CustomBackButton";
import CustomToggleButtonGroup from "../components/shared/CustomToggleButtonGroup";
import CustomButton from "../components/shared/CustomButton";
import CustomDialog from "@/components/shared/CustomDialog";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { CircularProgress } from "@mui/material";
import { useAppDispatch } from "../app/hooks";
import { addCompanyToBasket } from "../features/basket/basketSlice"
import axios from "axios";

const KEY = import.meta.env.VITE_EOD_API_KEY


export default function CompanyDetailsPage() {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    const companyName = searchParams.get("code");
    const value = {
        companyName: companyName
    };


    const [state, setState] = useState({
        openSnackbar: false,
        vertical: 'bottom',
        horizontal: 'right',
    });

    const { vertical, horizontal, openSnackbar } = state;

    const handleClose = () => {
        setState({ ...state, openSnackbar: false });
    };

    const [openDialog, setOpenDialog] = useState(false);

    const handleAddToBasket = () => {
        console.log(`Added stock with the code ${code}`)
        setOpenDialog(false)
        setState({ ...state, openSnackbar: true })

        dispatch(addCompanyToBasket({
            name: name,
            code: code
        }))
        navigate('/')
    }

    const filterOptions = ["1Day", "1 Week", "1 Month", "6 Months", "1 Year", "3 Years", "5 Years"];


    // Info we are getting from eod historical api
    // Visit https://eodhistoricaldata.com/financial-academy/financial-faq/fundamentals-glossary-common-stock/
    // for glossary on fundamental stock values

    // Corporate Info Values
    const [name, setName] = useState(null);
    const [companyDescription, setCompanyDescription] = useState(null);
    const [corporateExecutive, setCorporateExecutive] = useState(null);
    const [marketCap, setMarketCap] = useState(null);
    // Company Profile Values
    const [price, setPrice] = useState("");
    const [peRatio, setPeRatio] = useState(null);
    const [pbRatio, setPbRatio] = useState(null);
    const [psRatio, setPsRatio] = useState(null);
    // Profitability Values
    const [ebitda, setEbitda] = useState(null);
    const [profitMargin, setProfitMargin] = useState(null);
    const [roe, setRoe] = useState(null);
    const [roa, setRoa] = useState(null);
    // Growth Values
    const [eps, setEps] = useState(null);
    const [revenueGrowth, setRevenueGrowth] = useState(null);
    const [dividendYield, setDividendYield] = useState(null);


    useEffect(() => {
        // Fetch stock information
        getFundamentalStockInfo();
        getEODStockInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // useEffect(() => setLoading());

    // For fundamental stock info
    function getFundamentalStockInfo() {

        const url = `https://eodhistoricaldata.com/api/fundamentals/${code}.US?api_token=${KEY}`;
        console.log(`Request being made to : ${url}`)
        axios.get(url).then((res) => {
            console.log(`res:`, res)
            fundamentalCallback(res.data)
        });

        // const url = "https://eodhistoricaldata.com/api/fundamentals/" + code + ".US?api_token=" + KEY;
        // const request = new XMLHttpRequest();
        // request.open('GET', url, true);
        // request.onload = fundamentalCallback;
        // request.send(null);
    }

    // For end of day stock info like price/close
    function getEODStockInfo() {
        const url = "https://eodhistoricaldata.com/api/eod/" + code + ".US?api_token=" + KEY +
            "&fmt=json";
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = EODCallback;
        request.send(null);

    }

    // End of day info callback
    function EODCallback(request) {
        const data = JSON.parse(request.target.response);
        const latestEntry = data[data.length - 1]; // Get the latest entry from the response array
        const latestPrice = latestEntry?.close;
        setPrice(latestPrice);
    }

    // fundamental stock info callback
    function fundamentalCallback(data) {
        // const data = JSON.parse(request.target.response);
        console.log(`data:`, data)

        // Corporate Info Values
        setName(getGeneral(data, "Name"));
        setCompanyDescription(getGeneral(data, "Description"));
        const officers = getGeneral(data, "Officers");
        setCorporateExecutive(officers[0].Name); // That is where corp exec name is always located
        setMarketCap(getHighlights(data, "MarketCapitalization"));

        // Company Profile Values
        //setPrice(getTechnicalAnalysis(data, "close"));
        setPeRatio(getHighlights(data, "PERatio"));
        setPbRatio(getValuation(data, "PriceBookMRQ"));
        setPsRatio(getValuation(data, "PriceSalesTTM"));

        // Profitability Values
        setEbitda(getHighlights(data, "EBITDA"));
        setProfitMargin(getHighlights(data, "ProfitMargin"));
        setRoe(getHighlights(data, "ReturnOnEquityTTM"));
        setRoa(getHighlights(data, "ReturnOnAssetsTTM"));

        // Growth Values
        setEps(getHighlights(data, "EPSEstimateCurrentYear"));
        setRevenueGrowth(getHighlights(data, "QuarterlyRevenueGrowthYOY"));
        setDividendYield(getHighlights(data, "DividendYield"));


        setLoading(false)

    }

    // Helper function
    // parses the full json data first to get the General section
    // then parses the General section to get the inputted feature from the data
    function getGeneral(data, feature) {
        const general = data["General"];
        const val = general[feature];
        return val;
    }

    // Helper function
    // parses the full json data first to get the Highlights section
    // then parses the Higlights section to get the inputted feature from the data
    function getHighlights(data, feature) {

        const highlights = data["Highlights"];
        const val = highlights[feature];
        return val;

    }

    // Helper function
    // parses the full json data first to get the Valuation section
    // then parses the Valuation section to get the inputted feature from the data
    function getValuation(data, feature) {

        const valuation = data["Valuation"];
        const val = valuation[feature];
        return val;

    }

    const [mode, setMode] = useState(1);
    //const [companyName, setCompanyName] = useState('');


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [titleType, setTitle] = useState([
        "Corporate Info",
        "Company Profile",
        "Profitablity",
        "Growth",
    ]);

    const [activeCard, setActiveCard] = useState("Corporate Info");

    const updateOption = (e) => {
        const option = parseInt(e.target.value);
        // console.log(`Selected: ${option}`)
        setMode(option);
    };

    function Corporate() {

        const formattedMarketCap = marketCap ? marketCap.toLocaleString() : ""; // Adds commas when number gets big

        return (
            <div>
                <h6 className="mb-2"><span className="font-bold">Company Description:</span> {companyDescription} </h6>
                <h6 className="mb-2"><span className="font-bold">Corporate Executive:</span> {corporateExecutive} </h6>
                <h6><span className="font-bold">Market Cap:</span> {marketCap ? `$${formattedMarketCap}` : ""}</h6>
            </div>
        );
    }

    function CompanyProfile() {
        return (
            <div>
                <h6 className="mb-2"><span className="font-bold">Price:</span> ${price}</h6>
                <h6 className="mb-2"><span className="font-bold">P/E:</span> {peRatio}</h6>
                <h6 className="mb-2"><span className="font-bold">P/B:</span> {pbRatio}</h6>
                <h6><span className="font-bold">P/S:</span> {psRatio}</h6>
            </div>
        );
    }

    function Profitablity() {
        const formattedEBITDA = ebitda ? ebitda.toLocaleString() : "";

        return (
            <div>
                <h6 className="mb-2"><span className="font-bold">EBITDA:</span> ${formattedEBITDA}</h6>
                <h6 className="mb-2"><span className="font-bold">Profit Margin:</span> {profitMargin}</h6>
                <h6 className="mb-2"><span className="font-bold">ROE:</span> {roe}</h6>
                <h6><span className="font-bold">ROA:</span> {roa}</h6>
            </div>
        );
    }


    function Growth() {
        return (
            <div>
                <h6 className="mb-2"><span className="font-bold">EPS Growth:</span> {eps}</h6>
                <h6 className="mb-2"><span className="font-bold">Revenue Growth:</span> {revenueGrowth}</h6>
                <h6><span className="font-bold">Div Yield Growth:</span> {dividendYield}</h6>
            </div>
        );
    }

    const formattedEBITDA = ebitda ? ebitda.toLocaleString() : ''; // adds commas

    return (
        <div className="Screener_Dashboard">
            <h1 className="Dashboard-Stock bg-gray-700 text-white">Dashboard Stock</h1>
            <CustomBackButton />

            {loading ?
                (
                    <div className="pt-24">
                        <CircularProgress size={100} thickness={2.5} sx={{ marginLeft: '45%' }} />
                    </div>
                ) :
                (
                    <>
                        <div className="dashBoard">
                            <div className="dashboard_left">
                                <div className="app_stats">
                                    {titleType.map((value, index) => (
                                        <Cards
                                            key={index}
                                            title={value}
                                            desc={
                                                index === 0
                                                    ? name
                                                    : index === 1
                                                        ? "Price: $" + price
                                                        : index === 2
                                                            ? "EBITDA: $" + formattedEBITDA
                                                            : "EPS: " + eps
                                            }
                                            onClick={() => {
                                                setActiveCard(value);
                                            }}
                                            active={activeCard}
                                        />
                                    ))}
                                </div>
                                <div className="description">
                                    <Card>
                                        <CardContent>
                                            {activeCard === "Corporate Info" ? (
                                                <Corporate value={name} />
                                            ) : activeCard === "Company Profile" ? (
                                                <CompanyProfile value={price} />
                                            ) : activeCard === "Profitablity" ? (
                                                <Profitablity value={formattedEBITDA} />
                                            ) : (
                                                <Growth value={eps} />
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="dashboard_right" style={{ marginLeft: '350px' }}>
                                    <h2 style={{ fontWeight: "bold", margin: "1em 0", fontSize: "24px" }}>{code} Price History</h2>
                                </div>
                            </div >
                        </div >
                        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                            <Grid item xs={6} >
                                <Grid container spacing={2} direction="column" >
                                    <Grid item xs={2} md={1} >
                                        <CustomToggleButtonGroup
                                            mode={mode}
                                            filterOptions={filterOptions}
                                            buttonwidth={"14%"}
                                            disabledButton={0}
                                            updateOption={updateOption}
                                        />
                                    </Grid>
                                    <Grid item name="chart-grid-item" xs={10} md={5} >
                                        <ChartWrapperCS
                                            stock={name}
                                            ticker={value}
                                            mode={mode}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} >
                                <Grid container spacing={2} direction="column" sx={{ paddingLeft: '20%', paddingTop: '12%' }} >
                                    <ToggleButtonGroup>
                                        <Stack spacing={3} direction="column" >
                                            <CustomButton buttonText="Company News" />
                                            <CustomButton buttonText="Market News" />
                                            <CustomButton buttonText="Similar Companies" />
                                            <CustomButton buttonText="Add To PortFolio" warningColor={true} handleOnClick={() => setOpenDialog(true)} />
                                        </Stack>
                                    </ToggleButtonGroup>
                                </Grid>
                            </Grid>
                        </Grid>
                        <CustomDialog
                            openDialog={openDialog}
                            handleClose={() => setOpenDialog(false)}
                            dialogTitle="Add Stock to Basket"
                            dialogContentText="Are you sure you want to add this stock to the basket?"
                            dialogConfirmButtonText="Add"
                            dialongConfirmAction={() => handleAddToBasket()}
                        />
                        <Snackbar
                            anchorOrigin={{ vertical, horizontal }}
                            open={openSnackbar}
                            onClose={handleClose}
                            message="I love snacks"
                            key={vertical + horizontal}
                            autoHideDuration={1500}
                            sx={{ width: '30%' }}
                        >
                            <Alert
                                onClose={handleClose}
                                icon={<CheckIcon fontSize="inherit" />}
                                severity="success"
                                sx={{ width: '100%' }}
                            >
                                {`${code} - ${name} ticker added to basket!`}
                            </Alert>
                        </Snackbar>

                    </>
                )
            }
        </div>
    )
}


