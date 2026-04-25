export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-white">
      
      {/* Top Logo */}
      <div className="mt-2">
        <img
          src="/logo.png"
          alt="Amazon"
          className="w-20 sm:w-28 mx-auto"
        />
      </div>

      {/* Card */}
      <div className="border border-gray-300 rounded-md p-4 sm:p-6 w-full max-w-[350px] mx-auto">
        <h1 className="text-2xl font-normal mb-4 text-black">
          Sign in or create account
        </h1>

        {/* Input */}
        <label className="text-sm font-medium text-black">
          Enter mobile number or email
        </label>
        <input
          type="text"
          className="w-full mt-1 p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Button */}
        <button className="w-full bg-yellow-400 hover:bg-yellow-500 mt-4 py-2 rounded-full text-black font-medium">
          Continue
        </button>

        {/* Terms */}
        <p className="text-xs mt-4 leading-relaxed text-black">
          By continuing, you agree to Amazon's{" "}
          <span className="text-blue-600 cursor-pointer">
            Conditions of Use
          </span>{" "}
          and{" "}
          <span className="text-blue-600 cursor-pointer">
            Privacy Notice
          </span>.
        </p>

        {/* Help */}
        <p className="text-sm text-blue-600 mt-3 cursor-pointer">
          Need help?
        </p>

        <hr className="my-5" />

        {/* Business */}
        <p className="text-sm font-medium text-black">Buying for work?</p>
        <p className="text-sm text-blue-600 cursor-pointer">
          Create a free business account
        </p>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-600 text-center mb-6 mt-6 flex flex-wrap justify-center gap-2 sm:gap-4">
        <span className="cursor-pointer hover:underline">
          Conditions of Use
        </span>
        <span className="cursor-pointer hover:underline">
          Privacy Notice
        </span>
        <span className="cursor-pointer hover:underline">
          Help
        </span>

        <p className="mt-2 w-full">
          © 1996-2026, Amazon.com, Inc. or its affiliates
        </p>
      </div>
    </div>
  );
}