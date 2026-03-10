import React from "react";
import SliderModule from "react-slick";
import axios from "axios";


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import { useEffect } from "react";

const Slider = SliderModule.default || SliderModule;

export default function FreeBook() {


const[book,setbook]=useState([])
useEffect(()=>{
  const getBook = async ()=>{
    try{
    const res = await axios.get("http://localhost:4000/book");

    console.log(res.data)
    setbook(res.data)
    }catch(error){
      console.log(error)
    }
  }; 

  getBook();
},[])





  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: false,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
   <div className="px-4 py-4 max-w-6xl mx-auto">
  <h2 className="text-2xl font-bold mb-4 text-center">Our Free Books</h2>
  <Slider {...settings}>
    {book
      .filter((item) => item.category === "Free") // filter only Free category
      .map((item) => (
        <div key={item.id} className="px-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden 
                          hover:shadow-2xl hover:scale-105 transition-transform transition-shadow duration-300">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-500 mt-1">Price: ${item.price}</p>
              <p className="text-sm text-gray-400 mt-1">Category: {item.category}</p>
            </div>
          </div>
        </div>
      ))}
  </Slider>
</div>

  );
}
