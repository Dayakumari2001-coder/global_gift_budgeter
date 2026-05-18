import { useEffect, useState } from "react";
import { getMyWishlists,createWishlist,deleteWishlist } from "../api/wishlist";
import WishlistForm from "../components/wishlist/WishlistForm";
import WishlistCard from "../components/wishlist/WishlistCard";
import API from "../services/api";
import "../styles/dashboard.css";
import "../styles/wishlist.css";

function Dashboard() {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  useEffect(() => {
    fetchWishlists();
  }, []);
  // FETCH WISHLISTS
  async function fetchWishlists() {
    try {
      setLoading(true);
      const response = await getMyWishlists();
      setWishlists(response.data);
      setError("");
    } catch (error) {
      console.log(error);
      setError("Failed to fetch wishlists");
    } finally {
      setLoading(false);
    }
  }
  // CREATE WISHLIST
  async function handleCreateWishlist(wishlistData) {
    try {
      setCreating(true);
      await createWishlist(wishlistData);
      await fetchWishlists();
    } catch (error) {
      console.log(error);
      alert("Failed to create wishlist");
    } finally {
      setCreating(false);
    }
  }
  // DELETE WISHLIST
  async function handleDeleteWishlist(wishlistId) {
    const confirmDelete = window.confirm("Are you sure you want to delete this wishlist?");
    if (!confirmDelete) return;  
    try {
        await deleteWishlist(wishlistId);
        setWishlists(wishlists.filter((wishlist) => wishlist.id !== wishlistId));
        } catch (error) {         
            console.log(error);
            alert("Failed to delete wishlist");
        }
    }
    //LOAODING UI
    if (loading) {
        return <div className="dashboard-loading"><h2>Loading Dashboard...</h2></div>;
    }
    //MAIN UI
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1>My Wishlists</h1> 
            <p>Manage your global gift budgets</p>  
          </div>
        </div>
        {error && <div className="dashboard-error">{error}</div>}    
        {/* CREATE WISHLIST FORM */}
        <div className="dashboard-section">
            <WishlistForm onCreate={handleCreateWishlist} />
        </div>
        {/* EMPTY STATE */}
        {!loading && wishlists.length === 0 &&(
            <div className="empty-state">
                <h2>No Wishlist yet</h2>
                <p>Create your first wishlist to start tracking gifts and budgets.</p>
            </div>
        )}
        {/* WISHLIST GRID */}
        {wishlists.length > 0 && (
            <div className="wishlist-grid">{wishlists.map((wishlist, index) => (
                <WishlistCard key={wishlist.id} wishlist={wishlist} displayNumber={index + 1} onDelete={handleDeleteWishlist}/>
            ))}</div>
        )}
      </div>
    );
}
export default Dashboard;
      