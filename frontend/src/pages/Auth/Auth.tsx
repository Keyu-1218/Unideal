import { Link } from "react-router-dom";

const Auth = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to{" "}
        <span className="text-green-dark font-logo text-[30px] font-bold leading-normal">
          uni
        </span>
        <span className="text-green-light font-logo text-[30px] font-bold leading-normal">
          deal
        </span>
      </h2>
      <p className="text-gray-600 mb-8">
        Please login or create an account and start exploring the deals!
      </p>
      <div className="flex justify-center flex-col gap-4">
        <Link
          to="/auth/sign-in"
          className="px-6 py-3 bg-green-dark text-white font-semibold rounded-lg hover:opacity-90 transition-colors"
        >
          Sign In
        </Link>
        <Link
          to="/auth/sign-up"
          className="px-6 py-3 border border-green-dark text-green-dark font-semibold rounded-lg hover:bg-green-100 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Auth;
