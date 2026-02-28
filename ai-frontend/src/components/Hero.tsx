import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingSections from "./landingpage";

const slides = [
  {
    title: "Find Your Dream Job",
    subtitle: "Explore verified opportunities from leading companies worldwide.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Smart HR Dashboard",
    subtitle: "Streamline hiring workflows with powerful analytics.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "AI-Powered Recruitment",
    subtitle: "Accelerate screening with intelligent candidate matching.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
    <section className="relative h-[85vh] md:h-[95vh] overflow-hidden rounded-3xl mt-6">

      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image with Zoom Effect */}
          <img
            src={slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover transition-transform duration-[6000ms] ${
              i === index ? "scale-110" : "scale-100"
            }`}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 flex items-center">
            
            <div className="max-w-7xl mx-auto px-6 text-white">

              <div className="max-w-2xl animate-fadeIn">

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                  {slide.title}
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-wrap gap-5">

                  <button
                    onClick={() => navigate("/jobs")}
                    className="px-8 py-3 rounded-xl text-sm sm:text-base font-semibold
                    bg-gradient-to-r from-indigo-600 to-cyan-500
                    hover:scale-105 transform transition duration-300 shadow-xl"
                  >
                    Explore Jobs
                  </button>

                  <button
                    onClick={() => navigate("/register")}
                    className="px-8 py-3 rounded-xl text-sm sm:text-base font-semibold
                    border border-white/30 backdrop-blur-md
                    hover:bg-white hover:text-black transition duration-300"
                  >
                    Get Started
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Premium Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all duration-300 ${
              i === index
                ? "w-8 h-3 bg-white rounded-full"
                : "w-3 h-3 bg-white/40 rounded-full hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
    <LandingSections/>
    </>
  );
}