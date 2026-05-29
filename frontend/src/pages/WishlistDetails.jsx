import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import API from "../services/api";
import ItemForm from "../components/items/ItemForm";
import ItemsTable from "../components/items/ItemsTable";
import { getWishlistItems, addItem } from "../api/items";
import BackButton from "../components/BackButton";
import "../styles/item.css";

function WishlistDetails() {
  const user = JSON.parse(localStorage.getItem("user"));
  const {id} = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [showForm, setshowForm]=useState(false);
  const [items, setItems] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [editingItem, setEditingItem] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);

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
      setAdding(true);
      await addItem( id, itemData);
      await fetchItems();
      setshowForm(false);
    } catch (error) {
     console.log(error.response.data);
      console.error("Error adding item:", error);
    }finally {
      setAdding(false);
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

  function handleEditItem(item) {
    console.log("Editing item:", item);
    setEditingItem(item);
    setshowForm(true);
  }

  async function handleUpdateItem(itemData) {
    try {
      setEditing(true);
      await API.put(
        `/items/${editingItem.id}`,
        itemData
      );
      await fetchItems();
      setTimeout(() => {setEditingItem(null);
        setshowForm(false);
      }, 500);
    } catch (error) {
      console.error(
        "Error editing item:",
        error.response?.data || error
      );
    }finally {
      setEditing(false);
    }
  }
  if (!wishlist) {
     return <h2>Loading...</h2>;
  }
  return (
      <div className="wishlist-page-header">
        <BackButton/>
        <h1> Wishlist Items</h1>
        <p> Manage your global gift items </p>
        {/* HEADING */}
        <div className="wishlist-details-header">
          <h1>{wishlist.wishlist_name} </h1>
          <p>{wishlist.description} </p>
        </div>
        <div>
          {/*BUTTON*/}
          <button
             className="add-item-btn"
             onClick={()=>
              setshowForm(!showForm)}
          >
            {showForm ?"Close Form"
            :"+Add Item"}
          </button>
          {/*FORM */}
          {showForm &&(
            <div className="item-form-section">
              <ItemForm
                key={
                  editingItem
                    ? editingItem.id
                    : "add-mode"
                }
                onAddItem={
                  editingItem
                    ? handleUpdateItem
                    : handleAddItem
                }
                initialData={editingItem}
                isEditing={editingItem !== null}
                adding={adding}
                editing={editing}
                onCancelEdit={() =>{ setEditingItem(null)
                  setshowForm(false);
                }}
              />
            </div> 
          )}
          {/*TOTAL BUDGET*/}
        <div className="budget-card">
          <h2>Total Budget</h2>
          <h1>{user?.home_currency}{" "}{totalBudget.toFixed(2)}</h1>
        </div>
        <ItemsTable items={items} onDeleteItem={handleDeleteItem} onEditItem={handleEditItem} />
      </div>
    </div>
  ); 
}
export default WishlistDetails;
