import { ArrowUpRight, Github } from "lucide-react";
import { AnimatedBorderButton } from "@/components/AnimatedBorderButton";
const projects = [
  {
    title: "A Portfolio Website",
    description:
      "Portfolio website showcasing Oluwatimilehin Kazeem’s web development skills, projects, experience, and contact information.",
    image: "/projects/project1.png",
    tags: ["React", "TailwindCSS"],
    link: "https://oluwatimilehinio.vercel.app/",
    github: "https://github.com/OluwatimilehinK/Beautiful-Portfolio",
  },
  {
    title: "VirtualR",
    description:
      "Modern website promoting AI solutions, automation tools, web development services, and digital business transformation.",
    image: "/projects/project2.png",
    tags: [ "JavaScript", "React", "Tailwind"],
    link: "https://virtual-r-psi-kohl.vercel.app/",
    github: "https://github.com/OluwatimilehinK/VirtualR",
  },
  {
    title: "AstroLens",
    description:
      "Web app displaying daily space images and information using NASA’s Astronomy Picture of the Day API.",
    image: "/projects/project3.png",
    tags: ["React", "FastAPOD API", "Tailwind"],
    link: "https://apodproject.vercel.app/",
    github: "https://github.com/OluwatimilehinK/Nasa-react-app",
  },
  {
    title: "CodeFlow AI",
    description:
      "Interactive coding platform for learning programming concepts, roadmaps, data structures, and solving practice problems.",
    image: "/projects/project4.png",
    tags: ["Next.js", "Socket.io", "MongoDB", "Redis"],
    link: "https://code-flow-rosy.vercel.app/",
    github: "https://github.com/OluwatimilehinK/CodeFlow",
  },
];

const Project = () => {
  return (
    <section id="projects" className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Bg glows */}
      <div className="absolute top-1/4 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-highlight/5 rounded-full blur-3xl" />
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mx-auto max-w-3xl mb-12 sm:mb-16">
          <span className="text-secondary-foreground text-xs sm:text-sm font-medium tracking-wider uppercase animate-fade-in">
            Featured Work
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
            Projects that
            <span className="font-serif italic font-normal text-white">
              {" "}
              make an impact.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground animate-fade-in animation-delay-200">
            A selection of my recent work, from complex web applications to
            innovative tools that solve real-world problems.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="group glass rounded-2xl overflow-hidden animate-fade-in md:row-span-1"
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0
                bg-gradient-to-t from-card via-card/50
                 to-transparent opacity-60"
                />
                {/* Overlay Links — always visible on touch devices, hover-revealed on desktop */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.title} live site`}
                    className="p-2.5 sm:p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.title} GitHub repo`}
                    className="p-2.5 sm:p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.title}`}
                    className="flex-shrink-0"
                  >
                    <ArrowUpRight
                      className="w-5 h-5
                    text-muted-foreground group-hover:text-primary
                     group-hover:translate-x-1
                     group-hover:-translate-y-1 transition-all"
                    />
                  </a>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-surface text-xs font-medium border border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10 sm:mt-12 animate-fade-in animation-delay-500">
          <AnimatedBorderButton>
            <a href="https://github.com/OluwatimilehinK?tab=repositories" target="_blank" rel="noopener noreferrer">
            View All Projects
            </a>
            <ArrowUpRight className="w-5 h-5" />
          </AnimatedBorderButton>
        </div>
      </div>
    </section>
  );
};

export default Project;