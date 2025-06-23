import React from "react";

interface Props {
  number: number;
  onPageChange: (number: number) => void;

}

function Paginate({ number, onPageChange }: Props) {
  return (
    <li className="page-item">
      <button className="page-link" onClick={() => onPageChange(number)}>
        {number}
      </button>
    </li>
  );
}

export default Paginate;