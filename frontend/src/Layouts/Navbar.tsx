import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, Truck, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hookredux";
import { toggleTheme } from "../redux/themeRedux/themeSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-bold transition-all duration-300 py-2 group ${
      isActive
        ? "text-blue-600 dark:text-blue-400"
        : "text-slate-950 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
    }`;

  return (
    <>
      {/* Navbar Wrapper */}
      <div
        className={`fixed w-full top-0 z-50 flex justify-center transition-all duration-500 ${
          scrolled ? "pt-2" : "pt-6"
        }`}
      >
        <nav
          className={`transition-all duration-500 ease-in-out flex items-center justify-between ${
            scrolled
              ? "w-[92%] max-w-6xl bg-white/80 dark:bg-gray-950/90 backdrop-blur-md shadow-lg border border-white/20 dark:border-gray-800/50 px-6 py-2 rounded-2xl"
              : "w-[95%] max-w-7xl bg-transparent px-6 py-2 rounded-none"
          }`}
        >
          {/* 1. Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group flex-1"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-blue-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative w-10 h-10 flex items-center justify-center bg-blue-600 rounded-lg text-white shadow-lg">
                <Truck size={20} strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-950 dark:text-blue-600 hidden sm:block">
              Ship<span className="text-blue-600">sphere</span>
            </span>
          </div>

          {/* 2. Main Navigation (Desktop) */}
          <div className="hidden md:flex items-center gap-10 flex-1 justify-center">
            {mainLinks.map((link) => (
              <NavLink key={link.name} to={link.path} className={linkStyle}>
                {({ isActive }) => (
                  <>
                    {link.name}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-300 ${
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* 3. Actions */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="hidden lg:flex items-center gap-6">
              <NavLink
                to="/login"
                className="text-sm font-bold text-slate-950 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              >
                Login
              </NavLink>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2.5 text-slate-950 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-90"
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {/* Signup Button */}
            <button
              onClick={() => navigate("/signup")}
              className="hidden sm:flex items-center gap-2 bg-slate-950 dark:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-md shadow-black/10"
            >
              Signup <ArrowRight size={16} />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-slate-950 dark:text-blue-400 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[48] md:hidden transition-all duration-500 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`absolute right-4 top-24 left-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-2xl transition-all duration-300 ${
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">
                Menu
              </p>
              {mainLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-2xl font-black text-slate-950 dark:text-blue-400"
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-800" />

            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  navigate("/signup");
                  setIsOpen(false);
                }}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg"
              >
                Get Started
              </button>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="flex-1 py-3 text-sm font-bold border border-gray-200 dark:border-gray-700 rounded-xl text-slate-950 dark:text-blue-400"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setIsOpen(false);
                  }}
                  className="flex-1 py-3 text-sm font-bold bg-slate-950 dark:bg-blue-600 text-white rounded-xl"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;