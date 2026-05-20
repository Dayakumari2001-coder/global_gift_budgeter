import API from "../services/api";

export const getCurrencies=
async()=>{

    return await API.get(
        "/currencies/available"
    );
};