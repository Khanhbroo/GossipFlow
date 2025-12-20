import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Link } from "react-router";
import { useForm } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const signInSchema = z.object({
  username: z.string().min(3, "Username must have at least 3 characters"),
  password: z.string().min(6, "Password must have at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export const SignInForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = (data: SignInFormValues) => {
    // Register backend to signin
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <Link to="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.png" alt="Logo" />
                </Link>

                <h1 className="text-2xl font-bold">
                  Welcome back to GossipFlow
                </h1>
                <p className="text-muted-foreground text-balance">
                  Sign in your GossipFlow account!
                </p>
              </div>

              {/* Username */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="block text-sm">
                  Username
                </Label>
                <Input
                  type="text"
                  id="username"
                  autoComplete="username"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-destructive text-sm">
                    {errors.username?.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="password" className="block text-sm">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password?.message}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full hover:cursor-pointer"
                disabled={isSubmitting}
              >
                Sign in
              </Button>

              <div className="text-center text-sm">
                Do not have an account?{" "}
                <Link to="/signup" className="underline underline-offset-4">
                  Sign Up
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/signInPlaceholder.png"
              alt="Image"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:hover:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};
