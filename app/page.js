"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, Video, Image as ImageIcon, Sparkles } from "lucide-react";
import { useUser, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user } = useUser();
  const router = useRouter();

  const handleDashboardClick = () => {
    if (user) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="flex items-center justify-between p-4 md:p-6">
        {/* Left side - Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Ai Short Vid Logo" width={40} height={40} className="w-8 h-8" />
          <span className="text-xl font-semibold">VizioAI</span>
        </Link>

        {/* Right side - User Actions */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <Button 
              variant="default" 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleDashboardClick}
            >
              Dashboard
            </Button>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 text-center flex-grow">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Build Your Short Video <span className="text-purple-600">With AI</span>
          </h1>
          <p className="text-xl text-gray-600">Effortlessly Build AI-Generated Short Videos in Minutes</p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <SignedIn>
              <Link href="/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8">
                  Get Started →
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8">
                  Get Started →
                </Button>
              </SignInButton>
            </SignedOut>

            <Button variant="outline" className="text-lg px-8">
              <Play className="w-4 h-4 mr-2" />
              Watch video
            </Button>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-bold">How it Works?</h2>
          <p className="mt-2 text-gray-600">Create AI-powered short videos in just 3 simple steps</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
              <Video className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">1. Select Video Type</h3>
              <p className="text-gray-600 mt-2">Choose the type of video you want to generate.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
              <ImageIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">2. Select Image Style</h3>
              <p className="text-gray-600 mt-2">Pick an image style that fits your video theme.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">3. Generate Video</h3>
              <p className="text-gray-600 mt-2">Let AI create your short video in seconds.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 mt-12">
        <p className="text-gray-600">
          © {new Date().getFullYear()} Made with ❤️ in India by <span className="font-semibold">Vruxak Patel</span>
        </p>
      </footer>
    </div>
  );
}
