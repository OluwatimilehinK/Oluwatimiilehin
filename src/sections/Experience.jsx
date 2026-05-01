const experiences = [
  {
    period: "2026 — Present",
    role: "Junior Frontend Engineer",
    company: "Tirlun.ai",
    description:
      "Tirlun.ai is an innovative agritech company that leverages artificial intelligence to improve farm operations and workforce training. Its platform enables agricultural businesses to create structured training systems, manage teams, and digitize farm processes for better productivity and sustainability.",
    technologies: ["React", "JavaScript"],
    current: true,
  },
  {
    period: "2025 — 2026",
    role: "Intern Frontend Engineer",
    company: "Trinixbyte Solutions Limited",
    description:
      "Currently interning as a frontend engineer, gaining hands-on experience with modern web technologies and contributing to real-world projects.",
    technologies: ["React", "JavaScript"],
    current: true,
  },
  {
    period: "2020 — 2022",
    role: "Frontend Instructor",
    company: "Gide Tech Software Educational Consult ",
    description:
      "Taught frontend development to a cohort of 20 students. Created curriculum and hands-on projects to reinforce learning.",
    technologies: ["HTML", "CSS", "JAVASCRIPT", "REACT"],
    current: false,
  },
];

 const Experience = () => {
  return (
    <section id="experience" className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/4 w-64 sm:w-96
       h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2"
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span
            className="text-secondary-foreground text-xs sm:text-sm
           font-medium tracking-wider uppercase animate-fade-in"
          >
            Career Journey
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold
           mt-3 sm:mt-4 mb-4 sm:mb-6 animate-fade-in animation-delay-100
            text-secondary-foreground"
          >
            Experience that{" "}
            <span className="font-serif italic font-normal text-white">
              {" "}
              speaks volumes.
            </span>
          </h2>

          <p
            className="text-sm sm:text-base text-muted-foreground
           animate-fade-in animation-delay-200"
          >
            A timeline of my professional growth, from curious beginner to
            senior engineer leading teams and building products at scale.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="timeline-glow absolute left-2 lg:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/70 via-primary/30 to-transparent md:-translate-x-1/2 shadow-[0_0_25px_rgba(32,178,166,0.8)]" />

          {/* Experience Items */}
          <div className="space-y-10 sm:space-y-12">
            {experiences.map((exp, idx) => (
              <div
                key={idx}
                className="relative grid lg:grid-cols-2 gap-6 sm:gap-8 animate-fade-in"
                style={{ animationDelay: `${(idx + 1) * 150}ms` }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-2 lg:left-1/2 top-0 w-3 h-3 bg-primary rounded-full -translate-x-1/2 ring-4 ring-background z-10">
                  {exp.current && (
                    <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                  )}
                </div>

                {/* Content */}
                <div
                  className={`pl-8 lg:pl-0 ${
                    idx % 2 === 0
                      ? "lg:pr-16 lg:text-right"
                      : "lg:col-start-2 lg:pl-16"
                  }`}
                >
                  <div
                    className={`glass p-5 sm:p-6 rounded-2xl border border-primary/30 hover:border-primary/50 transition-all duration-500`}
                  >
                    <span className="text-xs sm:text-sm text-primary font-medium">
                      {exp.period}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold mt-2">{exp.role}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{exp.company}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
                      {exp.description}
                    </p>
                    <div
                      className={`flex flex-wrap gap-2 mt-3 sm:mt-4 ${
                        idx % 2 === 0 ? "md:justify-end" : ""
                      }`}
                    >
                      {exp.technologies.map((tech, techIdx) => (
                        <span
                          key={techIdx}
                          className="px-3 py-1 bg-surface text-xs rounded-full text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;