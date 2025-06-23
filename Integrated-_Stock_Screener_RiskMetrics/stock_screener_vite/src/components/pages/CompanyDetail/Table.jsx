import React from "react";

const Table = ({ headers, rows }) => {
  return (
    <div className="w-full space-y-2">
      <div className="grid grid-cols-7 w-full bg-gray-700 text-white rounded-t-lg py-3 px-3">
        {headers.map((header, index) => (
          <h1 key={index}>{header}</h1>
        ))}
      </div>
      <div className="w-full">
        {rows.map((row, rowIndex) => (
          <div className="grid grid-cols-7 px-3" key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <h3 key={cellIndex}>{cell}</h3>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;