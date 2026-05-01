import React from 'react'
import Button from '../components/Button'
import { ArrowRight, Download } from 'lucide-react'
import { AnimatedBorderButton } from '../components/AnimatedBorderButton'
import { Github, Linkedin, Twitter, ChevronDown } from 'lucide-react'

const skills = [
  "JavaScript",
  "ReactJS",
  "NextJS",
  "Vercel",
  "Tailwind CSS",
  "Motion",
  "Figma",
  "Git",
  "GitHub Actions",
  "AI Tools",
];

const Hero = () => {

  return (
    <section className='relative min-h-screen flex items-center overflow-hidden'>
      {/* bg */}
        <div className='absolute inset-0'>
          <img src="/hero-bg.jpg" alt="Hero Image" className='w-full h-full object-cover opacity-40' />
          <div className='absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background'  />
        </div>

        {/* Green Dots */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(30)].map((_, index) => (
          <div
            key={index}
            className='absolute w-1.5 h-1.5 rounded-full opacity-60'
            style={{
              backgroundColor: "#20B2A6",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `slow-drift ${15 + Math.random() * 20}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
        </div>
        {/* content */}
        <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 relative z-10">
          <div className='grid lg:grid-cols-2 gap-10 sm:gap-12 items-center justify-center'>
            {/* left column - Text content */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass text-xs sm:text-sm text-primary">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Software Engineer • React Specialist
              </span>
            </div>

              {/* Headline */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in animation-delay-100" >
                  Crafting <span className="text-primary glow-text"> Seamless </span> <br />  Experiences with <br /> <span className="font-serif italic font-normal text-white">React. </span>
                </h1>
                <p className='text-muted-foreground mt-4 max-w-lg mx-auto lg:mx-0 animate-fade-in animation-delay-200 text-base sm:text-lg'>
                  Hi, I am Timlehin Kazeem. A passionate software engineer specializing in React, and Javascript I bring ideas to life through clean code and innovative design.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 animate-fade-in animation-delay-300">
                <a href="#contact">
                  <Button size="lg">
                   Contact Me <ArrowRight className="w-5 h-5" />
                  </Button>
                </a>
                <a href="/resume.pdf" download="Oluwatimilehin's Resume">
                  <AnimatedBorderButton>
                    <Download className="w-5 h-5" />
                    Download CV
                  </AnimatedBorderButton>
                </a>
              </div>
              {/* Social Links */}
              <div className="flex items-center flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 animate-fade-in animation-delay-400">
                <span className="text-sm text-muted-foreground">Follow me: </span>
                {[
                  { icon: Github, href: "https://github.com/OluwatimilehinK" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/oluwatimilehin-kazeem-9a9470323" },
                  { icon: Twitter, href: "https://x.com/Oluwatimil49411" },
                ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all duration-300">
                  {<social.icon className="w-5 h-5" />}
                    </a>
                            ))}
                          </div>
            </div>
            {/* Right Column - Profile Image */}
         <div className="relative animate-fade-in animation-delay-300 order-1 lg:order-2">
                     {/* Profile Image */}
                     <div className="relative max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                       <div
                         className="absolute inset-0
                       rounded-3xl bg-gradient-to-br
                       from-primary/30 via-transparent
                       to-primary/10 blur-2xl animate-pulse"
                       />
                       <div className="relative glass rounded-3xl p-2 glow-border">
                         <img
                           src="/Profile-pic2.png"
                           alt="Timilehin Kazeem"
                           className="w-full aspect-[4/5] object-cover rounded-2xl"
                         />

                         {/* Floating Badge */}
                         <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 glass rounded-xl px-3 py-2 sm:px-4 sm:py-3 animate-float">
                           <div className="flex items-center gap-2 sm:gap-3">
                             <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
                             <span className="text-xs sm:text-sm font-medium">
                               Available for work
                             </span>
                           </div>
                         </div>
                         {/* Stats Badge */}
                         <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 glass rounded-xl px-3 py-2 sm:px-4 sm:py-3 animate-float animation-delay-500">
                           <div className="text-xl sm:text-2xl font-bold text-primary">2+</div>
                           <div className="text-[10px] sm:text-xs text-muted-foreground">
                             Years Exp.
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Skills Section */}
                 <div className="mt-16 sm:mt-20 animate-fade-in animation-delay-600">
                   <p className="text-sm text-muted-foreground mb-6 text-center">
                     Technologies I work with
                   </p>
                   <div className="relative overflow-hidden">
                     <div
                       className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 lg:w-32
                      bg-gradient-to-r from-background to-transparent z-10"
                     />
                     <div
                       className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 lg:w-32
                      bg-gradient-to-l from-background to-transparent z-10"
                     />
                     <div className="flex animate-marquee">
                       {[...skills, ...skills].map((skill, idx) => (
                         <div key={idx} className="flex-shrink-0 px-6 sm:px-8 py-3 sm:py-4">
                           <span className="text-base sm:text-lg lg:text-xl font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                             {skill}
                           </span>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               </div>

               <div
                 className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2
               animate-fade-in animation-delay-800"
               >
                 <a
                   href="#about"
                   className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                 >
                   <span className="text-xs uppercase tracking-wider">Scroll</span>
                   <ChevronDown className="w-6 h-6 animate-bounce" />
                 </a>
               </div>
    </section>
  )
}

export default Hero