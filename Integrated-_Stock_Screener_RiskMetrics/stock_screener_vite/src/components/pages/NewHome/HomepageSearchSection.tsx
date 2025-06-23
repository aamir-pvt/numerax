import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai';
import { MdFilterAlt, MdFilterAltOff } from 'react-icons/md';
import { useNavigate } from 'react-router'

interface Props {
  setCompanySearch: (value: React.SetStateAction<string>) => void;
  companySearch: string;
  setDisplayFilter: (value: React.SetStateAction<boolean>) => void;
  displayFilter: boolean;
  pathname: string;
  searchParams: any;
}

export default function HomepageSearchSection({ setCompanySearch, companySearch, setDisplayFilter, displayFilter, pathname, searchParams }: Props) {

  const navigate = useNavigate();

  return (
    <div className="w-full flex">
      {/* Company name and ticker search bar  */}
      <form className="bg-gray-700 w-2/5 px-3 py-2 rounded-lg text-white flex space-x-2 items-center">
        <button type="submit">
          <AiOutlineSearch className="text-xl" />
        </button>
        <input
          type="text"
          className="rounded-none w-full bg-transparent outline-none "
          placeholder="Search for a ticker, company name"
          onChange={(e) => {
            if (e.target.value === "") {
              searchParams.delete("search");
            } else {
              searchParams.set("search", e.target.value);
              navigate(`${pathname}?${searchParams.toString()}`, { replace: true })
            }
            setCompanySearch(e.target.value);
          }}
          value={companySearch}
        />
      </form>
      {/* Filter Section Toggle */}
      <button
        className="foucs:outline-none text-xl ml-3"
        onClick={() => setDisplayFilter((prev) => !prev)}
      >
        {displayFilter ? <MdFilterAltOff /> : <MdFilterAlt />}
      </button>
    </div>
  );
}
