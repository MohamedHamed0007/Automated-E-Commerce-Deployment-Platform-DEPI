import type { FC } from "react";
import { useAppDispatch } from "../../redux/hookredux";
import { navigate } from "../../redux/navigateRedux/navigateSlice";
import { ArrowIcon } from "../icons";
import Button from "../Buttons/Buttons";

const HeroSection: FC = () => {
  const dispatch = useAppDispatch();

  const handleClick = (page: string) => {
    dispatch(navigate(page));
  };

  return (
    <section className="relative w-full min-h-[85vh] md:min-h-[90vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1600&q=80')",
        }}
      />

      {/* Dark Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 md:from-slate-950/85 via-slate-900/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-[85vh] md:min-h-[90vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 
            rounded-full bg-blue-500/20 border border-blue-400/30 
            text-blue-300 text-[10px] sm:text-xs 
            font-semibold uppercase tracking-widest mb-5 sm:mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Our Journey
            </div>

            {/* Title */}
            <h1
              className="
            text-3xl sm:text-4xl md:text-6xl lg:text-7xl
            font-black text-white
            leading-tight md:leading-none
            tracking-tight mb-5 sm:mb-6
          "
            >
              Simplifying{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Global
              </span>
              <br />
              Logistics
            </h1>

            {/* Subtitle */}
            <p
              className="
            text-base sm:text-lg md:text-xl
            text-slate-300
            leading-relaxed
            mb-6 sm:mb-8
            max-w-xl
          "
            >
              Empowering e-commerce growth through seamless shipping comparisons
              and innovative technology. We bridge the gap between businesses
              and global markets.
            </p>

            {/* CTA Buttons */}
            <div
              className="
            flex flex-col sm:flex-row
            gap-3 sm:gap-4
            w-full sm:w-auto
          "
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  document.getElementById("impact")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="group w-full sm:w-auto"
              >
                View Our Impact
                <span className="group-hover:translate-x-1 transition-transform">
                  <ArrowIcon />
                </span>
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  document.getElementById("partners")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="w-full sm:w-auto"
              >
                Partner with Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
