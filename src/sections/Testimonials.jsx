import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    quote:
      "Kazeem is one of the most talented engineers I've worked with. His attention to detail and ability to translate complex requirements into elegant solutions is remarkable.",
    author: "Paul Ajadi",
    role: "CTO, Trinixbyte Solutions.",
    avatar:
      "https://media.licdn.com/dms/image/v2/D4D03AQH8jMnmIf3UXA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1719177298975?e=1775088000&v=beta&t=NFS2v9nZbouG0s5wdIjwt0yHmokjbZ8oHJSv_0iNDFE",
  },
  {
    quote:
      "Working with Kazeem was a game-changer for our project. He delivered ahead of schedule with code quality that set a new standard for our team.",
    author: "Tofunmi Biala",
    role: "Product Manager, Digital Solutions",
    avatar:
      "https://media.licdn.com/dms/image/v2/D4D03AQGc-8YxMLH4hQ/profile-displayphoto-scale_200_200/B4DZuiBKAIIEAY-/0/1767949772308?e=1775088000&v=beta&t=NTCH4vJZ0O0HgG1F3aqA2ppCDok7mE9O0Lvpr4aieFU",
  },
  {
    quote:
      "Not only is Kazeem technically brilliant, but he's also a fantastic communicator and team player. He elevated everyone around him.",
    author: "Abigeal Ali",
    role: "Product Designer, BuildUpNg",
    avatar:
      "https://media.licdn.com/dms/image/v2/D4D35AQHEiAbQDKUvCg/profile-framedphoto-shrink_400_400/B4DZx8PE.kIYAc-/0/1771610853608?e=1775566800&v=beta&t=qfoki6Uoqt0ay-CjBhkJAIlkcparqv9RA3OVbNwwov4",
  },
];

 const Testimonials = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const next = () => {
    setActiveIdx((prev) => (prev + 1) % testimonials.length);
  };

  const previous = () => {
    setActiveIdx(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };
  return (
    <section id="testimonials" className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2
       w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-primary/5
        rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
      />
      <div
        className="container mx-auto
      px-4 sm:px-6 relative z-10"
      >
        {/* Section Header */}
        <div
          className="text-center max-w-3xl
        mx-auto mb-12 sm:mb-16"
        >
          <span
            className="text-secondary-foreground
          text-xs sm:text-sm font-medium tracking-wider
          uppercase animate-fade-in"
          >
            What People Say
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl
          font-bold mt-3 sm:mt-4 mb-4 sm:mb-6 animate-fade-in
          animation-delay-100 text-secondary-foreground"
          >
            Kind words from{" "}
            <span
              className="font-serif italic
            font-normal text-white"
            >
              amazing people.
            </span>
          </h2>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial */}
            <div className="glass p-6 sm:p-8 md:p-12 rounded-3xl glow-border animate-fade-in animation-delay-200">
              <div className="absolute -top-4 left-6 sm:left-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center">
                <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>

              <blockquote className="text-base sm:text-xl md:text-2xl font-medium leading-relaxed mb-6 sm:mb-8 pt-4">
                "{testimonials[activeIdx].quote}"
              </blockquote>

              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={testimonials[activeIdx].avatar}
                  alt={testimonials[activeIdx].author}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-primary/20 flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-sm sm:text-base truncate">
                    {testimonials[activeIdx].author}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground truncate">
                    {testimonials[activeIdx].role}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials Navigation */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              <button
                className="p-2.5 sm:p-3 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all"
                onClick={previous}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button key={idx}
                    onClick={() => setActiveIdx(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeIdx
                        ? "w-8 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Next testimonial"
                className="p-2.5 sm:p-3 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;