import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { useState } from "react";
import { useEffect } from "react";

export default function Courses() {

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


  const navigate = useNavigate();

  return (
    <div className="pt-24 px-6 max-w-6xl mx-auto">
      {/* Upper Heading */}
      <h1 className="text-4xl font-bold text-center mb-2">
        We're delight to have you <span className="text-blue-600">Here! :)</span>
      </h1>

      {/* Paragraph */}
      <p className="text-gray-600 text-lg my-6 mx-6 md:mx-24 text-justify">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. 
        Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh 
        elementum imperdiet. Duis sagittis ipsum. Praesent mauris.
      </p>
      <div className="text-center mt-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 hover:shadow-lg transition-colors duration-300"
        >
          Back
        </button>
      </div>

      {/* Grid of Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
        {book
          // Course category
          .map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden 
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
          ))}
      </div>

      {/* Back Button */}
    </div>
  );
}
