import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Pagination from "react-js-pagination";
// import { useHistory } from "react-router-dom";
import addCompany from "../state/actions/addClickedCompany";
import "./CompanyList.page.css";

const VITE_LOCAL_API = import.meta.env.VITE_LOCAL_API

function CompanyListPage() {
    //setting up our hook state

    // const history = useHistory();
    const dispatch = useDispatch();

    let [stockValues, setStockVal] = useState({
        values: [],
    });
    const [totalCount, setTotalCount] = useState(0);
    const [activePage, setPageVal] = useState([]);
    const [activeValues, setActiveVal] = useState({
        values: [],
    });

    const value = useSelector((state) => state.filter.values);

    //Enter your server url
    const postUrl = VITE_LOCAL_API

    useEffect(() => {
        axios.post(postUrl, value).then(async (resp) => {
            setStockVal({ values: await resp.data });
            setActiveVal({ values: await resp.data.slice(0, 24) });
            setTotalCount(resp.data.length);
            console.log(resp.data.length);
            console.log("HERE");

            try {
                document.querySelector(".main").classList.remove("spinner-1");
            } catch (e) {
                console.log(e.message);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleChange(event) {
        setActiveVal({
            values: stockValues.values.slice((event - 1) * 25, event * 25),
        });
        setPageVal(event);
        console.log(stockValues.values.length);
    }

    function linkClicked(event) {
        dispatch(addCompany(event.target.name));
        history.push("/companyDetails");
    }

    function tableVal(stockValue) {
        return (
            <tr className="list">
                <td className="font-weight-bold">
                    <a href="#" onClick={linkClicked} name={stockValue.Name}>
                        {stockValue.Name}
                    </a>
                </td>
                <td>{stockValue.close}</td>
                <td>{stockValue.volume}</td>
                <td>{stockValue.ProfitMargin}</td>
                <td>{stockValue.PERatio}</td>
                <td>{stockValue.ReturnOnEquityTTM}</td>
                <td>{stockValue.ReturnOnAssetsTTM}</td>
                <td>{stockValue.EPSEstimateCurrentYear}</td>
                <td>{stockValue.DividendShare}</td>
                <td>{stockValue.MarketCapitalizationMln}</td>
                <td>{stockValue.PriceBookMRQ}</td>
            </tr>
        );
    }

    return (
        <div className="full-container">
            <div className="main spinner-1">
                <h3>Top Companies</h3>
                <div className="flexBox">
                    <table className="tables">
                        <thead className="spaceTable">
                            <tr>
                                <th>Company Ticker</th>
                                <th>Price</th>
                                <th>Volume</th>
                                <th>ProfitMargin</th>
                                <th>PERation</th>
                                <th>ReturnOnEquityTTM</th>
                                <th>ReturnOnAssetsTTM</th>
                                <th>EPSEstimateCurrentYear</th>
                                <th>DividendShare</th>
                                <th>MarketCapitalizationMln</th>
                                <th>PriceBook</th>
                            </tr>
                        </thead>
                        <tbody>{activeValues.values.map(tableVal)}</tbody>
                    </table>
                    <div className="Pagination float-right">
                        {stockValues.values.length != 0 && (
                            <Pagination
                                className="move"
                                itemClass="page-item"
                                linkClass="page-link"
                                activePage={activePage}
                                itemsCountPerPage={25}
                                totalItemsCount={totalCount}
                                pageRangeDisplayed={5}
                                onChange={handleChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyListPage;
