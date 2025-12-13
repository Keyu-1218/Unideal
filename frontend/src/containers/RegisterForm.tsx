import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { clearError, registerUser } from "@/store/auth/authSlice";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { toast } from "sonner";

const RegistrationSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .transform((val) => val.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

type RegistrationData = z.infer<typeof RegistrationSchema>;

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(RegistrationSchema),
  });

  const { isLoading, error: authError } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: RegistrationData) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      navigate("/");
      toast.success("Registration successful");
    } catch (error) {
      console.error("Register Error:", error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <form
      className="flex flex-col gap-3 max-w-sm mx-auto p-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="min-h-[26px] flex items-center">
        {authError && (
          <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded w-full">
            {authError}
          </p>
        )}
      </div>

      {/* Email field */}
      <div className="w-full flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label> 
        <Input
          type="email"
          id="email"
          placeholder="name@example.com"
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
      <div className="w-full flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          placeholder="at least 8 characters"
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
        {isLoading ? <Spinner /> : "Sign Up"}
      </Button>

      <div className="flex justify-center gap-2.5 items-center">
        <p className="text-sm text-gray-400 italic">Already have an account?</p>
        <Link to={"/auth/sign-in"} className="text-green-dark hover:opacity-80">
          Sign In
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
