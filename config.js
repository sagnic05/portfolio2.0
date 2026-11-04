// Edit this file to update content. Nothing here is invented: only details from your brief and existing portfolio.
const REMOTE = "https://sagnic05.github.io/sagnic-portfolio/"; // fallback host for your original assets
window.CONFIG = {
  user: "sagnic05",
  email: "bhattacharyya.sagnic@gmail.com",
  linkedin: "https://linkedin.com/in/sagnic-bhattacharyya",
  github: "https://github.com/sagnic05",
  resume: "assets/resume/Sagnic_Bhattacharyya_Resume.pdf",
  // Repos shown in the featured section are hidden from the archive
  featured: ["c", "multi-break-os", "campus-companion", "career-os", "cn-visual-lab"],
  projects: [
    { title: "Campus Companion", layout: "browser", img: "campus_companion.png", repo: "https://github.com/sagnic05/campus-companion", live: "https://campus-companion-tawny-five.vercel.app/",
      text: "A digital assistant for university life: interactive campus navigation, schedule tracking and centralized resource management.",
      tech: ["React.js", "Vite", "Supabase", "Capacitor"] },
    { title: "Developer Career OS", layout: "wide", img: "developer_career_os.png", repo: "https://github.com/sagnic05/CAREER-OS", live: "https://career-os-sable.vercel.app/",
      text: "A workspace for developers that tracks project timelines, skill progression and job applications in one dashboard.",
      tech: ["React.js", "Tailwind CSS", "Node.js"] },
    { title: "CN Visual Lab", layout: "split", feats: ["Roadmap and visual explorer","Subnetting lab, topology builder, protocol simulator","Packet flow simulator","Progress dashboard and viva questions"], img: "", repo: "https://github.com/sagnic05/CN-VISUAL-LAB", live: "https://sagnic05.github.io/CN-VISUAL-LAB/",
      text: "A browser-based learning platform for Computer Networks: a roadmap and visual explorer, practice labs (subnetting, topology builder, protocol simulator), a packet flow simulator, viva questions and a progress dashboard.",
      tech: ["HTML5", "CSS3", "JavaScript"] },
    { title: "BrainOS", layout: "browser", img: "", repo: "https://github.com/sagnic05/brain_os", live: "https://sagnic05.github.io/brain_os/",
      text: "A web-based operating system built entirely with React that simulates a desktop in the browser: boot sequence, lock screen, draggable windows, taskbar and a suite of integrated apps.",
      feats: ["Spotify search and playback, YouTube player, WebSurfer browser", "Camera and gallery saved to localStorage", "Solitaire, Calculator, Notepad, Terminal"],
      tech: ["React.js", "Spotify Web API", "WebRTC", "localStorage"] },
    { title: "C-Break OS", layout: "split", img: "image_05164b.png", repo: "https://github.com/sagnic05/c", live: "https://sagnic05.github.io/c/",
      text: "A custom operating system environment built from the ground up, focused on core kernel mechanics and streamlined execution.",
      tech: ["C", "Assembly", "Kernel design"] },
    { title: "Multi-Break OS", layout: "wide", img: "image_0512a9.png", repo: "https://github.com/sagnic05/multi-break-os", live: "https://sagnic05.github.io/multi-break-os/",
      text: "An iteration of C-Break OS that expands the system architecture with multi-tasking capabilities.",
      tech: ["C++", "Concurrency", "Architecture"] }
  ],
  skills: {
    Frontend: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js"],
    Programming: ["Java", "Kotlin", "C", "C++", "Python"],
    Backend: ["Node.js", "Spring Boot", "REST APIs"],
    Database: ["SQL", "Firebase", "Supabase"],
    Tools: ["Git", "GitHub", "VS Code"]
  },
  journey: [
    { when: "Expected 2027", title: "B.Tech, Computer Science & Engineering", text: "Hooghly Engineering and Technology College." },
    { when: "2025", title: "SIH 2025 internal hackathon", text: "Participant with Team ByteKoders." },
    { when: "Jul – Aug 2026", title: "AI Web Development Intern", text: "InAmigos Foundation." },
    { when: "Certification", title: "Fortinet Certified Associate in Cybersecurity", text: "Certificate image: add to assets/images/certificates/ and set `certImage` below." }
  ],
  certImage: "" // e.g. "assets/images/certificates/fortinet.jpg"
};
