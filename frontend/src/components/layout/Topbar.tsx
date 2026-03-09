import { useNavigate } from "react-router-dom";
import { Leaf, User, LogOut, Wallet } from "lucide-react";
import { authService } from "@/services/auth";
import { useEffect, useState } from "react";
import { useWallet } from "@/contexts/WalletContext";

export function Topbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const { balance } = useWallet();
  const [open, setOpen] = useState(false);

  // ✅ REQUIREMENT 4: Watch for auth state changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const currentUser = authService.getCurrentUser();
      setIsLoggedIn(!!token && !!currentUser);
      setUser(currentUser);
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

  // ✅ REQUIREMENT 3: Navigate to role-based dashboard
  const goToDashboard = () => {
    const userData = user || authService.getCurrentUser();
    const role = userData?.role?.toLowerCase();
    
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "farmer":
        navigate("/farmer");
        break;
      case "pilot":
        navigate("/pilot");
        break;
      case "agronomist":
        navigate("/agronomist");
        break;
      default:
        navigate("/");
    }
    setOpen(false);
  };

  const handleLogout = () => {
    // ✅ FIX: Clear auth state first, then navigate to /auth (not /login)
    authService.logout();
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("auth-change"));
    navigate("/auth", { replace: true });
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* ✅ Logo Section */}
        <div
          onClick={() => navigate("/")}   // 👈 GO TO HOME
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <Leaf className="text-white h-5 w-5" />
          </div>

          <span className="font-display text-xl font-semibold tracking-tight">
            Bhoomi<span className="text-primary">Graph</span>
          </span>
        </div>

        {/* ✅ Right Section */}
        <div className="flex items-center gap-4 relative">

          {/* ✅ REQUIREMENT 2: Auth State Button */}
          {/* If NOT logged in - Show Sign In button */}
          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/auth")}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium"
            >
              Sign In
            </button>
          ) : (
            <>
              {/* Wallet - Only show when logged in */}
              <div
                onClick={() => navigate("/payments")}
                className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-green-100 transition"
              >
                <Wallet className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  ₹ {balance.toFixed(2)}
                </span>
              </div>

              {/* ✅ REQUIREMENT 3: Profile Button - Navigate to dashboard */}
              <div className="relative">
                <div
                  onClick={goToDashboard}
                  className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-muted transition"
                  title="Go to Dashboard"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{user?.name}</span>
                </div>

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg py-2">

                    <div
                      onClick={() => {
                        navigate("/profile");
                        setOpen(false);
                      }}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      Profile
                    </div>

                    <div
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </div>

                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}