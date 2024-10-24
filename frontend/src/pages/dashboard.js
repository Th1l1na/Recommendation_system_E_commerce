import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Ensure you have the correct version
import ProductPopup from "./ProductPopup"; // Import the ProductPopup component
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';


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
  { name: "Your Profile", href: "./ProfilePage" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const truncate = (text, length) => {
  if (text.length > length) {
    return text.slice(0, length) + "...";
  } else {
    return text;
  }
};

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products");
        setCategories(Object.keys(response.data));
        setProductsByCategory(response.data);
      } catch (error) {
        console.error("Error fetching categories and products:", error);
      }
    };

    const fetchRecommendations = async () => {
      const userId = localStorage.getItem("user_id");
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/recommendations?user_id=${userId}`
          );
          setRecommendations(response.data); // Update to set recommendations directly
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        }
      }
    };

    const fetchTrending = async () => {
      try {
        const response = await axios.get("http://localhost:5000/trending");
        setTrending(response.data.trending_items);
      } catch (error) {
        console.error("Error fetching trending products:", error);
      }
    };

    fetchCategoriesAndProducts();
    fetchRecommendations();
    fetchTrending();
  }, []);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    if (!searchText) {
      setIsSearchFocused(false);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchText(query);

    if (query) {
      try {
        const response = await axios.get(
          `http://localhost:5000/search?query=${encodeURIComponent(query)}`
        );
        setSearchResults(response.data.search_results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const searchQuery = encodeURIComponent(searchText);
      navigate(`/search?query=${searchQuery}`);

      const results = [/* Example results based on searchText */];
      setSearchResults(results);

        // Save search data in localStorage (or context if needed)
        localStorage.setItem('previousSearch', JSON.stringify({ searchText, results }));
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closePopup = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">
        
      <Navbar navigation={navigation} user={user} userNavigation={userNavigation} />

        <header className="bg-white shadow">
          <div className="grid items-center grid-cols-2 px-4 py-6 mx-auto max-w-8xl sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 ">
              Dashboard
            </h1>
            <div className="text-right">
            <div
              className="relative flex items-center w-full px-4 py-2 bg-gray-100 rounded-full"
              style={{ marginRight: 40 }}
            >
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-2 pr-10 bg-gray-100 outline-none"
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                value={searchText}
              />
              <button ><i className="ml-2 fas fa-search"></i></button>
              
              {isSearchFocused && (
                <div className="absolute left-0 w-full p-4 mt-2 overflow-y-auto bg-white shadow-lg top-full max-h-96">
                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4 rounded-lg">
                      {searchResults.map((product) => (
                        <div
                          key={product.asin}
                          className="h-40 p-4 border border-gray-300 cursor-pointer"
                          onClick={() => handleProductClick(product)}
                        >
                          <img
                            src={product.imgUrl}
                            alt={product.title}
                            className="object-cover w-50% h-16 mb-2 mx-auto"
                          />
                          <div className="text-sm font-bold">
                          {truncate(product.title, 40)}
                          </div>
                          <div className="text-sm">$ {product.price}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    searchText && <div>No results found</div>
                  )}
                </div>
              )}
            </div>
            </div>
          </div>
        </header>

        <main>
          <div className="px-4 py-6 mx-auto max-w-8xl sm:px-6 lg:px-8">
            <div className="flex">

              <main
                className="p-full4 w-"
                style={{ maxHeight: "480px", overflowY: "auto" }}
              >
                {/* Limit to 3 recommended products */}
                <Section
                  title="Recommended Products"
                  products={recommendations.slice(0, 4)}
                  onProductClick={handleProductClick}
                />
                {/* Limit to 3 trending products */}
                <Section
                  title="Trending"
                  products={trending.slice(0, 4)}
                  onProductClick={handleProductClick}
                />
              </main>
            </div>
          </div>
          {selectedProduct && (
            <ProductPopup product={selectedProduct} onClose={closePopup} />
          )}
        </main>
      </div>
    </>
  );
};

const Section = ({ title, products, onProductClick }) => {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-4xl font-bold ">
        <Link to={title === "Recommended Products" ? "/recommended" : "/trending"}>
          {title}
        </Link>
      </h2>
      <div className="grid grid-cols-4 gap-4 mx-20">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.asin}
              className="flex flex-col w-full product-card"
              onClick={() => onProductClick(product)}
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
              <div className="flex-shrink-0 h-30 product-info">
                <div className="product-title">
                  {truncate(product.title, 40)}
                </div>
                <div className="product-price">${product.price}</div>
              </div></div>
          ))
        ) : (
          <div>No products available</div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
