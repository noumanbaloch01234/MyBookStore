import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import AppContextProvider from './Context/AppContext.jsx';
import MyOrders from './pages/MyOrders.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import AddToCart from './pages/AddToCart.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Login from './components/Login.jsx';
import Seller from './pages/Seller.jsx';
import ProtectedSellerRoute from './components/ProtectedSellerRoute';




function App() {
  return (
    <AppContextProvider>
      <Router> {/* BrowserRouter wrap sirf yahan */}
        <ScrollToTop/>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/allproducts" element={<AllProducts />} />
          <Route path="/orders" element={<MyOrders />} />
        <Route path="/product_detail_page/:id" element={<ProductDetailPage />} />
        <Route path="/add-to-cart-page" element={<AddToCart />} />
         {/* <Route path="/seller" element={<Seller />} /> */}
         <Route 
                    path="/seller" 
                    element={
                        <ProtectedSellerRoute>
                            <Seller />
                        </ProtectedSellerRoute>
                    } 
                />

        </Routes>
        <Login />
        <Footer/>
      </Router>
    </AppContextProvider>
  );
}

export default App;
