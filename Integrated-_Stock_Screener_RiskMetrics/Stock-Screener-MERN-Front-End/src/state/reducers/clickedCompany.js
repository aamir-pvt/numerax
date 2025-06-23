const clickedCompany = (state = "", action) => {
  switch (action.type) {
    case "Company":
      return {
        CompanyName: action.payload,
      };

    default:
      return state;
  }
};

export default clickedCompany;
