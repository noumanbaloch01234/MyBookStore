import React from 'react'
import { useStore } from '../Context/AppContext'

export default function MyOrdersUnderNavbar() {
  const { orders } = useStore();
  const boxIcon = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg"

  // If no orders
  if (orders.length === 0) {
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
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h2>
        <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="md:p-10 p-4 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders ({orders.length})</h2>
      
      {orders.map((order, index) => (
        <div 
          key={order.id || index} 
          className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800 bg-white hover:shadow-lg transition"
        >
          {/* Products Section */}
          <div className="flex gap-5">
            <img className="w-12 h-12 object-cover opacity-60" src={boxIcon} alt="boxIcon" />
            <div className="flex flex-col gap-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-10 h-10 border border-gray-300 rounded overflow-hidden">
                    <img 
                      src={item.image} alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {item.name}
                      {item.quantity > 1 && (
                        <span className="text-indigo-500 ml-1">x {item.quantity}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">Rs {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address Section */}
          <div className="text-sm">
            <p className='font-medium mb-1'>
              {order.address.firstName} {order.address.lastName}
            </p>
            <p className="text-gray-600">
              {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zipcode}, {order.address.country}
            </p>
          </div>

          {/* Amount Section */}
          <p className="font-medium text-lg my-auto text-black">
            Rs {order.amount.toFixed(2)}
          </p>

          {/* Order Details Section */}
          <div className="flex flex-col text-sm space-y-1">
            <p className="flex items-center gap-2">
              <span className="font-medium">Method:</span> 
              <span className={`px-2 py-0.5 rounded text-xs ${
                order.paymentType === 'Online' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-orange-100 text-orange-600'
              }`}>
                {order.paymentType}
              </span>
            </p>
            <p>
              <span className="font-medium">Date:</span> {order.orderDate}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Payment:</span> 
              <span className={`px-2 py-0.5 rounded text-xs ${
                order.isPaid 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                {order.isPaid ? "Paid" : "Pending"}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Status:</span> 
              <span className="px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-600">
                {order.status}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}