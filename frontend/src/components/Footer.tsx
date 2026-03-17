import { Leaf, Linkedin, Youtube, Twitter } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      const element = document.querySelector("#home");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");
    }
  };

  return (
    <footer className="py-12 bg-[hsl(140,50%,12%)] text-white border-t border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <img
                src="/logo.png"
                alt="LOEMS Logo"
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-display font-bold tracking-wide">
                  LOEM'S
                </span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-wide hidden md:block">
                  Land · Output · Earnings · Market · Support
                </span>
              </div>
            </div>

            <p className="text-sm text-white/70">
              Digital Infrastructure for Agriculture
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary/30 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary/30 transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary/30 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-sm text-white/60">
            © 2025 LOEMS Technologies Pvt. Ltd. | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
