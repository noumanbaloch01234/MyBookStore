import React, { createContext, useContext, useEffect, useState } from 'react';
import { productAPI, categoryAPI, cartAPI, orderAPI, authAPI } from '../services/api';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    const [sellerAuth, setSellerAuth] = useState(() => {
        const saved = localStorage.getItem('sellerAuth');
        return saved ? JSON.parse(saved) : null;
    });

    const [seller, setSeller] = useState(true);
    const [showLogin, setShowLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [cartData, setCartData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [globalSearchQuery, setGlobalSearchQuery] = useState('');
    const [showInStockOnly, setShowInStockOnly] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get userId
    const getUserId = () => {
        if (user && user._id) {
            return user._id;
        }
        if (user && user.email) {
            return user.email;
        }
        let guestId = localStorage.getItem('guestUserId');
        if (!guestId) {
            guestId = `guest_${Date.now()}`;
            localStorage.setItem('guestUserId', guestId);
        }
        return guestId;
    };

    // Save user to localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Save token to localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    // Save seller auth to localStorage
    useEffect(() => {
        if (sellerAuth) {
            localStorage.setItem('sellerAuth', JSON.stringify(sellerAuth));
        } else {
            localStorage.removeItem('sellerAuth');
        }
    }, [sellerAuth]);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await productAPI.getAllProducts();
                if (response.data.success) {
                    setProducts(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryAPI.getAllCategories();
                if (response.data.success) {
                    setCategories(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch cart
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const userId = getUserId();
                const response = await cartAPI.getCart(userId);
                if (response.data.success) {
                    setCartData(response.data.data);
                    setCartItems(response.data.data.items || []);
                }
            } catch (err) {
                console.error('Error fetching cart:', err);
            }
        };
        fetchCart();
    }, [user]);

    // Fetch all orders
    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const response = await orderAPI.getAllOrders();
                if (response.data.success) {
                    setOrders(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
                setOrders([]);
            }
        };
        fetchAllOrders();
    }, []);

    const getFilteredProducts = () => {
        if (showInStockOnly) {
            return products.filter(product => product.inStock);
        }
        return products;
    };

    const toggleInStockFilter = () => {
        setShowInStockOnly(prev => !prev);
    };

    const updateProductStock = async (productId, inStockStatus) => {
        try {
            const response = await productAPI.updateProductStock(productId, inStockStatus);
            if (response.data.success) {
                setProducts(prev =>
                    prev.map(product =>
                        product._id === productId
                            ? { ...product, inStock: inStockStatus }
                            : product
                    )
                );
            }
        } catch (err) {
            console.error('Error updating stock:', err);
        }
    };

    const addToCart = async (productOrId, quantity = 1) => {
        try {
            const userId = getUserId();
            
            let productId;
            if (typeof productOrId === 'string') {
                productId = productOrId;
            } else {
                productId = productOrId._id || productOrId.id;
            }
            
            const response = await cartAPI.addToCart(userId, productId, quantity);
            
            if (response.data.success) {
                setCartData(response.data.data);
                setCartItems(response.data.data.items || []);
            }
        } catch (err) {
            console.error('Error adding to cart:', err.response?.data || err.message);
            alert('Failed to add to cart: ' + (err.response?.data?.message || err.message));
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const userId = getUserId();
            const response = await cartAPI.removeFromCart(userId, itemId);
            
            if (response.data.success) {
                setCartData(response.data.data);
                setCartItems(response.data.data.items || []);
            }
        } catch (err) {
            console.error('Error removing from cart:', err.response?.data || err.message);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        if (quantity <= 0) {
            await removeFromCart(itemId);
            return;
        }
        
        try {
            const userId = getUserId();
            const response = await cartAPI.updateCartItem(userId, itemId, quantity);
            
            if (response.data.success) {
                setCartData(response.data.data);
                setCartItems(response.data.data.items || []);
            }
        } catch (err) {
            console.error('Error updating quantity:', err.response?.data || err.message);
        }
    };

    const increaseQuantity = async (itemId) => {
        const item = cartItems.find(i => i._id === itemId);
        if (item) {
            await updateQuantity(itemId, item.quantity + 1);
        }
    };

    const decreaseQuantity = async (itemId) => {
        const item = cartItems.find(i => i._id === itemId);
        if (item) {
            await updateQuantity(itemId, Math.max(1, item.quantity - 1));
        }
    };

    const clearCart = async () => {
        try {
            const userId = getUserId();
            const response = await cartAPI.clearCart(userId);
            
            if (response.data.success) {
                setCartData(response.data.data);
                setCartItems([]);
            }
        } catch (err) {
            console.error('Error clearing cart:', err);
        }
    };

    const getCartCount = () => {
        return cartData ? cartData.totalItems : 0;
    };

    const getTotalPrice = () => {
        return cartData ? cartData.totalPrice : 0;
    };

    const isInCart = (productId) => {
        return cartItems.some(item => {
            const itemProductId = item.productId?._id || item.productId;
            return itemProductId === productId;
        });
    };

    // ✅ REGISTER USER - API CALL
    const registerUser = async (userData) => {
        try {
            console.log('📝 Registering user:', userData);
            
            const response = await authAPI.signup({
                name: userData.name,
                email: userData.email,
                password: userData.password
            });

            console.log('✅ Signup response:', response.data);

            if (response.data.success) {
                const { user: newUser, token: newToken } = response.data.data;
                setUser(newUser);
                setToken(newToken);
                console.log('✅ User registered successfully:', newUser);
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Registration error:', error.response?.data || error.message);
            return false;
        }
    };

    // ✅ LOGIN USER - API CALL
    const loginUser = async (email, password) => {
        try {
            console.log('🔐 Logging in user:', email);
            
            const response = await authAPI.login({
                email,
                password
            });

            console.log('✅ Login response:', response.data);

            if (response.data.success) {
                const { user: loggedInUser, token: newToken } = response.data.data;
                setUser(loggedInUser);
                setToken(newToken);
                console.log('✅ User logged in successfully:', loggedInUser);
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Login error:', error.response?.data || error.message);
            return false;
        }
    };

    // Seller login
    const sellerLogin = (email, password) => {
        if (email === "user@gmail.com" && password === "user1234") {
            const authData = { 
                email, 
                loggedIn: true, 
                timestamp: Date.now() 
            };
            setSellerAuth(authData);
            return true;
        }
        return false;
    };

    // Seller logout
    const sellerLogout = () => {
        setSellerAuth(null);
    };

    // Place order
    const placeOrder = async (orderDetails) => {
        try {
            const userId = getUserId();
    
            const response = await orderAPI.createOrder(
                userId,
                orderDetails.address,
                orderDetails.paymentType
            );
            
            if (response.data.success) {
                const newOrder = response.data.data;
                setOrders(prev => [newOrder, ...prev]);
                setCartData({ items: [], totalItems: 0, totalPrice: 0 });
                setCartItems([]);
                return newOrder;
            }
        } catch (err) {
            console.error('Error placing order:', err.response?.data || err.message);
            alert('Failed to place order: ' + (err.response?.data?.message || err.message));
            throw err;
        }
    };

    const value = {
        user,
        setUser,
        token,
        setToken,
        showLogin,
        setShowLogin,
        products,
        categories,
        cartItems,
        cartData,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getCartCount,
        getTotalPrice,
        isInCart,
        globalSearchQuery,
        setGlobalSearchQuery,
        showInStockOnly,
        toggleInStockFilter,
        getFilteredProducts,
        updateProductStock,
        orders,
        placeOrder,
        registerUser,
        loginUser,
        loading,
        error,
        sellerAuth,
        sellerLogin,
        sellerLogout,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useStore = () => useContext(AppContext);
export default AppContextProvider;