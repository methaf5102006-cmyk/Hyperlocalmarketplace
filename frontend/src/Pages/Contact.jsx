import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-6">

      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT INFO */}
        <div>

          <h1 className="text-5xl font-black mb-4">
            Get In <span className="text-blue-500">Touch</span>
          </h1>

          <p className="text-gray-300 mb-8">
            We are here to help you 24/7. Contact us for any service booking,
            support or queries.
          </p>

          <div className="space-y-4">

            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
              📧 support@gmail.com
            </div>

            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
              📞 0300-1234567
            </div>

            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
              📍 Pakistan
            </div>

          </div>

        </div>

        {/* RIGHT FORM */}
        <div className="bg-white/10 border border-white/10 p-8 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold mb-6">
            Send Message
          </h2>

          <input
            type="text"
            placeholder="Your Name"
            className="w-full mb-4 p-3 rounded-xl bg-white/5 border border-white/10 outline-none"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full mb-4 p-3 rounded-xl bg-white/5 border border-white/10 outline-none"
          />

          <textarea
            placeholder="Your Message"
            rows="4"
            className="w-full mb-4 p-3 rounded-xl bg-white/5 border border-white/10 outline-none"
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl font-bold">
            Send Message
          </button>

        </div>

      </div>

    </div>
  );
};

export default Contact;