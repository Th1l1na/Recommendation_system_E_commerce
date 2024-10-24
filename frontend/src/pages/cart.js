import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Cart", href: "/cart", current: false },
  { name: "Home", href: "/test", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

const truncate = (text, length) => {
  if (text.length > length) {
    return text.slice(0, length) + "...";
  } else {
    return text;
  }
};

const CartPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});

  useEffect(() => {
    const fetchWishlistItems = async () => {
      const userId = localStorage.getItem("user_id");
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/wishlist?user_id=${userId}`
          );
          setWishlistItems(response.data.wishlist_items); // Update based on your API response
        } catch (error) {
          console.error("Error fetching wishlist items:", error);
        }
      }
    };

    const fetchCategoriesAndProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products");
        setCategories(Object.keys(response.data));
        setProductsByCategory(response.data);
      } catch (error) {
        console.error("Error fetching categories and products:", error);
      }
    };

    fetchWishlistItems();
    fetchCategoriesAndProducts();
  }, []);

  return (
    <>
      <Navbar
        navigation={navigation}
        user={user}
        userNavigation={userNavigation}
      />
      <div className="min-h-screen p-4 bg-gray-200">
        <h1 className="mb-4 text-3xl font-bold">Your Wishlist</h1>
        <div className="flex">
          <div className="w-3/4 mx-10">
            <div className="grid grid-cols-3 gap-4">
              {wishlistItems.length > 0 ? (
                wishlistItems.map((product) => (
                  <div
                key={product.asin}
                className="flex flex-col w-full product-card"
              >
                {/* Image Row */}
                <div className="flex-grow">
                  <img
                    src={product.imgUrl}
                    alt={product.title}
                    className="p-4 mx-auto product-img"
                  />
                </div>

                {/* Info Row with a fixed height */}
                <div className="flex-shrink-0 h-40 product-info">
                  <div className="product-title">
                    {truncate(product.title, 40)}
                  </div>
                  <div className="product-price">${product.price}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p>Stars: {product.stars}</p>
                      <p>Reviews: {product.reviews}</p>
                    </div>

                    <div className="flex items-center justify-end">
                      <a
                        href={product.productURL}
                        className="px-4 py-2 text-white transition duration-200 bg-green-500 hover:bg-green-600 button-card"
                      >
                        View Product
                      </a>
                    </div>
                  </div>
                </div>
              </div>
                ))
              ) : (
                <div>No items in your wishlist.</div>
              )}
            </div>
          </div>
          <aside
            className="w-1/4 p-4 mx-12 bg-gray-100"
            style={{ maxHeight: "520px", overflowY: "auto" }}
          >
            <div className="mb-4 text-xl font-bold">Category</div>
            <ul>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category}>
                    <Link
                      to={`/category/${encodeURIComponent(category)}`}
                      className="text-lg font-bold"
                    >
                      {category}
                    </Link>
                  </li>
                ))
              ) : (
                <li>No categories available</li>
              )}
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
};

export default CartPage;
