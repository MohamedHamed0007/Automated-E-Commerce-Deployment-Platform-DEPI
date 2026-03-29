import { Asterisk, Banknote, Eye, LocateFixed, MapPin, MoveRight, Rocket, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">

      {/* HERO SECTION */}
      <section className="px-4 py-10 md:px-40 md:py-16">
        <div className="layout-content-container flex flex-col max-w-300 mx-auto flex-1">
          <div className="container">
            <div className="relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 md:p-16 flex flex-col items-center text-center gap-8 shadow-2xl shadow-blue-500/5">

              <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#137fec_0%,transparent_70%)]"></div>

              <div className="relative z-10 flex flex-col gap-4 max-w-3xl">
                <div className="mx-auto flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Real-time Carrier Rates
                </div>

                <h1 className="text-slate-900 dark:text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                  Ship Smarter, <span className="text-blue-600">Save More.</span>
                </h1>

                <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                  Compare real-time rates from 50+ global carriers including DHL, FedEx, and Aramex. 
                  Save up to 30% on your very first shipment.
                </p>
              </div>

              <div className="relative z-10 w-full max-w-212.5">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-2xl shadow-blue-500/10 flex flex-col md:flex-row gap-3 border border-slate-100 dark:border-slate-700">

                  {/* From Input */}
                  <div className="flex-1 flex items-center px-4 gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-transparent focus-within:border-blue-500 transition-all py-3 md:py-0">
                    <span className="material-symbols-outlined text-blue-500"><MapPin /></span>
                    <input
                      className="w-full border-none outline-none bg-transparent text-sm font-semibold placeholder:text-slate-400 text-slate-900 dark:text-white"
                      placeholder="From : Origin City or Country"
                      type="text"
                    />
                  </div>

                  {/* To Input */}
                  <div className="flex-1 flex items-center px-4 gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-transparent focus-within:border-blue-500 transition-all py-3 md:py-0">
                    <span className="text-blue-500"><Send size={28} strokeWidth={2.75} /></span>
                    <input
                      className="w-full border-none outline-none bg-transparent text-sm font-semibold placeholder:text-slate-400 text-slate-900 dark:text-white"
                      placeholder="To: Destination City"
                      type="text"
                    />
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold 
                                hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 
                                transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Compare Rates</span>
                    <MoveRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap justify-center items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  <span className="text-xl text-slate-400">No account required to check rates • Trusted by 10k+ businesses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION + VISION */}
      <section className="py-24 px-6 bg-gray-100  dark:bg-slate-800">
        <div className="mx-auto max-w-7xl dark:bg-slate-800">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-12">
              <div className="group flex items-start gap-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                <div className="flex w-32 p-4 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Rocket size={40} />
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    To empower e-commerce growth through seamless shipping
                    comparisons, providing businesses of all sizes access to top-
                    tier logistics without the traditional complexities.
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                <div className="flex w-32 p-4 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Eye size={40} />
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">Our Vision</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    To become the global standard for logistics transparency and
                    reliability, where geographical borders no longer represent
                    barriers to business commerce.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="aspect-square overflow-hidden rounded-3xl bg-slate-200 shadow-2xl">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7HYz5wKiiiZtDvL1WlIt3U3kfWYYdMBacN9OkBFAkKp62HbY4Mpw6Q0z1J5GuDRH7Yhv68T1lz_tpq3DR0T0BJ4J9EoWRvblL662u2QSYbgESsl7Bz71QUKCJf1OxlK2TqHuvQdhNx9ZDjdHC3ZNxlGKEXi1VdVng8B7A__KoFDQA5HDlEn28gRVL9bI5Ib54fBaGODcg8atQyXxK6rMpScdTq3P9vXLJ6b9PdcjWsaf9fFtSrG1rY3_TPBTyJRc_U34HdLQqkw"
                  className="h-full w-full object-cover"
                  alt="our mission and vision"
                />
              </div>

              <div className="absolute -bottom-9 -left-6 h-48 w-48 rounded-2xl bg-blue-100 dark:bg-slate-900 z-[-1]"></div>
              <div className="absolute -top-6 -right-6 h-48 w-48 rounded-2xl bg-slate-100 dark:bg-slate-900 z-[-1]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-white dark:bg-slate-800 py-24 px-6 border-y border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl">

          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-black">
              Why Industry Leaders <span className="text-blue-600">Trust Us</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              We provide the tools you need to optimize your shipping workflow and scale your business internationally with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="p-8 rounded-2xl bg-gray-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-800 space-y-6 hover:-translate-y-2 transition-transform">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-md">
                <LocateFixed size={40} className="text-blue-600" />
              </div>
              <h4 className="text-xl font-bold">Real-time Tracking</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Monitor every shipment with live updates across all partners through our unified tracking interface.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-800 space-y-6 hover:-translate-y-2 transition-transform">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-md">
                <Asterisk size={40} className="text-blue-600" />
              </div>
              <h4 className="text-xl font-bold">Multi-carrier Integration</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect with 50+ global logistics providers in one dashboard. Manage contracts easily.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-800 space-y-6 hover:-translate-y-2 transition-transform">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-md">
                <Banknote size={40} className="text-blue-600" />
              </div>
              <h4 className="text-xl font-bold">Cost Optimization</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Save up to 30% on shipping with our smart comparison engine.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gray-100 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 px-8 py-20 text-center shadow-3xl">

            <div className="absolute inset-0 opacity-20">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU8BmzHxsergFglBWoz0cWqiAXmkn33mjSLRnUfy7WAHQiyO_SG1Kn3WipzlT3ngc-mbkft5ISh4MMxBTsf0EP4i3cEV7DjGLziBQTDypkiewBtnv3NzfB5loTQ_HCoxY_gZLZ4jMJLwJROUQUC8PsF64pg6zjbHYSTmi6MAT417gb0Ycyqn0y_-Lqt9KlOMhpt7uocNZuPWIH9k1O8DCDXJPmKEB640pcJSBbNOfHweWzp4SiTmUsYrw904_zwMgN8BLM9wo9Ig"
                className="h-full w-full object-cover"
                alt=""
              />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl font-black text-white md:text-5xl">
                Ready to Transform Your Shipping Experience?
              </h2>
              <p className="text-lg text-slate-300">
                Join thousands of businesses scaling their operations with ShipCompare's smart logistics platform.
              </p>

              <div className="flex flex-wrap justify-center gap-4">

                <button
                  onClick={() => navigate("/login")}
                  className="rounded-xl bg-blue-600 px-10 py-5 text-lg font-bold text-white 
                              hover:bg-blue-500 transition-all shadow-xl shadow-blue-300/40 cursor-pointer"
                >
                  Start Shipping Now
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="rounded-xl bg-white/10 px-10 py-5 text-lg font-bold text-white 
                              backdrop-blur-md hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
                >
                  Book a Demo
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default About;