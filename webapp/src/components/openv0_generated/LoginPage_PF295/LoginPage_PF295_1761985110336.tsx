import { Button } from '@nextui-org/react';
import { Card } from '@nextui-org/react';
import { CardBody } from '@nextui-org/react';
import { CardFooter } from '@nextui-org/react';
import { CardHeader } from '@nextui-org/react';
import { Checkbox } from '@nextui-org/react';
import { Divider } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import { Link } from '@nextui-org/react';
import { Spacer } from '@nextui-org/react';
import { Spinner } from '@nextui-org/react';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { Google } from 'lucide-react';
import { User } from 'lucide-react';
import React from 'react';
// Added Google icon

"use client";

const LoginPage_PF295: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false); // State for password visibility

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate an API call for login
    setTimeout(() => {
      console.log("Login Attempt:", { email, password, rememberMe });
      // In a real app, you would dispatch an action or make an API call here
      alert("Login logic would be handled here!");
      setIsLoading(false);
    }, 1500); // Simulate network delay
  };

  const handleGoogleLogin = () => {
    alert("Initiating Google login...");
    // Implement Google login logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black p-4 sm:p-6">
      <Card className="w-full max-w-md bg-white dark:bg-black shadow-2xl rounded-2xl p-6 md:p-8">
        <CardHeader className="flex flex-col gap-2 items-center text-center pb-6">
          {/* A placeholder for a logo or brand image */}
          {/* <Image
            src="/images/your-logo.png" // Replace with your logo path
            alt="Company Logo"
            width={80}
            height={80}
            className="mb-4"
          /> */}
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Welcome Back!</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Login to your account</p>
        </CardHeader>

        <CardBody className="px-0 py-0">
          <Input
            autoFocus
            endContent={<User className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
            label="Email or Username"
            placeholder="Enter your email or username"
            variant="bordered"
            value={email}
            onValueChange={setEmail}
            color="primary"
            size="lg"
            className="mb-6"
            fullWidth
          />
          <Input
            endContent={
              <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <Eye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            label="Password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            value={password}
            onValueChange={setPassword}
            color="primary"
            size="lg"
            fullWidth
          />
          <Spacer y={6} /> {/* Increased spacing for better visual separation */}
          <div className="flex justify-between items-center mb-6">
            <Checkbox
              isSelected={rememberMe}
              onValueChange={setRememberMe}
              color="primary"
              size="md"
              radius="sm"
            >
              Remember me
            </Checkbox>
            <Link
              color="primary"
              href="#"
              size="sm"
              onClick={() => alert("Forgot password link clicked!")}
              className="font-medium"
            >
              Forgot password?
            </Link>
          </div>
        </CardBody>

        <CardFooter className="flex flex-col gap-4 px-0 py-0">
          {/* Main Login Button */}
          <Button
            color="primary"
            variant="shadow"
            fullWidth
            onClick={handleLogin}
            isLoading={isLoading}
            spinner={<Spinner color="white" size="sm" />}
            className="font-bold text-lg py-3 h-auto"
            size="lg"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          {/* "OR" Divider */}
          <div className="flex items-center w-full my-4">
            <Divider className="flex-grow bg-gray-200 dark:bg-gray-700" />
            <span className="px-4 text-small text-default-400 dark:text-gray-500">OR</span>
            <Divider className="flex-grow bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Login with Google Button */}
          <Button
            color="default" // Use default color for social login buttons
            variant="bordered" // Bordered variant offers a clean look
            fullWidth
            size="lg"
            className="font-medium text-lg py-3 h-auto"
            startContent={<Google className="text-xl" />} // Google icon from lucide-react
            onClick={handleGoogleLogin}
          >
            Login with Google
          </Button>

          <Spacer y={4} />

          {/* Sign Up Link */}
          <div className="flex justify-center text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?
            <Link
              color="primary"
              href="#"
              onClick={() => alert("Sign up link clicked!")}
              className="ml-1 font-bold"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage_PF295;