import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createStore } from "redux";
import { Provider } from "react-redux";
import filterAddReducer from "./state/reducers/implementAdd";
import clickedAddReducer from "./state/reducers/clickedCompany";
import { combineReducers } from "redux";

import "./Styles.css";

const allReducers = combineReducers({
  filter: filterAddReducer,
  link: clickedAddReducer,
});

const store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
