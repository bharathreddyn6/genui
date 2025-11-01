"use client";

import { Button } from '@nextui-org/react';
import { Card } from '@nextui-org/react';
import { CardBody } from '@nextui-org/react';
import { CardFooter } from '@nextui-org/react';
import { CardHeader } from '@nextui-org/react';
import { Checkbox } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import { Link } from '@nextui-org/react';
import { Spacer } from '@nextui-org/react';
import { Spinner } from '@nextui-org/react';
import { Lock } from 'lucide-react';
import { User } from 'lucide-react';
import React from 'react';

const LoginPage_PF295: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <CardHeader className="flex flex-col gap-2 items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome Back!</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Login to your account</p>
        </CardHeader>
        <CardBody className="p-6">
          <Input
            autoFocus
            endContent={<User className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
            label="Email or Username"
            placeholder="Enter your email or username"
            variant="bordered"
            value={email}
            onValueChange={setEmail}
            className="mb-4"
            color="primary"
          />
          <Input
            endContent={<Lock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
            label="Password"
            placeholder="Enter your password"
            type="password"
            variant="bordered"
            value={password}
            onValueChange={setPassword}
            color="primary"
          />
          <Spacer y={4} />
          <div className="flex justify-between items-center mb-6">
            <Checkbox
              isSelected={rememberMe}
              onValueChange={setRememberMe}
              color="primary"
              size="sm"
            >
              Remember me
            </Checkbox>
            <Link
              color="primary"
              href="#"
              size="sm"
              onClick={() => alert("Forgot password link clicked!")}
            >
              Forgot password?
            </Link>
          </div>
        </CardBody>
        <CardFooter className="flex flex-col gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            color="primary"
            variant="shadow"
            fullWidth
            onClick={handleLogin}
            isLoading={isLoading}
            spinner={<Spinner color="white" size="sm" />}
            className="font-semibold"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <div className="flex justify-center text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?
            <Link
              color="primary"
              href="#"
              onClick={() => alert("Sign up link clicked!")}
              className="ml-1 font-semibold"
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