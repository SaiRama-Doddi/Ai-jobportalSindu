import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const isHR = role === "HR";
  const isAdmin = role === "ADMIN";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

 const navLinks = [
  { name: "Home", path: "/" },

  // 🟢 Public Register only (Candidate/HR self registration)
  ...(!token ? [{ name: "Register", path: "/register" }] : []),

  // 🟣 HR/Admin creating staff
  ...(token && (isHR || isAdmin)
    ? [{ name: "Create Interviewer", path: "/register" }]
    : []),

  // 🔵 HR dashboard links
  ...(token && isHR
    ? [
        { name: "Dashboard", path: "/hr" },
        { name: "Interviewers", path: "/hr/interviewers" },
      ]
    : []),

  // 🟠 Login only when logged out
  ...(!token ? [{ name: "Login", path: "/login" }] : []),
];

  const isActive = (path: string) => location.pathname === path;

 return (
  <header className="fixed top-0 w-full z-50 px-4 pt-4">
    <div className="max-w-7xl mx-auto">

      {/* Glass Container */}
      <div className="flex items-center justify-between px-6 py-3 rounded-2xl
        bg-white/70 backdrop-blur-xl shadow-lg border border-white/40">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-black tracking-tight bg-gradient-to-r 
          from-indigo-600 via-blue-600 to-cyan-500 
          bg-clip-text text-transparent"
        >
          JobPortal
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative text-sm font-medium transition-all duration-300
              ${isActive(link.path)
                  ? "text-indigo-600"
                  : "text-gray-700 hover:text-indigo-600"
                }`}
            >
              {link.name}

              {/* Premium bottom indicator */}
              {isActive(link.path) && (
                <span className="absolute left-0 -bottom-2 w-full h-[3px] 
                bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" />
              )}
            </Link>
          ))}

          {/* Profile Dropdown */}
          {token && (
            <div className="relative group">
              <button
                className="flex items-center gap-3 px-4 py-2 rounded-xl
                bg-white shadow-sm hover:shadow-md border border-gray-200
                transition duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r 
                  from-indigo-500 to-cyan-500 text-white flex items-center 
                  justify-center text-sm font-semibold">
                  {name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {name}
                </span>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl 
                shadow-xl border border-gray-200 opacity-0 invisible 
                group-hover:opacity-100 group-hover:visible 
                transition-all duration-300">

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm 
                  hover:bg-gray-100 rounded-xl text-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 rounded-2xl bg-white/90 backdrop-blur-xl
          shadow-xl border border-gray-200 overflow-hidden animate-in fade-in">

          <div className="flex flex-col p-6 gap-5">

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`text-base font-medium transition
                ${isActive(link.path)
                    ? "text-indigo-600"
                    : "text-gray-700 hover:text-indigo-600"
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {token && (
              <>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-3">
                    Signed in as
                  </p>
                  <p className="text-indigo-600 font-semibold mb-4">
                    {name}
                  </p>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 
                    text-white py-2 rounded-xl shadow transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  </header>
);
};

export default Navbar;
