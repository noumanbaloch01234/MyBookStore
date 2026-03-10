import React from 'react';
import main_banner_bg from '../assets/main_banner_bg.png';
import AllCatagoryCarts from './AllCatagoryCarts';
import BestSellerCarts from './BestSellerCarts';
import { Link } from "react-router-dom";


export default function HomeUnderNav() {
    return (
        <div>
            <div className="relative h-130 w-390 flex items-center pl-3 pr-2">

                {/* Background Image */}
                <img
                    src={main_banner_bg}
                    alt="Main Banner"
                    className="absolute top-0 pl-25 pr-10 h-130 object-cover"
                />

                {/* Text and Button Overlay */}
                <div className="relative max-w-md text-left">
                    <h1 className="text-black text-4xl font-bold leading-snug mb-6 pl-50">
                        Freshness You Can Trust, Savings You Will Love!
                    </h1>

                    <Link
                        to="/allproducts"
                        className="inline-block bg-purple-600 text-white font-bold py-3 px-6 rounded ml-50"
                    >
                        Shop Now
                    </Link>

                </div>
            </div>

            <h2 className="text-black font-bold mt-25 ml-35 text-2xl">
                Category
            </h2>

            <AllCatagoryCarts />

            <h2 className="text-black font-bold mt-5 ml-35 text-2xl">
                Best Seller
            </h2>
            <BestSellerCarts />

        </div>


    );
}
