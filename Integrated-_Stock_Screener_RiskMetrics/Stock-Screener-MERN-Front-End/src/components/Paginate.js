import React from "react";

function Paginate({ number, onPageChange }) {
  return (
    <li className="page-item">
      <button className="page-link" onClick={() => onPageChange(number)}>
        {number}
      </button>
    </li>
  );
}

export default Paginate;