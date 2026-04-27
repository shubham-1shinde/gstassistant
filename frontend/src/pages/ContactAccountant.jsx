import React from "react";

const ContactAccountant = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="flex flex-col w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Contact Accountant
        </h1>
        <p className="text-gray-500 mb-6">
          Reach out to your accountant for help with GST, filings, or compliance.
        </p>

          
          

          {/* Quick Actions */}
          <div className="w-1/2 mb-8 ml-48 border rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Quick Actions
            </h2>

            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Call Accountant
              </button>

              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                Send Email
              </button>
            </div>
          </div>

        {/* Contact Form */}
        <div className="border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Send Message
          </h2>

          <form className="space-y-4">
            
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              rows="4"
              placeholder="Write your message..."
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactAccountant;