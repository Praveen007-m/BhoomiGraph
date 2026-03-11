import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Platform", href: "#platform" },
  { label: "Architecture", href: "#architecture" },
  { label: "Industries", href: "#industries" },
  { label: "Impact", href: "#impact" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // ✅ REQUIREMENT 4: Watch for auth state changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const currentUser = authService.getCurrentUser();
      setIsLoggedIn(!!token && !!currentUser);
    };

    // Check auth state on mount
    checkAuth();

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "user") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Custom event for same-tab updates
    const handleAuthChange = () => checkAuth();
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  // ✅ REQUIREMENT 2: Dashboard button navigation logic
  const handleDashboard = () => {
    const token = localStorage.getItem("token");
    const user = authService.getCurrentUser();
    const role = user?.role?.toLowerCase();

    if (!token) {
      navigate("/auth");
      return;
    }

    switch (role) {
      case "farmer":
        navigate("/farmer");
        break;
      case "admin":
        navigate("/admin");
        break;
      case "pilot":
        navigate("/pilot");
        break;
      case "agronomist":
        navigate("/agronomist");
        break;
      default:
        navigate("/auth");
    }
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold">
              LOEMS
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* ✅ REQUIREMENT 4: Sign In button - only show when NOT logged in */}
            {!isLoggedIn && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
            )}

            {/* ✅ REQUIREMENT 1 & 2: Dashboard button - ALWAYS visible with smart navigation */}
            <Button
              size="sm"
              onClick={handleDashboard}
            >
              Dashboard
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">

              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="text-left py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ))}

              <div className="flex gap-3 pt-4 border-t border-border">
                {/* ✅ REQUIREMENT 4: Sign In button - only show when NOT logged in - Mobile */}
                {!isLoggedIn && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      navigate("/auth");
                      setIsOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                )}

                {/* ✅ REQUIREMENT 1 & 2: Dashboard button - ALWAYS visible with smart navigation - Mobile */}
                <Button
                  className="flex-1"
                  onClick={() => {
                    handleDashboard();
                    setIsOpen(false);
                  }}
                >
                  Dashboard
                </Button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
