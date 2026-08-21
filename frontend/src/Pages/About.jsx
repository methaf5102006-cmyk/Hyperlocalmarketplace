import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white py-16 px-6">

      {/* HERO */}
      <div className="max-w-6xl mx-auto text-center">

        <h1 className="text-5xl font-black mb-4">
          About <span className="text-blue-500">SkillLink</span>
        </h1>

        <p className="text-gray-300 max-w-2xl mx-auto">
          We connect customers with trusted local professionals like electricians
          and plumbers — fast, reliable, and affordable services at your doorstep.
        </p>

      </div>

      {/* IMAGE SECTION */}
      <div className="max-w-6xl mx-auto mt-12">

        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
          className="w-full h-100 object-cover rounded-3xl shadow-2xl"
        />

      </div>

      {/* CARDS */}
      <div className="max-w-6xl mx-auto mt-12 grid md:grid-cols-3 gap-6">

        <div className="bg-white/10 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-blue-400">Our Mission</h2>
          <p className="text-gray-300 mt-2">
            To provide quick and trusted home services with verified professionals.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-blue-400">Our Vision</h2>
          <p className="text-gray-300 mt-2">
            To become the #1 local service marketplace in your area.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-blue-400">Why Us?</h2>
          <p className="text-gray-300 mt-2">
            Verified experts, fast booking, and affordable pricing.
          </p>
        </div>

      </div>

    </div>
  );
};

export default About;