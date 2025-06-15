import { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";
import Slideshow from "@/components/Slideshow";
import slide1 from "../assets/slide-1.png";
import slide2 from "../assets/slide-2.png";
import slide3 from "../assets/slide-3.png";
import slide4 from "../assets/slide-4.png";
import slide5 from "../assets/slide-5.png";
import logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";

const slides = [
  {
    image: slide1,
    quote: "The key is not in spending time, but in investing it.",
  },
  {
    image: slide2,
    quote: "Nothing makes a person more productive than the last minute.",
  },
  {
    image: slide3,
    quote: "You may delay, but time will not.",
  },
  {
    image: slide4,
    quote: "My to-do list seems to be filled with things from yesterday.",
  },
  {
    image: slide5,
    quote: "Now is never a good time to wait till later.",
  },
];

export default function Login() {
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="flex flex-col md:flex-row h-screen bg-white">
      {/* Mobile View */}
      <section className="md:hidden w-full h-full flex flex-col items-center justify-center px-4 py-6 text-orange-800">
        {showForm ? (
          <LoginForm />
        ) : (
          <>
            <img
              src={logo}
              alt="App Logo"
              className="h-20 w-auto mb-4"
              aria-hidden="true"
            />
            <Slideshow images={slides} />
            <Button
              onClick={() => setShowForm(true)}
              className="mt-6 w-full bg-amber-800 text-white"
            >
             Login
            </Button>
          </>
        )}
      </section>
      
      <section
        className="hidden md:flex w-[35%] items-center justify-center bg-white text-orange-800"
        aria-hidden="true"
      >
        <Slideshow images={slides} />
      </section>

      <section className="hidden md:flex w-[65%] items-center justify-center px-4 bg-white">
        <LoginForm />
      </section>
    </main>
  );
}
