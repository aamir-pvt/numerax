const addClickedCompany = (data) => {
  return {
    type: "Company",
    payload: data,
  };
};

export default addClickedCompany;
