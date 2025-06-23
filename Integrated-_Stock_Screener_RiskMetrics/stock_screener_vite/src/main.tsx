import React from "react";

import { store } from "./app/store";
import { Provider } from "react-redux";

import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { StyledEngineProvider } from "@mui/material";

import ErrorPage from "./pages/ErrorPage";
import NewHomePage from "./pages/NewHome.page";
import CompanyListPage from "./pages/CompanyList.page";
import paths from "./utils/constants/paths";
import CompanyDetailsPage from "./pages/CompanyDetail.page";
import CryptoListPage from "./pages/CryptoList.page";
import CryptoDetailsPage from "./pages/CryptoDetails.page";
import Root from "./pages/Root";
import Portfolio from "./pages/Portfolio.page";
import "./styles.css";


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [{
      errorElement: <ErrorPage />,
      children: [
        {
          path: paths.HOME,
          element: <NewHomePage />
        },
        {
          path: paths.COMPANYSTOCKS,
          element: <CompanyListPage />
        },
        {
          path: paths.COMPANYDETAILS,
          element: <CompanyDetailsPage />
        },
        {
          path: paths.CRYPTOS,
          element: <CryptoListPage />
        },
        {
          path: paths.CRYPTODETAILS,
          element: <CryptoDetailsPage />
        },
        {
          path: paths.CRYPTOLIST,
          element: <CryptoListPage />
        },
        {
          path: paths.PORTFOLIO,
          element: <Portfolio />
        },
      ]
    }]
  }
])


const container = document.getElementById("root");

if (!container) throw new Error("Could not find root element with id 'root'");

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <StyledEngineProvider injectFirst> */}
      <RouterProvider router={router} />
      {/* </StyledEngineProvider> */}
    </Provider>
  </React.StrictMode>
);
