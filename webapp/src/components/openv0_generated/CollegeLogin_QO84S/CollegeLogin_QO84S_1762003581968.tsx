import { Button } from '@nextui-org/react';
import { Card } from '@nextui-org/react';
import { CardBody } from '@nextui-org/react';
import { CardHeader } from '@nextui-org/react';
import { Checkbox } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import { Spacer } from '@nextui-org/react';
import { Lock } from 'lucide-react';
import { Mail } from 'lucide-react';
import { User } from 'lucide-react';
import React from 'react';
"use client";
 // Import Checkbox
const CollegeLogin_QO84S: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black p-4">
      <Card className="w-full max-w-md p-6 shadow-lg dark:bg-zinc-900 border border-gray-200 dark:border-gray-800">
        <CardHeader className="flex flex-col gap-2 items-center text-center">
          <User className="h-10 w-10 text-primary-500 dark:text-primary-400" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">College Login</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please enter your credentials to log in.</p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            label="Name"
            placeholder="Enter your name"
            startContent={<User className="text-lg text-default-400 pointer-events-none flex-shrink-0" />}
            className="dark:text-white"
          />
          <Spacer y={2} />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            label="University Number"
            placeholder="Enter your university number"
            startContent={<User className="text-lg text-default-400 pointer-events-none flex-shrink-0" />}
            className="dark:text-white"
          />
          <Spacer y={2} />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            label="Email"
            placeholder="Enter your email"
            type="email"
            startContent={<Mail className="text-lg text-default-400 pointer-events-none flex-shrink-0" />}
            className="dark:text-white"
          />
          <Spacer y={2} />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            label="Password"
            placeholder="Enter your password"
            type="password"
            startContent={<Lock className="text-lg text-default-400 pointer-events-none flex-shrink-0" />}
            className="dark:text-white"
          />
          <Spacer y={4} /> {/* Adjusted spacer for the checkbox */}
          <Checkbox defaultSelected color="primary" size="md">
            Remember me
          </Checkbox>
          <Spacer y={4} /> {/* Adjusted spacer before the button */}
          <Button color="primary" size="lg" className="w-full font-semibold">
            Login
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default CollegeLogin_QO84S;