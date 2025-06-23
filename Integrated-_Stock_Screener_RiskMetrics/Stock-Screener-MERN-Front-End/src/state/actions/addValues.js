 const addValue = (data) => {
    return{
        type: "ADD",
        payload: {
            filter: data
        }
    };
}

export default addValue;

