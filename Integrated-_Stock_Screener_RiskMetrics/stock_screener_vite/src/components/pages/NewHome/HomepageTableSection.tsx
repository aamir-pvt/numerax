import { Alert, CircularProgress, Snackbar } from "@mui/material";
import React, { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import CustomCheckBox from "./CustomCheckBox";
import { BasketCompany } from "@/features/basket/basketSlice";
import { useAppDispatch } from "@/app/hooks";
import { addCompanyToBasket, removeCompanyFromBasket } from "@/features/basket/basketSlice"
import CheckIcon from '@mui/icons-material/Check';
import { addCompanyToPortfolio, removeCompanyToPortfolio } from "@/features/portfolio/portfolioSlice";
import { Company } from "@/hooks/useCompanyStockFilter";

interface Props {
  companies: Company[]
  startIndex: number;
  endIndex: number;
  loadingInfo: boolean;
  marketCaps: number[];
  stockPrices: number[];
  peRatios: number[];
  pbRatios: number[];
  psRatios: number[];
  profitMargins: number[];
  roes: number[];
  roas: number[];
  eps: number[];
  revenueGrowths: number[];
  divYieldGrowths: number[];
  showOverview: boolean;
  showProfitability: boolean;
  showGrowth: boolean;
  isCompanyInBasket: (companyName: string) => boolean;
}

const HomepageTableSection = memo(function HomepageTableSection({
  companies,
  startIndex,
  endIndex,
  loadingInfo,
  marketCaps,
  stockPrices,
  peRatios,
  pbRatios,
  psRatios,
  profitMargins,
  roes,
  roas,
  eps,
  revenueGrowths,
  divYieldGrowths,
  showOverview,
  showProfitability,
  showGrowth,
  isCompanyInBasket,
}: Props) {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [snackBarState, setSnackBarState] = useState({
    openSnackbar: false,
    action: 'added',
  });

  const handleClick = (companyName: string) => {
    navigate(`/companyDetails?code=${companyName}`);
  }

  const { openSnackbar, action } = snackBarState;

  const handleChange = (company: BasketCompany) => {

    if (isCompanyInBasket(company.code)) {
      // console.log(`Clicked on company named: ${company.name} and code: ${company.code} checkbox`);
      dispatch(removeCompanyFromBasket(company));
      const selectedCompany = companies.filter((c) => c.Name === company.code)[0];
      dispatch(removeCompanyToPortfolio(selectedCompany));
      // setSnackBarState({ ...snackBarState, openSnackbar: true, action: 'removed from' });
      return;
    }

    // console.log(`Clicked on company named: ${company.name} and code: ${company.code} checkbox`);
    dispatch(addCompanyToBasket(company));
    const selectedCompany = companies.filter((c) => c.Name === company.code)[0];
    dispatch(addCompanyToPortfolio(selectedCompany));
    // setSnackBarState({ ...snackBarState, openSnackbar: true, action: 'added to' });
  };



  function handleCloseSnackbar(): void {
    setSnackBarState({ ...snackBarState, openSnackbar: false });
  }

  return (
    <div className="w-full space-y-2 ">
      <div className="grid grid-cols-8 w-full bg-gray-700 text-white rounded-t-lg py-3 px-3">
        <h1>Ticker</h1>
        <h1 className="col-span-2">Name</h1>
        <h1>MarketCap</h1>
        <h1>Price</h1>
        {showOverview && (
          <>
            <h1>P/E</h1>
            <h1>P/B</h1>
            <h1>P/S</h1>

          </>
        )}
        {showProfitability && (
          <>
            <h1>Profit Margin</h1>
            <h1>ROE</h1>
            <h1>ROA</h1>
          </>
        )}
        {showGrowth && (
          <>
            <h1>EPS</h1>
            <h1>Revenue Growth</h1>
            <h1>Div Yield Growth</h1>
          </>
        )}



      </div>
      {loadingInfo ?
        <div className="pt-24">
          <CircularProgress size={100} thickness={2.5} sx={{ marginLeft: '45%' }} />
        </div> : (
          companies.slice(startIndex, endIndex).map((company, index) => (
            <div className="w-full hover:bg-slate-200 " key={index} onDoubleClick={() => handleClick(company.Name)} >
              <div className="grid grid-cols-8 px-3 h-8 pt-1">
                <h3 className="text-blue-900">
                  {" "}
                  {/* Link to CompanyDetails page */}
                  {/* <a href={`/companyDetails?code=${company.Name}`} /> */}
                  <Link to={`/companyDetails?code=${company.Name}`}>
                    {company.Name}
                  </Link>
                </h3>
                <h3 className="col-span-2 text-nowrap">{company.CompanyName}</h3>
                <h3>
                  <span>
                    {new Intl.NumberFormat("en", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(marketCaps[index])}
                  </span>
                </h3>
                <h3>
                  <span>${stockPrices[index]}</span>
                </h3>
                {showOverview && (
                  <>
                    <h3>{peRatios[index]}</h3>
                    <h3>{pbRatios[index]}</h3>
                    <div className="grid grid-cols-2 ">
                      <h3>{psRatios[index]}</h3>
                      <Tooltip
                        title={isCompanyInBasket(company.Name) ? "Remove from basket" : "Add to basket"}
                        placement="top-end"
                        leaveDelay={50}
                        leaveTouchDelay={500}
                      >
                        <div>
                          {/* <CustomCheckBox
                            checked={isCompanyInBasket(company.Name)}
                            handleChange={() => handleChange({ "name": company.CompanyName, "code": company.Name })}
                          /> */}
                        </div>
                      </Tooltip>
                    </div>

                  </>
                )}
                {showProfitability && (
                  <>
                    <h3>{profitMargins[index]}</h3>
                    <h3>{roes[index]}</h3>
                    <div className="grid grid-cols-2">
                      <h3>{roas[index]}</h3>
                      {/* <CustomCheckBox
                        checked={isCompanyInBasket(company.Name)}
                        handleChange={handleChange({ name: company.CompanyName, code: company.Name })}
                      /> */}
                    </div>
                  </>
                )}
                {showGrowth && (
                  <>
                    <h3>{eps[index]}</h3>
                    <h3>{revenueGrowths[index] ? revenueGrowths[index] : 'N/A'}</h3>
                    <div className="grid grid-cols-2">
                    <h3>{divYieldGrowths[index] ? divYieldGrowths[index]: 'N/A'}</h3>
                    
                      {/* <CustomCheckBox
                        checked={isCompanyInBasket(company.Name)}
                        handleChange={handleChange({ name: company.CompanyName, code: company.Name })}
                      /> */}
                    </div>
                  </>
                )}
              </div>

              <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={openSnackbar}
                onClose={handleCloseSnackbar}
                message="I love snacks"
                key={'bottom' + 'right'}
                // autoHideDuration={600}
                sx={{ width: '30%' }}
              >
                <Alert
                  onClose={handleCloseSnackbar}
                  icon={<CheckIcon fontSize="inherit" />}
                  severity="info"
                  sx={{ width: '100%' }}
                >
                  {`${company.Name} - ${company.CompanyName} ticker ${action} basket!`}
                </Alert>
              </Snackbar>
            </div>
          ))
        )
      }
    </div>
  );
})

export default HomepageTableSection;