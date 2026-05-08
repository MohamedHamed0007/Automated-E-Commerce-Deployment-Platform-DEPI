import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, Truck, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/hookredux';
import { toggleTheme } from '../redux/themeRedux/themeSlice';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainLinks = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
    { name: 'About', path: '/about' }
  ];

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'py-2' : 'py-5'
        } flex justify-center`}
      >
        <nav
          className={`w-[92%] max-w-7xl flex items-center justify-between transition-all duration-500 
            ${
              scrolled
                ? 'backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 shadow-md border border-white/20 dark:border-slate-700/40 rounded-2xl px-6 py-3'
                : 'bg-transparent px-4'
            }
          `}
        >
          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/40 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"></div>

              <div
                className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl
                flex items-center justify-center shadow-lg shadow-blue-700/30 group-hover:scale-105 transition-all duration-300"
              >
                <Truck size={22} strokeWidth={2.3} />
              </div>
            </div>

            <h1 className="text-2xl font-black tracking-tight hidden sm:block text-slate-900 dark:text-white">
              Ship
              <span className="text-blue-600 dark:text-blue-500">sphere</span>
            </h1>
          </div>

          {/* DESKTOP LINKS */}
          <ul className="hidden md:flex items-center gap-10">
            {mainLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative text-[15px] font-semibold transition duration-300 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-700 dark:text-slate-300 hover:text-blue-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300 
                        ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </ul>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            {/* THEME SWITCH */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-all active:scale-90"
            >
              {theme === 'dark' ? (
                <Sun size={19} className="text-yellow-400" />
              ) : (
                <Moon size={19} className="text-slate-900" />
              )}
            </button>

            {/* LOGIN */}
            <NavLink
              to="/login"
              className="hidden lg:block text-sm font-bold text-slate-800 dark:text-slate-300 hover:text-blue-600 transition"
            >
              Login
            </NavLink>

            {/* SIGNUP BTN */}
            <button
              onClick={() => navigate('/signup')}
              className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold
              shadow-md hover:bg-blue-700 active:scale-95 transition-all"
            >
              Start Now <ArrowRight size={16} />
            </button>

            {/* MOBILE MENU BTN */}
            <button
              className="md:hidden p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
              onClick={() => setIsOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[48] md:hidden transition-all duration-500 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* BACKDROP */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute right-4 left-4 top-24 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800
            transition-all duration-500 ${
              isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
            }`}
        >
          {/* MENU ITEMS */}
          <div className="flex flex-col gap-6">
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Menu</p>

            {mainLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-black text-slate-900 dark:text-blue-400"
              >
                {link.name}
              </NavLink>
            ))}

            <div className="h-px bg-slate-200 dark:bg-slate-700" />

            {/* BUTTONS */}
            <button
              onClick={() => {
                navigate('/signup');
                setIsOpen(false);
              }}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg"
            >
              Get Started
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
                className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
              >
                Login
              </button>

              <button
                onClick={() => {
                  navigate('/signup');
                  setIsOpen(false);
                }}
                className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
