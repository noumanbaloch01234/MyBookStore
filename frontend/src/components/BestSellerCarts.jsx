import React, { useState } from 'react';
import { useStore } from "../Context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

export default function BestSellerCarts() {
  const { products = [], addToCart, globalSearchQuery = '' } = useStore();
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState({});

  const handleClick = (id) => navigate(`/product_detail_page/${id}`);

  const increaseQty = (id) => setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const decreaseQty = (id) => setQuantities(prev => ({ ...prev, [id]: Math.max((prev[id] || 0) - 1, 0) }));

  const handleAddToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,
        name: product.text || product.name,
        price: product.price,
        image: product.images ? product.images[0] : product.image,
        description: product.category || 'Best Seller Product'
      });
    }
    setQuantities(prev => ({ ...prev, [product._id]: 0 }));
  };

  // Local filtering for best sellers
  const searchQuery = globalSearchQuery.toString().trim().toLowerCase();
  const filteredProducts = searchQuery
    ? products.filter(p => ((p.text || p.name || '')).toLowerCase().includes(searchQuery))
    : products;

  const bestSellerProducts = filteredProducts.slice(0, 10); // first 10 products

  return (
    <div className="mt-10 mb-10">
      <div className="ml-20 mr-10 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-black">Best Sellers</h2>
        {globalSearchQuery && (
          <p className="text-gray-600 mt-2">
            Showing {bestSellerProducts.length} result{bestSellerProducts.length !== 1 ? 's' : ''} for "<span className="font-semibold text-indigo-600">{globalSearchQuery}</span>"
          </p>
        )}
      </div>

      {bestSellerProducts.length > 0 ? (
        <section className="flex ml-20 mr-10 flex-wrap items-center justify-center gap-6">
          {bestSellerProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => handleClick(product._id)}
              className="group w-56 bg-gray-100 hover:bg-gray-200 rounded-xl p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            >
              <img
                className="rounded-lg h-28 group-hover:scale-105 duration-300 transition-all object-cover"
                src={product.images ? product.images[0] : product.image}
                alt={product.text || product.name}
              />

              <p className="text-sm mt-2 font-semibold">{product.text || product.name}</p>
              <p className="text-lg">Rs {product.price}</p>

              <div className="flex items-center justify-between mt-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center border rounded">
                  <button className="px-2 font-bold hover:bg-gray-200" onClick={() => decreaseQty(product._id)}>-</button>
                  <span className="px-3 text-sm font-semibold">{quantities[product._id] || 0}</span>
                  <button className="px-2 font-bold hover:bg-gray-200" onClick={() => increaseQty(product._id)}>+</button>
                </div>

                <button 
                  onClick={() => handleAddToCart(product)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded transition"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 ml-20 mr-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No best sellers found</h3>
          <p className="text-gray-500">
            {globalSearchQuery ? `No best sellers match "${globalSearchQuery}"` : "No best sellers available"}
          </p>
        </div>
      )}
    </div>
  );
}
