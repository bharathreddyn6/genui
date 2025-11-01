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
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { Google } from 'lucide-react';
import { Lock } from 'lucide-react';
import { User } from 'lucide-react';
import React from 'react';
"use client";

export default function LoginPage_K49VQ() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black">
      <Card className="w-full max-w-sm p-4 bg-white dark:bg-black shadow-lg rounded-lg">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Welcome Back!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Log in to your account
          </p>
        </CardHeader>
        <CardBody className="gap-6">
          <Input
            clearable
            fullWidth
            color="primary"
            size="lg"
            label="Username or Email"
            placeholder="Enter your username or email"
            startContent={<User className="text-xl text-default-400 pointer-events-none" />}
            variant="bordered"
            className="dark:text-white"
          />
          <Input
            clearable
            fullWidth
            color="primary"
            size="lg"
            label="Password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            startContent={<Lock className="text-xl text-default-400 pointer-events-none" />}
            endContent={
              <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <EyeOff className="text-xl text-default-400 pointer-events-none" />
                ) : (
                  <Eye className="text-xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            variant="bordered"
            className="dark:text-white"
          />
          <div className="flex justify-between items-center px-1">
            <Checkbox defaultSelected color="primary" size="sm" className="dark:text-gray-300">
              Remember me
            </Checkbox>
            <Link href="#" color="primary" size="sm">
              Forgot password?
            </Link>
          </div>
          <Button color="primary" size="lg" fullWidth className="font-semibold text-lg">
            Log In
          </Button>
          <Spacer y={2} /> {/* Added Spacer for visual separation */}
          <Button
            fullWidth
            size="lg"
            className="bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-100 border border-gray-300 dark:border-zinc-700 font-semibold text-lg"
            startContent={<Google className="text-xl text-gray-700 dark:text-gray-300" />}
          >
            Login with Google
          </Button>
        </CardBody>
        <Divider className="my-4 bg-gray-200 dark:bg-zinc-700" />
        <CardFooter className="flex justify-center flex-col items-center gap-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Don't have an account yet?
          </p>
          <Link href="#" color="secondary" size="md" className="font-semibold">
            Create an Account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}