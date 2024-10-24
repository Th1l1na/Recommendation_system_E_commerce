import React, { useState } from 'react';
import axios from 'axios';

import "./ProductPopup.css";

const ProductPopup = ({ product, onClose }) => {
    const [isWishlistUpdated, setIsWishlistUpdated] = useState(false);

    const addToWishlist = () => {
        const userId = localStorage.getItem('user_id');
        axios.post(`http://localhost:5000/wishlist/${userId}`, { asin: product.asin })
            .then(response => {
                alert('Added to wishlist!');
                setIsWishlistUpdated(true);
            })
            .catch(error => {
                console.error('There was an error adding to the wishlist!', error);
            });
    };

    const visitProduct = () => {
        const userId = localStorage.getItem('user_id');
        axios.post(`http://localhost:5000/visit/${userId}`, { asin: product.asin })
            .then(response => {
                // Optionally, you could handle the response if needed
                // Redirect to the product link
                window.open(product.productURL, '_blank');
            })
            .catch(error => {
                console.error('There was an error updating the view count!', error);
            });
    };

    return (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50 ">
            <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg product-card">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute text-xl text-red-500 top-2 right-2"
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="mb-4 text-xl font-bold">{product.title}</h2>
                <img src={product.imgUrl} alt={product.title} className="object-cover h-full mx-auto mb-2 rounded-md" />
                <p className="text-lg font-bold">$ {product.price}</p>
                <div>
                    <p>Stars: {product.stars}</p>
                    <p>Reviews: {product.reviews}</p>
                  </div>
                <div className="flex justify-between mt-4">
                    <button onClick={addToWishlist} className="px-4 py-2 text-white transition duration-200 bg-blue-500 hover:bg-blue-600 button-card">
                        Add to Wishlist
                    </button>
                    <button onClick={visitProduct} className="px-4 py-2 text-white transition duration-200 bg-green-500 hover:bg-green-600 button-card">
                        Visit Product
                    </button>
                </div>
                {isWishlistUpdated && <p className="mt-2 text-green-500">Product added to wishlist!</p>}
            </div>
        </div>
    );
};

export default ProductPopup;
