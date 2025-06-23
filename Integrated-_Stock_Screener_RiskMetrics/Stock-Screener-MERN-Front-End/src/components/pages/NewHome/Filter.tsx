import React from "react";
import { FilterOption } from "../../../utils/defaults/companyQueryDefaults";

function Filter<T>(props: {
    displayName: string;
    filterName: string;
    options: FilterOption<T>[];
    defaultSelected: FilterOption<T>;
    onChange: (filterName: string, optionSelected: FilterOption<T>) => void;
}) {
    const [selected, setSelected] = React.useState<FilterOption<T>>(
        props.defaultSelected
    );

    return (
        <div className="grid text-xs grid-cols-2 gap-x-2">
            {/* selction title */}
            <h4 className=" flex items-center justify-end">
                {props.displayName}{" "}
            </h4>
            {/* selction button */}
            <select
                value={selected.optionName || ""}
                className="bg-gray-700 rounded-md text-white w-full p-1 outline-none"
                onChange={(e) => {
                    const foundOption = props.options.find(
                        (option) => option.optionName === e.target.value
                    );
                    if (!foundOption) return;
                    props.onChange(props.filterName, foundOption);
                    setSelected(foundOption);
                }}
            >
                {/* options */}
                {props.options.map((option, index) => (
                    <option value={option.optionName} key={index}>
                        {option.optionName}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Filter;
