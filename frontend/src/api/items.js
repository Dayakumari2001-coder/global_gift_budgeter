import API from "../services/api";


// GET ALL ITEMS OF WISHLIST
export const getWishlistItems =
  async (wishlistId) => {

    return await API.get(
      `/items/${wishlistId}`
    );
};

// ADD ITEM
export const addItem =
  async (wishlistId, itemData) => {
    return await API.post(
      `/items/${wishlistId}`,
      itemData
    );
};