import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; // Import your existing CSS file

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/category/${categoryName}`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [categoryName]);

    return (
        <div className="bg-gray-200 min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-4">{categoryName}</h1>
            <div className="grid grid-cols-4 gap-4">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product.asin} className="product-card">
                            <img src={product.imgUrl} alt={product.title} className="product-img" />
                            <div className="product-info">
                                <div className="product-title">{product.title}</div>
                                <div className="product-price">${product.price}</div>
                                <p>Stars: {product.stars}</p>
                                <p>Reviews: {product.reviews}</p>
                                <a href={product.productURL} className="text-blue-500">View Product</a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No products available in this category.</div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
