import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import paths from "./utils/constants/paths";

import Navbar from "./components/shared/Navbar";
import HomePage from "./pages/Home.page";
import CompanyListPage from "./pages/CompanyList.page";
import CompanyDetailsPage from "./pages/CompanyDetail.page";
import CryptoListPage from "./pages/CryptoList.page";
import CryptoDetailsPage from "./pages/CryptoDetails.page";

import "./Styles.css";
import NewHomePage from "./pages/NewHome.page";

function AppRouter() {
    return (
        <Router>
        <Switch>
            <>
                <Navbar />
                <Route path={paths.HOME} exact component={NewHomePage} />
                <Route path={paths.COMPANYSTOCKS} component={CompanyListPage}/>
                <Route path={paths.COMPANYDETAILS} component={CompanyDetailsPage} />
                <Route path={paths.CRYPTOS} component={CryptoListPage} />
                <Route path={paths.CRYPTODETAILS} component={CryptoDetailsPage} />
                <Route path="/crypto" component={CryptoListPage} />

            </>
        </Switch>
    </Router>
    );
}

export default AppRouter;
