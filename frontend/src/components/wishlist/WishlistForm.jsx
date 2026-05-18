import {useState} from "react";

function WishlistForm({ onCreate, creating }) {
    const [wishlistName, setWishlistName] = useState("");
    const [description, setDescription] = useState("");
    async function handleSubmit(e) {
        e.preventDefault();
        if (!wishlistName.trim()) {
            alert("Please enter a wishlist name.");
            return;
        }
        const wishlistData = {
            wishlist_name: wishlistName,
            description: description
        };
        await onCreate(wishlistData);
        setWishlistName("");
        setDescription("");
    }
    return(
        <form className="wishlist-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Wishlist Name</label>
                <input type="text" placeholder="Enter wishlist name" value={wishlistName}
                onChange={(e) => setWishlistName(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Wishlist description" value={description}
                onChange={(e) => setDescription(e.target.value)} />
            </div>
            <button type="submit" className="primary-btn" disabled={creating}>
                {creating ? "Creating..." : "Create Wishlist"}
            </button>
        </form>
    );
}
export default WishlistForm;
