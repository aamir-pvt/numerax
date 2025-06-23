import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import addValues from "../state/actions/addValues";
import { useHistory } from "react-router-dom";
import { Multiselect } from "multiselect-react-dropdown";
import { Input } from "@material-ui/core";
import { defaultMarketFilter } from "../utils/defaults/marketValues";

/**
 * This is the structure for filtering a marketProperty
 */
type FilterRange = {
    Min: number;
    Max: number;
};

/** List of all properties that can be filtered */
const MarketProperties = [
    "MarketCap",
    "PE",
    "Open",
    "Close",
    "Volume",
    "ProfitMargin",
    "ReturnOnEquity",
    "DividendShare",
    "ReturnOnAssests",
    "EpsCurrYear",
    "PriceBook",
    "FiftyTwoWeekHigh",
    "FiftyTwoWeekLow",
] as const;

type MarketValues = { [k in (typeof MarketProperties)[number]]: FilterRange };

/**
 * This is used by the Multiselect component to add new filters dynamically
 * */
type Filter = { name: (typeof MarketProperties)[number] };

function MarketCap() {
    /*
    *we need useHistory() so when we are moving from compnent
     the redux store state is also passed

     *Dispatch allows us to run the actions
    */
    const history = useHistory();
    const dispatch = useDispatch();

    /*
     *This is our usestate hook
     *It allows us to dynamically change the input values
     */
    const [marketValues, setMarketVals] =
        useState<MarketValues>(defaultMarketFilter);

    /** This array includes all the filtering options we have */
    const filterList: Filter[] = useMemo(
        () => [
            { name: "Open" },
            { name: "ProfitMargin" },
            { name: "ReturnOnEquity" },
            { name: "DividendShare" },
            { name: "ReturnOnAssests" },
            { name: "EpsCurrYear" },
            { name: "PriceBook" },
            { name: "FiftyTwoWeekHigh" },
            { name: "FiftyTwoWeekLow" },
            { name: "MarketCap" },
            { name: "PE" },
            { name: "Close" },
            { name: "Volume" },
        ],
        []
    );

    //This is our intially selected Criteria and won't be shown in the list of filter
    //unless its x'ed out
    const initialyAdded: Filter[] = useMemo(
        () => [
            { name: "MarketCap" },
            { name: "PE" },
            { name: "Close" },
            { name: "Volume" },
        ],
        []
    );
    //This contains all our filters lists
    const [filters, setFilter] = useState<{ values: Filter[] }>({
        values: [...filterList],
    });

    /*
     * This UseState does all the magic
     * This hold information on which value is currently selected
     * It helps us update the elements in the screen
     * We can remove or add and its handled by this state
     */
    const [selected, setSelected] = useState<{ values: Filter[] }>({
        values: [...initialyAdded],
    });

    /*Callback Functions for our dropdown options
     *This basically has a parameter with currenly seleted value
     *Those values are stored as an array in selectedList
     *So we basically put that in our selected state
     *Thus it automatically updates our state
     */

    function onSelect(selectedList: Filter[]) {
        setSelected({ values: [...selectedList] });
    }

    //Kind of does the same thing
    function onRemove(selectedList: Filter[], selectedItem: Filter) {
        console.log("removed");
        setMarketVals((prevState) => {
            return {
                ...prevState,
                [selectedItem.name]: defaultMarketFilter[selectedItem.name],
            };
        });
        setSelected({ values: [...selectedList] });
    }

    /*
     *Callback for all state Management system
     *Basically it takes care of holding info for the search
     *It has been reduced to very small function
     */
    const capChange = (
        marketProperty: keyof MarketValues,
        rangeProperty: keyof FilterRange,
        value: number
    ) => {
        // let stateMin = name + "Min";
        // let stateMax = name + "Max";

        setMarketVals((prevValue) => {
            return {
                ...prevValue,
                [marketProperty]: {
                    ...prevValue[marketProperty],
                    [rangeProperty]: value,
                },
            };
        });
    };

    /**
     * Submit handler that moves to next page (CompanyList Page) which returns the results
     */
    const submit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        console.log("Hello");
        const dispatchMarketValue: Record<string, number> = {};

        let key: keyof MarketValues;
        for (key in marketValues) {
            let ranges: keyof FilterRange;
            for (ranges in marketValues[key]) {
                dispatchMarketValue[key + ranges] = marketValues[key][ranges];
            }
        }

        dispatch(addValues(dispatchMarketValue));
        history.push("/returnedCompanies");
    };

    //All the rendering happens here
    return (
        <div>
            <form onSubmit={submit}>
                <>
                    {selected.values.map((value, index) => (
                        <div key={index}>
                            <InputFilters
                                name={value.name}
                                value={marketValues[value.name]}
                                onChange={capChange}
                                min={defaultMarketFilter[value.name]["Min"]}
                                max={defaultMarketFilter[value.name]["Max"]}
                            />
                        </div>
                    ))}
                </>

                <input
                    type="submit"
                    value="Search"
                    className="search btn btn-primary"
                ></input>
            </form>
            {/* Multiselect is a npm library */}
            <Multiselect
                className="filterTweak"
                options={filters.values} // Options to display in the dropdown
                selectedValues={selected.values} // Preselected value to persist in dropdown
                onSelect={onSelect} // Function will trigger on select event
                onRemove={onRemove} // Function will trigger on remove event
                displayValue="name" // Property name to display in the dropdown options
            />
        </div>
    );
}

/*
 * We use this to create a field each time
 * In the render we map through and pass values
 * The values are selected values from UseState
 * Then we pass the name of the field
 * We use concatination to make it controlled component
 */
function InputFilters(props: {
    name: string;
    value: FilterRange;
    min: number;
    max: number;
    onChange: (
        marketProperty: keyof MarketValues,
        rangeProperty: keyof FilterRange,
        marketValue: number
    ) => void;
}) {
    // let minName = value.name + "Min";
    // let maxName = value.name + "Max";
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let name = e.target.name as keyof MarketValues;
        let id = e.target.id as keyof FilterRange;
        let value = parseInt(e.target.value);
        let valueNum = isNaN(value) ? 0 : value;
        props.onChange(name, id, valueNum);
    };

    return (
        <div key={props.name} className="filterTweak">
            <h6>{props.name}</h6>
            <label htmlFor="min">Min: </label>
            <input
                className="filterTweak"
                onChange={onChange}
                id="Min"
                type="number"
                name={props.name}
                value={props.value.Min}
                min={props.min}
                max={props.max}
            ></input>
            <label htmlFor="max">Max: </label>
            <input
                className="filterTweak"
                onChange={onChange}
                id="Max"
                type="number"
                name={props.name}
                value={props.value.Max}
                min={props.max}
                max={props.max}
            ></input>
        </div>
    );
}

export default MarketCap;
