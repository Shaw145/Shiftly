import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import team1 from "../assets/Team1.jpg";
import team2 from "../assets/Team5.jpeg";
import team3 from "../assets/Team4.jpeg";
import team4 from "../assets/Team3.jpg";
import team5 from "../assets/Team2.jpg";

const teamMembers = [
  {
    name: "Suman Shaw",
    role: "Full Stack Developer",
    image: team1,
    bio: "Lead developer responsible for project architecture, API design, and overseeing both frontend and backend implementation.",
    linkedin: "https://www.linkedin.com/in/sumanshaw/",
    github: "https://github.com/Shaw145",
    twitter: "https://x.com/shwsuman",
  },
  {
    name: "Sudipto Das",
    role: "Backend Developer",
    image: team2,
    bio: "Handles server-side logic, database management, and API integrations including payment gateways and authentication.",
    linkedin: "https://www.linkedin.com/in/sudipto-das-sudi369",
    github: "https://github.com/sudiptodas369",
    twitter: "#",
  },
  {
    name: "Swarnali Das",
    role: "UI/UX Designer",
    image: team3,
    bio: "Creates user interface designs, wireframes, prototypes, and ensures a seamless user experience across all platform touchpoints.",
    linkedin: "https://www.linkedin.com/in/swarnali-das-b087a0288",
    github: "https://github.com/swarnali03",
    twitter: "#",
  },
  {
    name: "Sujash Das",
    role: "Frontend Developer",
    image: team4,
    bio: "Implements responsive UI components, state management, and client-side features using React.js and modern web technologies.",
    linkedin: "https://www.linkedin.com/in/sujashdas1210",
    github: "https://github.com/Sujash-1210",
    twitter: "#",
  },
  {
    name: "Subhadeep Dutta",
    role: "Frontend Developer",
    image: team5,
    bio: "Focuses on performance optimization, responsive design implementation, and frontend testing across different devices.",
    linkedin: "https://www.linkedin.com/in/subhodeep-dutta-636229270/",
    github: "https://github.com/Subhodeep142002",
    twitter: "#",
  },
];

const XIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 120 120"
    aria-hidden="true"
  >
    <path d="M95.4 10H112L73.1 54.6 119 110H83.7l-27.2-32.4-31 32.4H8l40.7-46.1L1 10h37.3l25.1 29.9L95.4 10zm-6.5 92.3h10.6L34.9 19.6H23.6l65.3 82.7z"/>
  </svg>
);


export default function TeamMembers() {
  return (
    <section className="py-20 bg-gradient-to-t from-red-50 to-white min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-3">
            <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-2">OUR TEAM</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet The Talented Team Behind Shiftly
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our diverse team combines expertise in development, design, and
            business to create an exceptional transport platform
          </p>
        </motion.div>

        {/* Grid */}
        <div className="flex flex-col items-center space-y-20">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {teamMembers.slice(0, 5).map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="flex justify-center"
              >
                <motion.div
                  whileHover={{
                    y: -8,
                    boxShadow: "0 8px 32px 0 rgba(236,72,153,0.14)",
                    scale: 1.04,
                  }}
                  className="relative flex flex-col items-center  backdrop-blur-lg border border-black/40 rounded-3xl shadow-xl px-8 pt-8 pb-7 w-80 transition-all duration-300 group hover:shadow-indigo-300/60 bg-transparent "
                  // style={{
                  //   background: "linear-gradient(135deg,rgba(236,72,153,0.13),rgba(99,102,241,0.09) 90%)",
                  // }}
                >
                  {/* Profile Image INSIDE the card */}
                  <div className="w-30 h-30 rounded-full border-4 border-white shadow-lg object-cover overflow-hidden mb-4 flex items-center justify-center bg-gradient-to-tr from-pink-400 via-indigo-400 to-blue-400">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900  transition mt-2">
                    {member.name}
                  </h3>
                  <p className="text-sm text-pink-500 font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-900 text-sm text-center mb-6">{member.bio}</p>
                  {/* Social Links with modern X icon */}
                  <div className="flex space-x-4 justify-center">
                    <motion.a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, color: "#171515" }}
                      className="text-gray-400 hover:text-black transition"
                    >
                      <FaGithub size={22} />
                    </motion.a>
                    <motion.a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, color: "#0A66C2" }}
                      className="text-gray-400 hover:text-blue-600 transition"
                    >
                      <FaLinkedin size={22} />
                    </motion.a>
                    <motion.a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, color: "#111" }}
                      className="text-gray-400 hover:text-black transition"
                    >
                      <XIcon />
                    </motion.a>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}