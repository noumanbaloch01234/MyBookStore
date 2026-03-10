import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../Context/AppContext.jsx';
import profile_icon from '../assets/profile_icon.png';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    user,
    setUser,
    setShowLogin,
    getCartCount,
    getFilteredProducts,
    globalSearchQuery,
    setGlobalSearchQuery,
    sellerLogin  // ✅ ADD THIS
  } = useStore();

  const products = getFilteredProducts();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [showQuickResults, setShowQuickResults] = useState(false);

  // Seller Login
  const [showSellerLogin, setShowSellerLogin] = useState(false);
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerPassword, setSellerPassword] = useState("");
  const [sellerError, setSellerError] = useState("");

  // ✅ UPDATE SELLER LOGIN HANDLER
  const handleSellerLogin = () => {
    const success = sellerLogin(sellerEmail, sellerPassword);
    
    if (success) {
      setShowSellerLogin(false);
      navigate("/seller");
      setSellerEmail("");
      setSellerPassword("");
      setSellerError("");
    } else {
      setSellerError("Invalid email or password");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowDropdown(false);
  };

  // Sticky navbar on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // Close quick results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowQuickResults(false);
      }
    };
    if (showQuickResults) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showQuickResults]);

  // Quick search results
  const getQuickResults = () => {
    if (!(globalSearchQuery || "").trim()) return [];
    const searchLower = globalSearchQuery.toLowerCase().trim();
    return products.filter(p => {
      const productName = (p.text || p.name || "").toLowerCase();
      const productCategory = (p.category || "").toLowerCase();
      return productName.includes(searchLower) || productCategory.includes(searchLower);
    });
  };
  const quickResults = getQuickResults();

  const handleSearchChange = (value) => {
    setGlobalSearchQuery(value);
    setShowQuickResults(value.trim().length > 0);
  };

  const handleQuickResultClick = (productId) => {
    navigate(`/product_detail_page/${productId}`);
    setShowQuickResults(false);
  };

  const clearSearch = () => {
    setGlobalSearchQuery("");
    setShowQuickResults(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className={`sticky top-0 z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 transition-all duration-300 border-b ${
          scrolled ? "bg-white shadow-md border-gray-300" : "bg-white border-gray-200"
        } rounded-b-lg`}
      >
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-500 hover:text-orange-600">
          Grocery Store
        </Link>

        {/* Seller Login Modal */}
        {showSellerLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-96 shadow-lg relative">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Seller Login</h2>

              <input
                type="email"
                placeholder="Email"
                value={sellerEmail}
                onChange={(e) => setSellerEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              <input
                type="password"
                placeholder="Password"
                value={sellerPassword}
                onChange={(e) => setSellerPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSellerLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              {sellerError && <p className="text-red-500 mb-2 text-sm">{sellerError}</p>}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowSellerLogin(false);
                    setSellerError("");
                    setSellerEmail("");
                    setSellerPassword("");
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSellerLogin}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-8">
          <Link to="/" className="hover:text-orange-500">Home</Link>
          <Link to="/allproducts" className="hover:text-orange-500">All Products</Link>

          {/* Search Bar */}
          <div ref={searchRef} className="relative hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full w-64">
            <input
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder="Search products"
              value={globalSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => globalSearchQuery && setShowQuickResults(true)}
            />
            {globalSearchQuery ? (
              <button onClick={clearSearch} className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}

            {/* Quick Results */}
            {showQuickResults && quickResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-2 max-h-96 overflow-y-auto z-50">
                <div className="p-2">
                  <p className="text-xs text-gray-500 px-2 py-1 mb-1">
                    Quick results (click to view details)
                  </p>
                  {quickResults.map(item => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition"
                      onClick={() => handleQuickResultClick(item._id)}
                    >
                      <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                        <img
                          src={item.images ? item.images[0] : item.image}
                          alt={item.text || item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.text || item.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">{item.category}</span>
                          <span className="text-xs font-bold text-orange-500">Rs {item.price}</span>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                  {products.filter(p => {
                    const searchLower = globalSearchQuery.toLowerCase().trim();
                    const productName = (p.text || p.name || '').toLowerCase();
                    const productCategory = (p.category || '').toLowerCase();
                    return productName.includes(searchLower) || productCategory.includes(searchLower);
                  }).length > 5 && (
                    <p className="text-xs text-orange-500 px-2 py-2 text-center">
                      See all results on products page
                    </p>
                  )}
                </div>
              </div>
            )}

            {showQuickResults && globalSearchQuery && quickResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-2 z-50">
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500">No products found</p>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="relative cursor-pointer" onClick={() => navigate('/add-to-cart-page')}>
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#FF6600" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-3 text-xs text-white bg-orange-500 rounded-full w-5 h-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </div>

          {/* Profile Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <img
                src={profile_icon}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onMouseEnter={() => setShowDropdown(true)}
              />
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                    onClick={() => setShowDropdown(false)}
                  >
                    My Orders
                  </Link>

                  <button
                    onClick={() => {
                      setShowSellerLogin(true);
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 transition text-left"
                  >
                    Seller Login
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 transition text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="cursor-pointer px-8 py-2 bg-blue-500 hover:bg-blue-600 transition text-white rounded-full"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        <button onClick={() => setOpen(!open)} aria-label="Menu" className="sm:hidden">
          <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="21" height="1.5" rx=".75" fill="#FF6600" />
            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#FF6600" />
            <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#FF6600" />
          </svg>
        </button>
      </nav>
    </>
  );
}