import currencyCodes from "currency-codes";
import getSymbolFromCurrency from "currency-symbol-map";

// GET FLAG
export function getCurrencyFlag(code){
    const countryCode=code.slice(0,2);
    return countryCode
    .toUpperCase()
    .replace(/./g,char=>
        String.fromCodePoint(
            127397+
            char.charCodeAt()
        )
    );
}

// GET DETAILS
export function getCurrencyDetails(code){
    const details=currencyCodes.code(code);
    return{
        code:code,
        name:details?.currency|| code,
        symbol:
        getSymbolFromCurrency( code)|| code,
        flag:getCurrencyFlag(code)
    };
}