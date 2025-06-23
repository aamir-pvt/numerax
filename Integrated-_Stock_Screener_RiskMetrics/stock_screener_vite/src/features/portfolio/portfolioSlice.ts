import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { Company } from "@/hooks/useCompanyStockFilter";


export interface PortfolioState {
    companies: Company[]
    
}

const initialState: PortfolioState = {
    companies: []
};


export const portfolioSlice = createSlice({ 
    name: "portfolio",
    initialState,
    reducers: {
        addCompanyToPortfolio: (state , action: PayloadAction<Company>) => {
            state.companies.push(action.payload)
        },
        removeCompanyToPortfolio: (state , action: PayloadAction<Company>) => {
            state.companies = state.companies.filter(company => company.Name !== action.payload.Name)
        }
    }

})


export const { addCompanyToPortfolio, removeCompanyToPortfolio  } = portfolioSlice.actions;

export const selectPortfolio = (state: RootState) : PortfolioState => state.portfolio


export default portfolioSlice.reducer;