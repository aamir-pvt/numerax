const implementAddAction = (state = {}, action) => {
  switch (action.type) {
    case "ADD":
      return {
        values: action.payload.filter,
      };

    default:
      return state;

    // case "Company":
    //   return {
    //     CompanyName: action.payload,
    //   };
  }
};

export default implementAddAction;
