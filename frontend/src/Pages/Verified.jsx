const Verified = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold text-green-600">
          Email Verified ✅
        </h1>

        <p className="mt-3 text-gray-600">
          Now you can login to your account
        </p>

        <a
          href="/login"
          className="mt-5 inline-block bg-indigo-600 text-white px-6 py-2 rounded"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default Verified;