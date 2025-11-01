"use client";

import { Button } from '@nextui-org/react';
import { Card } from '@nextui-org/react';
import { CardBody } from '@nextui-org/react';
import { Image } from '@nextui-org/react';
import { Spacer } from '@nextui-org/react';
import { ArrowRight } from 'lucide-react';
import { WavingHand } from 'lucide-react';

export default function WelcomeHero_L4JHP() {
  return (
    <div className="p-4 sm:p-8 flex justify-center items-center bg-gray-100 dark:bg-black">
      <Card className="max-w-5xl w-full p-4 sm:p-6 lg:p-8 border-none bg-white/80 dark:bg-black/50 backdrop-blur-md backdrop-saturate-150">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="flex flex-col justify-center text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  Welcome to Our Platform
                </h1>
                <WavingHand className="h-8 w-8 text-yellow-500" />
              </div>

              <Spacer y={4} />

              <p className="text-lg text-gray-600 dark:text-gray-300">
                We're thrilled to have you here. Get ready to explore a seamless experience designed to help you achieve your goals more efficiently.
              </p>

              <Spacer y={8} />

              <div className="flex justify-center md:justify-start">
                <Button 
                  color="primary" 
                  size="lg"
                  endContent={<ArrowRight className="h-5 w-5" />}
                  className="font-semibold"
                >
                  Get Started
                </Button>
              </div>
            </div>

            <div className="hidden md:flex justify-center items-center">
              <Image
                isZoomed
                isBlurred
                width={400}
                height={400}
                alt="A welcoming illustration"
                src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}