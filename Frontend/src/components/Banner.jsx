import React from 'react'

export default function Banner() {
  return (
<div className="flex flex-col overflow-x-hidden">

      {/* Banner Section */}
      <div className="flex flex-col md:flex-row w-full pt-20">

        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start justify-start px-6 pt-25 pb-6 ml-20 h-full gap-7">
          <h1 className="text-4xl md:text-6xl font-bold text-left">
            Hello! Welcome here to learn something new every day!!!
          </h1>

          <p className="text-left text-gray-700 text-base md:text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio aliquam eaque nobis, ut soluta vel, ipsam ab ducimus blanditiis nihil commodi nulla doloribus tempore dolorem consequatur fugit itaque repellat dolor iure?
          </p>

          {/* Email Input */}
          <div className="flex flex-col w-full">
            <input
              type="email"
              placeholder="mail@site.com"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:shadow-lg"
            />
            <div className="text-red-500 text-sm mt-1 hidden">
              Enter valid email address
            </div>
            <button className="btn p-3 mt-10 bg-blue-700 w-30 text-white rounded-2xl transition-colors duration-300 hover:bg-blue-800 hover:shadow-lg">
              Secondary
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex items-start justify-center h-full ">
          <img
            src="/book.jpg"
            alt="Book"
            className="max-h-[34rem] w-[95%] object-contain rounded-lg pt-7"
          />
        </div>

      </div>
{/* Full Width Section Below Banner */}
<div className="w-full px-6 pt-2 pb-4 ml-20">
  <div className="max-w-[1400px] flex flex-col md:flex-row items-start gap-6">

    {/* Left Side Content */}
    <div className="flex-1">
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">
        Our Services
      </h2>

      <p className="text-gray-600 text-sm leading-relaxed text-justify">
        We offer high quality solutions tailored to your needs.  
        Our focus is on performance, reliability, and user satisfaction. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, minus? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus cum eaque repellendus hic asperiores ipsa voluptate nam suscipit velit similique.
      </p>
    </div>


  </div>
</div>






    </div>
  )
}
