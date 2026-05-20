import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import API from "../services/api";
import ItemForm from "../components/items/ItemForm";
import ItemBlock from "../components/items/ItemBlock"; 
import ItemsTable from "../components/items/ItemsTable";
import { getWishlistItems, addItem } from "../api/items";
import "../styles/item.css";

function WishlistDetails() {
  const user = JSON.parse(localStorage.getItem("user"));
  const {id} = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [items, setItems] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  useEffect(() => { fetchwishlist(); fetchItems(); }, []);
  async function fetchwishlist() {
    try {
      const response = await API.get(`/wishlists/${id}`);
      setWishlist(response.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }
  async function fetchItems() {
    try {
      const response = await getWishlistItems(id);
      setItems(response.data);
      const total =
        response.data.reduce(
          (sum, item) => sum + (item.converted_price || 0),
          0
        );
      setTotalBudget(total);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }
  async function handleAddItem(itemData) {
    try {
      await addItem( id, itemData);
      await fetchItems();
    } catch (error) {
     console.log(error.response.data);
      console.error("Error adding item:", error);
    }
  }
  async function handleDeleteItem(itemId) {
    try {
      await API.delete(`/items/${itemId}`);
      await fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }
  async function handleEditItem(item) {
    const newName = prompt(
      "Edit item name",
      item.item_name
    );
    if (!newName) return;
    const newDescription = prompt(
      "Edit description",
      item.description || ""
    );
    const newPrice = prompt(
      "Edit price",
      item.foreign_price
    );
    if (!newPrice) return;
    const newCurrency = prompt(
      "Edit currency",
      item.foreign_currency
    );
    if (!newCurrency) return;
    const updatedItem = {
      item_name: newName,
      description: newDescription,
      foreign_price: parseFloat(
        newPrice
      ),
      foreign_currency:
        newCurrency.toUpperCase()
    };
    try {
      console.log(item.id);
      await API.put(
        `/items/${item.id}`,
        updatedItem
      );
      await fetchItems();
    } catch (error) {
      console.error(
        "Error editing item:",
        error.response?.data || error
      );
    }
  }
  if (!wishlist) {
     return <h2>Loading...</h2>;
  }
  return (
      <div className="wishlist-page-header">
        <h1> Wishlist Items</h1>
        <p> Manage your global gift items </p>
        {/* HEADING */}
        <div className="wishlist-details-header">
          <h1>{wishlist.wishlist_name} </h1>
          <p>{wishlist.description} </p>
        </div>
        <div className="item-form-section">
          <ItemForm onAddItem={handleAddItem} />
        </div> 
        <div className="budget-card">
          <h2>Total Budget</h2>
          <h1>{user?.home_currency}{" "}{totalBudget.toFixed(2)}</h1>
        </div>
        <ItemsTable items={items} onDeleteItem={handleDeleteItem} onEditItem={handleEditItem} />
      </div>
  );
}
export default WishlistDetails;
