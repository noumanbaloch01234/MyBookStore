import React, { useState } from "react";
import { useStore } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";

export default function AllProductsUnderNavbar() {
  const { addToCart, getFilteredProducts, globalSearchQuery = '', loading, error } = useStore();
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState({});

  const products = getFilteredProducts();

  const searchQuery = globalSearchQuery.toString().trim().toLowerCase();
  const filteredProducts = searchQuery
    ? products.filter(product => ((product.name || '')).toString().toLowerCase().includes(searchQuery))
    : products;

  const handleClick = (id) => {
    navigate(`/product_detail_page/${id}`);
  };

  const increaseQty = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const decreaseQty = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0)
    }));
  };

  const handleAddToCart = async (product) => {
    const quantity = quantities[product._id] || 1;

    // FIXED: Ek hi baar add karo with proper quantity
    try {
      await addToCart({
        id: product._id,
        name: product.name,
        price: product.offerPrice || product.price,
        image: product.image && product.image[0] ? product.image[0] : 'https://via.placeholder.com/150',
        description: product.category || 'Product'
      }, quantity); // Pass quantity as second parameter

      setQuantities(prev => ({
        ...prev,
        [product._id]: 0
      }));

      // alert(`${quantity} ${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000/images/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="px-6 md:px-16 lg:px-24 py-10 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 md:px-16 lg:px-24 py-10 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 text-red-300 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Products</h3>
          <p className="text-gray-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 py-10 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">All Products</h1>
        {globalSearchQuery && (
          <p className="text-gray-600">
            Showing results for "<span className="font-semibold text-indigo-600">{globalSearchQuery}</span>" 
            - {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredProducts.map((item) => (
            <div
              key={item._id}
              onClick={() => handleClick(item._id)}
              className="group w-full bg-white rounded-xl p-3 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-gray-200"
            >
              <div className="h-36 bg-gray-100 overflow-hidden rounded-lg">
                <img
                  src={getImageUrl(item.image && item.image[0])}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                  }}
                />
              </div>

              <div className="mt-3 text-center" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-sm font-semibold text-gray-800 truncate" title={item.name}>
                  {item.name}
                </h2>
                <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                
                <div className="flex items-center justify-center gap-2 mt-2">
                  <p className="text-sm font-bold text-black">Rs {item.offerPrice || item.price}</p>
                  {item.offerPrice && item.offerPrice < item.price && (
                    <p className="text-xs text-gray-400 line-through">Rs {item.price}</p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 gap-2">
                  <div className="flex items-center border border-gray-300 rounded bg-white">
                    <button 
                      className="px-2 py-1 font-bold hover:bg-gray-100 transition text-gray-700" 
                      onClick={() => decreaseQty(item._id)}
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-semibold min-w-[30px] text-center">
                      {quantities[item._id] || 0}
                    </span>
                    <button 
                      className="px-2 py-1 font-bold hover:bg-gray-100 transition text-gray-700" 
                      onClick={() => increaseQty(item._id)}
                    >
                      +
                    </button>
                  </div>

                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-2 rounded transition font-semibold"
                  >
                    Add
                  </button>
                </div>

                {!item.inStock && (
                  <div className="mt-2">
                    <span className="text-xs text-red-500 font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">
            {globalSearchQuery ? `No products match "${globalSearchQuery}"` : "No products available"}
          </p>
          {globalSearchQuery && (
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Back to Home
            </button>
          )}
        </div>
      )}
    </div>
  );
}