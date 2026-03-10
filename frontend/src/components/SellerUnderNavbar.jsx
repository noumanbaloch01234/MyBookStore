import React, { useEffect, useState } from "react";
import { useStore } from "../Context/AppContext.jsx";
import { orderAPI } from "../services/api";

export default function SellerUnderNavbar({ setActivePage, activePage }) {
    const { 
        getFilteredProducts, 
        toggleInStockFilter, 
        showInStockOnly, 
        updateProductStock, 
        products: allProducts, 
        orders: contextOrders
    } = useStore();

    const products = allProducts;
    const [orders, setOrders] = useState(contextOrders);
    const [loading, setLoading] = useState(false);

    // ✅ Jab Overview tab open ho, fresh orders fetch karo
    useEffect(() => {
        if (activePage === 'overview') {
            console.log('🔄 Overview tab opened - Fetching fresh orders...');
            fetchOrders();
        }
    }, [activePage]);

    // ✅ Context se orders update hone par bhi local state update karo
    useEffect(() => {
        console.log('📦 Context orders updated:', contextOrders.length);
        setOrders(contextOrders);
    }, [contextOrders]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            console.log('🔥 Fetching all orders from database...');
            const response = await orderAPI.getAllOrders();
            
            console.log('📦 API Response:', response.data);
            
            if (response.data.success) {
                console.log(`✅ Orders fetched: ${response.data.data.length}`);
                setOrders(response.data.data);
            } else {
                console.log('⚠️ No orders found');
                setOrders([]);
            }
        } catch (err) {
            console.error('❌ Error fetching orders:', err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Overview calculations from REAL DATABASE data
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Processing').length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const recentOrders = orders.slice(0, 5);

    // Log calculations
    useEffect(() => {
        if (activePage === 'overview') {
            console.log('📊 OVERVIEW STATS:', {
                totalProducts,
                totalOrders,
                pendingOrders,
                totalRevenue,
                recentOrdersCount: recentOrders.length
            });
        }
    }, [activePage, totalProducts, totalOrders, pendingOrders, totalRevenue]);

    const dashboardicon = (
        <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinejoin="round" d="M4 5h4v2H5v-2ZM16 19h-4v-2h4v2ZM4 13h4v6H5v-6ZM16 11h-4V5h4v6Z" />
        </svg>
    );

    const addProductIcon = (
        <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
    );

    const overviewicon = (
        <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" d="M7 20a3 3 0 0 1-3-3V5a1 1 0 0 1 1-1h4v12a3 3 0 0 1-3 3zM7 16h12v-4H15L11 16z" />
        </svg>
    );

    const chaticon = (
        <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14v9H13l-2.88 2.592V17H5V6z" />
        </svg>
    );

    const sidebarLinks = [
        { name: "Dashboard", key: "dashboard", icon: dashboardicon },
        { name: "Add Product", key: "addproduct", icon: addProductIcon },
        { name: "Overview", key: "overview", icon: overviewicon },
        { name: "Chat", key: "chat", icon: chaticon },
    ];

    const handleStockToggle = (product) => {
        const productId = product._id || product.id;
        updateProductStock(productId, !product.inStock);
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="md:w-64 w-16 border-r border-gray-300 pt-4 flex flex-col">
                {sidebarLinks.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            console.log('🖱️ Clicked:', item.name);
                            setActivePage(item.key);
                        }}
                        className={`flex items-center py-3 px-4 gap-3 text-left transition
              ${activePage === item.key
                                ? "bg-indigo-500/10 text-indigo-500 border-r-4 md:border-r-[6px] border-indigo-500"
                                : "hover:bg-gray-100 text-gray-700 border-r-4 border-transparent"
                            }`}
                    >
                        {item.icon}
                        <span className="md:block hidden">{item.name}</span>
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 py-10 flex flex-col justify-between">

                {/* Dashboard Section */}
                {activePage === "dashboard" && (
                    <div className="w-full md:p-10 p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">All Products</h2>
                            <label className="inline-flex items-center cursor-pointer gap-2">
                                <span>Show In Stock Only</span>
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={showInStockOnly}
                                    onChange={toggleInStockFilter}
                                />
                                <div className="relative w-12 h-7 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200">
                                    <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                </div>
                            </label>
                        </div>

                        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                            <table className="md:table-auto table-fixed w-full overflow-hidden">
                                <thead className="text-gray-900 text-sm text-left">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold truncate">Product</th>
                                        <th className="px-4 py-3 font-semibold truncate">Category</th>
                                        <th className="px-4 py-3 font-semibold truncate hidden md:table-cell">Selling Price</th>
                                        <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-500">
                                    {products.map((product, index) => (
                                        <tr key={product._id || product.id || index} className="border-t border-gray-500/20">
                                            <td className="md:px-4 pl-2 md:pl-4 py-3">
                                                <div className="flex items-center space-x-3 truncate">
                                                    <div className="border border-gray-300 rounded overflow-hidden">
                                                        <img
                                                            src={product.image?.[0] || product.image}
                                                            alt="Product"
                                                            className="w-16 h-16 object-cover"
                                                        />
                                                    </div>
                                                    <span className="truncate max-sm:hidden">{product.name || product.text}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{product.category}</td>
                                            <td className="px-4 py-3 hidden md:table-cell">Rs {product.price || product.offerPrice}</td>
                                            <td className="px-4 py-3">
                                                <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={product.inStock}
                                                        onChange={() => handleStockToggle(product)}
                                                    />
                                                    <div className="relative w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200">
                                                        <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                                    </div>
                                                </label>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Add Product Section */}
                {activePage === "addproduct" && (
                    <div className="w-full flex flex-col justify-between bg-white">
                        <form className="md:pt-4 md:pb-10 p-4 space-y-5 max-w-lg">

                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>

                            <div>
                                <p className="text-base font-medium">Product Image</p>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    {Array(4).fill('').map((_, index) => (
                                        <label key={index} htmlFor={`image${index}`}>
                                            <input accept="image/*" type="file" id={`image${index}`} hidden />
                                            <img
                                                className="max-w-24 cursor-pointer"
                                                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"
                                                alt="uploadArea"
                                                width={100}
                                                height={100}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 max-w-md">
                                <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                                <input
                                    id="product-name"
                                    type="text"
                                    placeholder="Type here"
                                    className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1 max-w-md">
                                <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                                <textarea
                                    id="product-description"
                                    rows={4}
                                    className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                                    placeholder="Type here"
                                ></textarea>
                            </div>

                            <div className="w-full flex flex-col gap-1">
                                <label className="text-base font-medium" htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                                >
                                    <option value="">Select Category</option>
                                    {[
                                        { text: "Organic veggies", path: "Vegetables" },
                                        { text: "Fresh Fruits", path: "Fruits" },
                                        { text: "Cold Drinks", path: "Drinks" },
                                        { text: "Instant Food", path: "Instant" },
                                        { text: "Dairy Products", path: "Dairy" },
                                        { text: "Bakery & Breads", path: "Bakery" },
                                        { text: "Grains & Cereals", path: "Grains" }
                                    ].map((item, index) => (
                                        <option key={index} value={item.path}>{item.text}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-5 flex-wrap">
                                <div className="flex-1 flex flex-col gap-1 w-32">
                                    <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                                    <input
                                        id="product-price"
                                        type="number"
                                        placeholder="0"
                                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                                        required
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-1 w-32">
                                    <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                                    <input
                                        id="offer-price"
                                        type="number"
                                        placeholder="0"
                                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="px-8 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded transition"
                            >
                                ADD PRODUCT
                            </button>
                        </form>
                    </div>
                )}

                {/* ✅ Overview Section — REFRESHES ORDERS ON EVERY LOAD */}
                {activePage === "overview" && (
                    <div className="w-full md:p-10 p-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                            <button
                                onClick={fetchOrders}
                                disabled={loading}
                                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-sm transition disabled:opacity-50"
                            >
                                {loading ? 'Refreshing...' : '🔄 Refresh Data'}
                            </button>
                        </div>

                        {/* ✅ Stats Cards - REAL DATABASE DATA */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <p className="text-gray-500 text-sm mb-2">Total Products</p>
                                <p className="text-3xl font-bold text-indigo-500">{totalProducts}</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <p className="text-gray-500 text-sm mb-2">Total Orders</p>
                                <p className="text-3xl font-bold text-green-500">{totalOrders}</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <p className="text-gray-500 text-sm mb-2">Pending Orders</p>
                                <p className="text-3xl font-bold text-orange-500">{pendingOrders}</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <p className="text-gray-500 text-sm mb-2">Total Revenue</p>
                                <p className="text-3xl font-bold text-purple-500">Rs {totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* ✅ Recent Orders Table */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 text-gray-500 font-medium">Order ID</th>
                                        <th className="text-left py-2 text-gray-500 font-medium">Status</th>
                                        <th className="text-left py-2 text-gray-500 font-medium">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="3" className="text-center py-8 text-gray-400">
                                                Loading orders...
                                            </td>
                                        </tr>
                                    ) : recentOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="text-center py-8 text-gray-400">
                                                No orders yet
                                            </td>
                                        </tr>
                                    ) : (
                                        recentOrders.map((order, index) => (
                                            <tr key={order._id || index} className="border-b border-gray-100">
                                                <td className="py-3 font-medium text-gray-700">
                                                    #{order._id?.slice(-6).toUpperCase() || `ORD${1000 + index}`}
                                                </td>
                                                <td className="py-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        order.status === 'Delivered'
                                                            ? 'bg-green-100 text-green-600'
                                                            : order.status === 'Processing'
                                                            ? 'bg-orange-100 text-orange-600'
                                                            : order.status === 'Shipped'
                                                            ? 'bg-blue-100 text-blue-600'
                                                            : 'bg-red-100 text-red-600'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-gray-700 font-medium">
                                                    Rs {order.amount?.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}