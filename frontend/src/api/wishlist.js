import API from "../services/api";

export const getMyWishlists = async () => {
    return await API.get("/wishlists/my");
};
export const createWishlist = async (wishlistdata) => {
    return await API.post("/wishlists", wishlistdata);
};
export const deleteWishlist = async (wishlistId) => {
    return await API.delete(`/wishlists/${wishlistId}`);
};
