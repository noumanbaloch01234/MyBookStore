import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from "../Context/AppContext.jsx";

export default function ProductDetailPageComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, loading } = useStore();
  const [product, setProduct] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(p => p._id.toString() === id);
      if (found) {
        setProduct(found);
        const imageArray = Array.isArray(found.image) ? found.image : [found.image];
        setThumbnail(imageArray[0] || null);
      } else {
        setProduct(null);
      }
    }
  }, [products, id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400?text=No+Image';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    return `http://localhost:5000/images/${imagePath}`;
  };

  const handleAddToCart = () => {
    if (!product.inStock) {
      alert('This product is currently out of stock');
      return;
    }

    const qty = quantity || 1;
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.offerPrice || product.price,
        image: product.image && product.image[0] ? product.image[0] : 'https://via.placeholder.com/150',
        description: product.category || 'Product',
      });
    }
    setQuantity(1);
    // alert(`${qty} ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product.inStock) {
      alert('This product is currently out of stock');
      return;
    }
    
    handleAddToCart();
    navigate('/add-to-cart-page');
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!products.length && !loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-300 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl font-semibold text-gray-700 mb-4">Product not found</p>
          <button
            onClick={() => navigate('/allproducts')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const imageArray = Array.isArray(product.image) ? product.image : [product.image];
  const currentThumbnail = thumbnail || imageArray[0];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="px-6 md:px-16 lg:px-24 py-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/allproducts')}
            className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Images Section */}
          <div className="flex gap-3 flex-col md:flex-row lg:w-1/2">
            {/* Thumbnails */}
            {imageArray.length > 1 && (
              <div className="flex flex-row md:flex-col gap-3">
                {imageArray.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setThumbnail(image)}
                    className={`border-2 rounded overflow-hidden cursor-pointer w-20 h-20 md:w-24 md:h-24 transition-all ${
                      currentThumbnail === image 
                        ? 'border-purple-500 ring-2 ring-purple-200' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img 
                      src={getImageUrl(image)} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="border border-gray-300 rounded-lg overflow-hidden flex-1 h-96 md:h-[500px] bg-white shadow-sm">
              <img 
                src={getImageUrl(currentThumbnail)} 
                alt={product.name} 
                className="w-full h-full object-contain p-6"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400?text=No+Image';
                }}
              />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex-1 lg:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>

            {/* Category */}
            <div className="mt-3 flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                {product.category}
              </span>
              {product.inStock ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  In Stock
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mt-6 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-baseline gap-3">
                {product.offerPrice && product.offerPrice < product.price ? (
                  <>
                    <p className="text-3xl font-bold text-black">Rs {product.offerPrice}</p>
                    <p className="text-lg text-gray-500 line-through">Rs {product.price}</p>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                      {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <p className="text-3xl font-bold text-black">Rs {product.price}</p>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-2">(inclusive of all taxes)</p>
            </div>

            {/* Product Description */}
            {product.description && product.description.length > 0 && (
              <div className="mt-6 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-3 text-gray-900">Product Details</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {product.description.map((desc, index) => (
                    <li key={index} className="text-sm">{desc}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity:</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(q => Math.max(q - 1, 1))}
                  disabled={!product.inStock}
                  className={`px-4 py-2 rounded-lg font-bold transition ${
                    product.inStock 
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  -
                </button>
                <span className="text-2xl font-bold min-w-[50px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  disabled={!product.inStock}
                  className={`px-4 py-2 rounded-lg font-bold transition ${
                    product.inStock 
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-4 font-semibold text-lg rounded-lg transition-all shadow-md ${
                  product.inStock
                    ? 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className={`flex-1 py-4 font-semibold text-lg rounded-lg transition-all shadow-md ${
                  product.inStock
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Out of Stock Message */}
            {!product.inStock && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-semibold">
                  This product is currently unavailable. Please check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}