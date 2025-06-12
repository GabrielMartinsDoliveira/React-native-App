export const URL_COUNTRIES = "https://restcountries.com/v3.1"

export const HeaderReq = (token) => {
    const header = {
      Authorization: `Bearer ${token}`,
    };
  
    return header;
  };


export const URL_GEO_API = "https://backend-codingmobile.onrender.com/api/"  