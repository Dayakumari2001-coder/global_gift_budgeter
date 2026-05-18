import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import API from "../services/api";
import ItemForm from "../components/items/ItemForm";
import ItemBlock from "../components/items/ItemBlock"; 
import ItemsTable from "../components/items/ItemsTable";
import { getWishlistItems, addItem } from "../api/item";
import "../styles/item.css";

function WishlistDetails() {
  const {id} = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [items, setItems] = useState([]);
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
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }
  async function handleAddItem(wishlistId, itemData) {
    try {
      await addItem( wishlistId, itemData);
      await fetchItems();
    } catch (error) {
      console.log(error);
      console.error("Error adding item:", error);
    }
  }
  if (!wishlist) {
     return <h2>Loading...</h2>;
  }
  return (
    <div className="wishlist-details-page">
      {/* HEADING */}
      <div className="wishlist-details-header">
        <h1>{wishlist.wishlist_name} </h1>
        <p>{wishlist.description} </p>
      </div>
      <div className="item-form-section">
        <ItemForm wishlistId={id} onAddItem={handleAddItem} />
      </div> 
      <ItemsTable items={items} />
    </div>
  );
}
export default WishlistDetails;
