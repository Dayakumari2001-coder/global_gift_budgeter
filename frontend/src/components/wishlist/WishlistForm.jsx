import {useState} from "react";

function WishlistForm({ onCreate, creating ,initialData, isEditing, editing, onCancelEdit}){
    const [wishlistName,setWishlistName] = useState( initialData?.wishlist_name || "" );
    const [description, setDescription] = useState(initialData?.description || "" );
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
           <button
                type="submit"
                className="primary-btn"
                disabled={
                    isEditing
                    ? editing
                    : creating
                }
                >
                {isEditing
                    ? (
                        editing
                        ? "Updating..."
                        : "Save Changes"
                    )
                    : (
                        creating
                        ? "Creating..."
                        : "Create Wishlist"
                    )
                }
                </button>
                {isEditing && (
                <button
                    type="button"
                    className="cancel-btn"
                    onClick={onCancelEdit}
                >
                    Cancel
                </button>
                )}
        </form>
    );
}
export default WishlistForm;
