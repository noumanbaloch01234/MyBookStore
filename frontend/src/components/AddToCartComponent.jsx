import React, { useState } from 'react';
import { useStore } from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function AddToCartComponent() {
    const navigate = useNavigate();
    const { 
        cartItems, 
        cartData,
        removeFromCart, 
        updateQuantity, 
        getTotalPrice,
        clearCart,
        placeOrder 
    } = useStore();
    
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('No address found');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [orderPlaced, setOrderPlaced] = useState(false);

    const subtotal = getTotalPrice();
    const shippingFee = 0;
    const taxRate = 0.02;
    const tax = subtotal * taxRate;
    const totalAmount = subtotal + shippingFee + tax;

    const handleQuantityChange = (itemId, newQuantity) => {
        console.log('Updating quantity:', itemId, newQuantity);
        updateQuantity(itemId, parseInt(newQuantity));
    };

    const handleRemoveItem = (itemId) => {
        console.log('Removing item:', itemId);
        removeFromCart(itemId);
    };

    const handlePlaceOrder = () => {
        const orderDetails = {
            address: {
                firstName: "John",
                lastName: "Doe",
                street: "123 Main St",
                city: "Lahore",
                state: "Punjab",
                zipcode: "54000",
                country: "Pakistan"
            },
            paymentType: paymentMethod
        };

        placeOrder(orderDetails);
        setOrderPlaced(true);
        
        setTimeout(() => {
            navigate('/orders');
        }, 2000);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/150';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:5000/images/${imagePath}`;
    };

    // Debug: Cart data dekho
    console.log('🛒 Cart Data:', cartData);
    console.log('📦 Cart Items:', cartItems);

    if (orderPlaced) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-6 min-h-[60vh]">
                <svg 
                    className="w-32 h-32 text-green-500 mb-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                </svg>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-500 mb-6">Redirecting to orders page...</p>
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-6 min-h-[60vh]">
                <svg 
                    className="w-32 h-32 text-gray-300 mb-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                    />
                </svg>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-6">Add some products to get started!</p>
                <button
                    onClick={() => navigate('/allproducts')}
                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto gap-8">
            {/* Left Side - Cart Items */}
            <div className='flex-1 max-w-4xl'>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-medium">
                        Shopping Cart <span className="text-sm text-indigo-500">{cartData?.totalItems || 0} Items</span>
                    </h1>
                    <button 
                        onClick={clearCart}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                    >
                        Clear Cart
                    </button>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-[2fr_1fr_1fr_auto] text-gray-500 text-base font-medium pb-3 border-b">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Price</p>
                    <p className="text-center">Quantity</p>
                    <p className="text-center">Subtotal</p>
                </div>

                {/* Cart Items List */}
                <div className="space-y-4 mt-4">
                    {cartItems.map((item, index) => {
                        const imageUrl = item.image && item.image[0] 
                            ? getImageUrl(item.image[0]) 
                            : 'https://via.placeholder.com/150';

                        const itemId = item._id;
                        const itemSubtotal = item.price * item.quantity;

                        console.log(`Item ${index + 1}:`, {
                            name: item.name,
                            id: itemId,
                            price: item.price,
                            quantity: item.quantity,
                            subtotal: itemSubtotal
                        });

                        return (
                            <div key={itemId} className="grid grid-cols-[2fr_1fr_1fr_auto] items-center text-sm md:text-base py-4 border-b border-gray-200">
                                {/* Product Details */}
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 flex items-center justify-center border border-gray-300 rounded overflow-hidden flex-shrink-0">
                                        <img 
                                            className="w-full h-full object-cover" 
                                            src={imageUrl}
                                            alt={item.name} 
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.category}</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <p className="text-center font-medium text-gray-800">
                                    Rs {item.price.toFixed(2)}
                                </p>

                                {/* Quantity */}
                                <div className="flex justify-center">
                                    <select 
                                        className='outline-none border border-gray-300 rounded px-3 py-2 w-20'
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(itemId, e.target.value)}
                                    >
                                        {Array(10).fill('').map((_, index) => (
                                            <option key={index} value={index + 1}>{index + 1}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subtotal & Remove */}
                                <div className="flex items-center gap-4 justify-end">
                                    <p className="font-medium text-gray-800 min-w-[100px] text-right">
                                        Rs {itemSubtotal.toFixed(2)}
                                    </p>
                                    <button 
                                        className="hover:scale-110 transition p-2"
                                        onClick={() => handleRemoveItem(itemId)}
                                        title="Remove item"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0" stroke="#FF532E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button 
                    onClick={() => navigate('/allproducts')}
                    className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium hover:text-indigo-600"
                >
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1" stroke="#615fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Continue Shopping
                </button>
            </div>

            {/* Right Side - Order Summary */}
            <div className="max-w-md w-full bg-gray-100/40 p-6 max-md:mt-8 border border-gray-300/70 h-fit rounded-lg">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                {/* Cart Items Summary */}
                <div className="mb-6">
                    <p className="text-sm font-medium uppercase mb-3">Items in Cart</p>
                    <div className="space-y-2">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex justify-between text-sm text-gray-600">
                                <span>{item.name} × {item.quantity}</span>
                                <span className="font-medium">Rs {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="border-gray-300 my-4" />

                {/* Delivery Address */}
                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{selectedAddress}</p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-indigo-500 hover:underline cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10 shadow-lg rounded">
                                <p 
                                    onClick={() => {
                                        setSelectedAddress('123 Main St, Lahore, Pakistan');
                                        setShowAddress(false);
                                    }} 
                                    className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    123 Main St, Lahore, Pakistan
                                </p>
                                <p 
                                    onClick={() => {
                                        setSelectedAddress('456 Park Ave, Karachi, Pakistan');
                                        setShowAddress(false);
                                    }} 
                                    className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    456 Park Ave, Karachi, Pakistan
                                </p>
                                <p onClick={() => setShowAddress(false)} className="text-indigo-500 text-center cursor-pointer p-2 hover:bg-indigo-500/10">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
                    <select 
                        className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none rounded"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                {/* Price Breakdown */}
                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Total Items</span>
                        <span className="font-medium">{cartData?.totalItems || 0}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Subtotal</span>
                        <span>Rs {subtotal.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span>
                        <span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span>
                        <span>Rs {tax.toFixed(2)}</span>
                    </p>
                    <hr className="border-gray-300 my-2" />
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span>
                        <span className="text-indigo-600">Rs {totalAmount.toFixed(2)}</span>
                    </p>
                </div>

                <button 
                    onClick={handlePlaceOrder}
                    className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition rounded-lg"
                >
                    Place Order
                </button>
            </div>
        </div>
    );
}