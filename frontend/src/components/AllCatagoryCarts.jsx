import React, { useState } from 'react';
import { useStore } from "../Context/AppContext.jsx";
import { useNavigate } from 'react-router-dom';

export default function AllCatagoryCarts() {
  const navigate = useNavigate();
  const { getFilteredProducts, addToCart, globalSearchQuery, categories } = useStore();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quantities, setQuantities] = useState({});

  const products = getFilteredProducts();

  const handleCategoryClick = (categoryPath) => {
    setSelectedCategory(prev =>
      prev === categoryPath ? null : categoryPath
    );
  };

  const handleProductClick = (id) => {
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

  const handleAddToCart = (product) => {
    const quantity = quantities[product._id] || 1;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image?.[0] || product.image,
        description: product.category || 'Category Product'
      });
    }

    setQuantities(prev => ({
      ...prev,
      [product._id]: 0
    }));
  };

  // category.path se match karo (DB mein path = "Dairy", product.category = "Dairy")
  const categoryFilteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : [];

  const searchQuery = (globalSearchQuery ?? '').toString().trim();

  const filteredProducts = searchQuery
    ? categoryFilteredProducts.filter(product => {
        const productName = ((product?.name ?? product?.text ?? '')).toString().toLowerCase();
        return productName.includes(searchQuery.toLowerCase());
      })
    : categoryFilteredProducts;


  return (
    <div>

      <section className="flex mt-10 ml-20 mr-10 mb-10 flex-wrap items-center justify-center gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => handleCategoryClick(category.path)}
            className={`group w-56 rounded-xl p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
              selectedCategory === category.path
                ? 'bg-indigo-100 border-2 border-indigo-500'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <img
              className="rounded-lg h-36 object-cover group-hover:scale-105 transition-all duration-300"
              src={category.image}
              alt={category.name}
            />
            <p className="text-sm mt-2 font-semibold text-center">
              {category.name}
            </p>
          </div>
        ))}
      </section>

      {selectedCategory && (
        <div>

          <div className="ml-20 mr-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {categories.find(c => c.path === selectedCategory)?.name} Products
            </h2>
            {globalSearchQuery ? (
              <p className="text-gray-600 mt-2">
                Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "<span className="font-semibold text-indigo-600">{globalSearchQuery}</span>" in this category
              </p>
            ) : (
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 ml-20 mr-10">
              <svg
                className="w-24 h-24 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {globalSearchQuery ? 'No products found' : 'No products in this category'}
              </h3>
              <p className="text-gray-500">
                {globalSearchQuery
                  ? `No products match "${globalSearchQuery}" in this category`
                  : 'This category is currently empty'
                }
              </p>
            </div>
          ) : (
            <section className="flex ml-20 mr-10 mb-10 flex-wrap items-center justify-center gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="group w-56 bg-gray-100 hover:bg-gray-200 rounded-xl p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                >
                  <img
                    className="rounded-lg h-28 group-hover:scale-105 transition-all duration-300 object-cover"
                    src={product.image?.[0] || product.image}
                    alt={product.name}
                  />

                  <p className="text-sm mt-2 font-semibold">{product.name}</p>
                  <p className="text-lg">Rs {product.price}</p>

                  <div
                    className="flex items-center justify-between mt-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center border rounded">
                      <button
                        className="px-2 font-bold hover:bg-gray-200"
                        onClick={() => decreaseQty(product._id)}
                      >
                        -
                      </button>

                      <span className="px-3 text-sm font-semibold">
                        {quantities[product._id] || 0}
                      </span>

                      <button
                        className="px-2 font-bold hover:bg-gray-200"
                        onClick={() => increaseQty(product._id)}
                      >
                        +
                      </button>
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
          )}

        </div>
      )}

    </div>
  );
}