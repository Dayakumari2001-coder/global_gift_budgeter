import { useState } from "react";
import Select from "react-select";
import currencyCodes from "currency-codes";
import "../../styles/item.css";

function ItemForm({onAddItem, adding}) {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] =useState("");
  const [foreignPrice, setForeignPrice] =useState("");
  const [foreignCurrency,setForeignCurrency] =useState("USD");
  const currencyOptions = currencyCodes.codes().map((code) =>{
    const currency = currencyCodes.code(code);
    return {
      value: currency.code,
      label: `${currency.code} - ${currency.currency}`
    };
  });
  // CUSTOM SELECT STYLES
  const customSelectStyles = {
    control: (provided, state) => ({...provided, 
    minHeight: "52px",
    borderRadius: "10px",
    borderColor: state.isFocused ? "1px solid #6a5cff" : "1px solid #d1d5db",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(106,92,255,0.15)" : "none",
    backgroundColor: "white",
    fontSize: "15px",
    paddingLeft: "4px",
    transition: "0.2s"
    }),
    valueContainer: (provided) => ({...provided,
        padding: "2px 8px"
    }),
    placeholder: (provided) => ({...provided,
        color: "#6b7280" 
    }),
    option: (provided, state) => ({...provided,
        backgroundColor: state.isSelected
            ? "#6a5cff"
            : state.isFocused
            ? "#ede9fe"
            : "white",
        color: state.isSelected ? "white" : "#111827",
        cursor: "pointer",
        padding: "12px 14px"
    })
  };
  async function handleSubmit(e) {
    e.preventDefault();
    if (!itemName.trim()) {
      alert("Item name required");
      return;
    }
    if (!foreignPrice || foreignPrice <= 0) {
      alert("Enter valid price");
      return;
    }
    const itemData = {
      item_name: itemName,
      description: description,
      foreign_price: parseFloat(foreignPrice),
      foreign_currency: foreignCurrency
    };
    await onAddItem(itemData);
    setItemName("");
    setDescription("");
    setForeignPrice("");
    setForeignCurrency("USD");
  }
  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <h2 className="item-form-title">
        Add New Item
      </h2>
      {/* ITEM NAME */}
      <div className="form-group">
        <label> Item Name </label>
        <input
          type="text"
          placeholder="Nike Shoes"
          value={itemName}
          onChange={(e) => setItemName( e.target.value )}
        />
      </div>
      {/* DESCRIPTION */}
      <div className="form-group">
        <label>
          Description
        </label>
        <textarea
          placeholder="Gift description"
          value={description}
          onChange={(e) => setDescription( e.target.value )}
        />
      </div>
      {/* PRICE */}
      <div className="form-group">
        <label> Foreign Price </label>
        <input
          type="number"
          placeholder="100"
          min="0"
          step="0.01"
          value={foreignPrice}
          onChange={(e) => setForeignPrice(e.target.value)}
        />
      </div>
      {/* CURRENCY */}
      <div className="form-group">
        <label> Currency </label>
        <Select
        options={currencyOptions}
        placeholder="Search Currency..."
        styles={customSelectStyles}
        isSearchable
        onChange={(selectOption)=>setForeignCurrency(selectOption.value)}/>
        value={currencyOptions.find((currency) =>currency.value === foreignCurrency)}
      </div>
      {/* BUTTON */}
      <button
        type="submit"
        className="primary-btn"
        disabled={adding}
      >
        {adding
          ? "Adding..."
          : "Add Item"}
      </button>
    </form>
  );
}
export default ItemForm;