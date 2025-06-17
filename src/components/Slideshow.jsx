import { useEffect, useState } from "react";

const Slideshow = ({ images, interval = 8000 }) => {
  const [index, setIndex] = useState(0);

  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 400);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  return (
    <section
      aria-label="Image slideshow"
      className="w-full h-full flex flex-col items-center justify-center text-center space-y-4 px-4"
    >
      <img
        src={images[index].image}
        alt={`Slide ${index + 1}`}
        className={`max-w-full max-h-[60vh] object-contain rounded-lg shadow-xl transform transition-all duration-1000 ${
          fade ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      />

      <figcaption
        className="text-lg font-medium text-orange-700 max-w-md"
        aria-live="polite"
      >
        {images[index].quote}
      </figcaption>

      <div
        className="flex gap-2 mt-2"
        role="tablist"
        aria-label="Slide indicators"
      >
        {images.map((_, i) => (
          <button
            key={i}
            className={`h-2 w-2 rounded-full ${
              i === index ? "bg-orange-800" : "bg-orange-700"
            }`}
            aria-label={`Slide ${i + 1}`}
            aria-selected={i === index}
            tabIndex={0}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default Slideshow;
