
import React from "react"

interface Props {
    setShowOverview: (value: React.SetStateAction<boolean>) => void; 
    setShowProfitability: (value: React.SetStateAction<boolean>) => void; 
    setShowGrowth: (value: React.SetStateAction<boolean>) => void; 

}

export default function HomepageButtonSection({ setShowOverview, setShowProfitability, setShowGrowth}: Props) { 
    return (
      <div className="flex space-x-1">
        <button
          className="bg-gray-600 btn-info text-white py-2 md:px-10 rounded overview-button"
          onClick={() => {
            setShowOverview(true);
            setShowProfitability(false);
            setShowGrowth(false);
          }}
        >
          Overview
        </button>
        <button
          className="bg-gray-600 btn-info text-white py-2 md:px-10 rounded"
          onClick={() => {
            setShowOverview(false);
            setShowProfitability(true);
            setShowGrowth(false);
          }}
        >
          Profitability
        </button>
        <button
          className="bg-gray-600 btn-info text-white py-2 md:px-10 rounded"
          onClick={() => {
            setShowOverview(false);
            setShowProfitability(false);
            setShowGrowth(true);
          }}
        >
          Growth
        </button>
        <button
          className="bg-gray-600 btn-info text-white py-2 md:px-10 rounded"
          onClick={() => {
            window.location.href = "./crypto";
          }}
        >
          Crypto
        </button>
      </div>
    );

}