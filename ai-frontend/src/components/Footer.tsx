import { Link } from "react-router-dom";
import { Linkedin, Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative mt-24 bg-gradient-to-b from-gray-950 to-gray-900 text-gray-300">

      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent mb-4">
            JobPortal
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Connecting talent with opportunity. Build your career, hire
            smarter, and grow faster with our modern recruitment platform.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-indigo-600 transition">
              <Linkedin size={18} />
            </a>
            <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-indigo-600 transition">
              <Github size={18} />
            </a>
            <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-indigo-600 transition">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-semibold mb-5">Platform</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-indigo-400 transition">Home</Link></li>
            <li><Link to="/jobs" className="hover:text-indigo-400 transition">Browse Jobs</Link></li>
            <li><Link to="/register" className="hover:text-indigo-400 transition">Register</Link></li>
            <li><Link to="/login" className="hover:text-indigo-400 transition">Login</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-5">Resources</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="#" className="hover:text-indigo-400 transition">Help Center</Link></li>
            <li><Link to="#" className="hover:text-indigo-400 transition">Privacy Policy</Link></li>
            <li><Link to="#" className="hover:text-indigo-400 transition">Terms of Service</Link></li>
            <li><Link to="#" className="hover:text-indigo-400 transition">Support</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-5">Stay Updated</h3>
          <p className="text-sm text-gray-400 mb-4">
            Get job alerts and platform updates directly to your inbox.
          </p>

          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-l-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-r-xl text-sm font-medium transition">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-gray-800"></div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        <p className="mt-2 md:mt-0">
          Designed for modern recruitment platforms.
        </p>
      </div>
    </footer>
  );
};

export default Footer;