import {Link} from "react-router-dom";

function WishlistCard({wishlist, onDelete, displayNumber}) {
  return (
    <div className="wishlist-card">
        <div className="wishlist-card-header">
            <h2>{wishlist.wishlist_name}</h2>
        </div>
        <p className="wishlist-description">{wishlist.description || "No description available."}</p>
        <div className="wishlist-meta">
            <span>Wishlist #{displayNumber}</span>
        </div>
        <div className="wishlist-card-actions">
            <Link to={`/wishlists/${wishlist.id}`}className="view-btn">Open</Link>
            <button className="delete-btn" onClick={() => onDelete(wishlist.id)}>Delete</button>
        </div>
    </div>
  );
}
export default WishlistCard;
