import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { clearError, loginUser } from "@/store/auth/authSlice";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react"
import { toast } from "sonner";

const LoginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .transform((val) => val.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

type LoginData = z.infer<typeof LoginSchema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ resolver: zodResolver(LoginSchema) });

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error: authError } = useSelector(
    (state: RootState) => state.auth
  );

  const onSubmit = async (data: LoginData) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate("/");
      toast.success("Login successful");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 max-w-sm mx-auto p-6"
    >
      {/* Auth error container - fixed height */}
      <div className="min-h-[26px] flex items-center">
        {authError && (
          <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded w-full">
            {authError}
          </p>
        )}
      </div>

      {/* Email field */}
      <div className="w-full">
        <Input
          type="email"
          id="email"
          placeholder="Email"
          className={errors.email ? "border-red-500" : ""}
          {...register("email")}
        />
        {/* Fixed height for error message */}
        <div className="min-h-[20px] mt-1">
          {errors.email && (
            <p className="text-red-500 text-xs text-left">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Password field */}
      <div className="w-full">
        <Input
          type="password"
          id="password"
          placeholder="Password"
          className={errors.password ? "border-red-500" : ""}
          {...register("password")}
        />
        {/* Fixed height for error message */}
        <div className="min-h-[20px] mt-1">
          {errors.password && (
            <p className="text-red-500 text-xs text-left">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="bg-green-dark hover:bg-green-dark hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? <Spinner /> : "Sign In"}
      </Button>

      <div className="flex justify-center gap-2.5 items-center">
        <p className="text-sm text-gray-400 italic">
          Don't have an account yet?
        </p>
        <Link to={"/auth/sign-up"} className="text-green-dark hover:opacity-80">
          Sign Up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
