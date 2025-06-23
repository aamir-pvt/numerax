import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";

export interface BasketCompany {
    name:string,
    code:string
}

export interface BasketState {
  companies: BasketCompany[] 
}

const initialState: BasketState = {
    companies: []
};


export const basketSlice = createSlice({ 
    name: "basket",
    initialState,
    reducers: {
        addCompanyToBasket: (state , action: PayloadAction<BasketCompany>) => {
            state.companies.push(action.payload)
        },
        removeCompanyFromBasket: (state , action: PayloadAction<BasketCompany>) => {
            state.companies = state.companies.filter(company => company.code !== action.payload.code)
        }
    }

})


export const { addCompanyToBasket, removeCompanyFromBasket  } = basketSlice.actions;

export const selectBasket = (state: RootState) : BasketState => state.basket


export default basketSlice.reducer;
