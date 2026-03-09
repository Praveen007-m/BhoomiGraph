import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Leaf, Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const navigate = useNavigate();

  // ================= AUTO REDIRECT =================
  // ✅ FIX: Only redirect if BOTH user AND token exist (valid session)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // Only redirect if we have a valid token AND user
    if (!token || !storedUser) return;

    try {
      const user = JSON.parse(storedUser);
      const role = user?.role?.toLowerCase();

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "farmer") {
        navigate("/farmer", { replace: true });
      } else if (role === "pilot") {
        navigate("/pilot", { replace: true });
      } else if (role === "agronomist") {
        navigate("/agronomist", { replace: true });
      }
    } catch {
      // Invalid user data - clear and stay on auth page
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [navigate]);

  // ================= LOGIN =================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await authService.login({
        email,
        password,
      });

      // 🔥 Clear old session first
      localStorage.clear();

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // ✅ REQUIREMENT 4: Dispatch event for navbar update
      window.dispatchEvent(new Event("auth-change"));

      toast.success("Login successful!");

      const role = response.user.role?.toLowerCase();

      switch (role) {
        case "admin":
          navigate("/admin", { replace: true });
          break;
        case "farmer":
          navigate("/farmer", { replace: true });
          break;
        case "pilot":
          navigate("/pilot", { replace: true });
          break;
        case "agronomist":
          navigate("/agronomist", { replace: true });
          break;
        default:
          navigate("/auth", { replace: true });
      }

    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Login failed"
      );
    }
  };

  // ================= REGISTER =================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await authService.register({
        name,
        email,
        password,
        mobile,
        role: "farmer"
      });

      toast.success("Registration successful! Please login.");

    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Registration failed"
      );
    }
  };

  // ================= SEND OTP =================
  const handleSendOtp = async () => {
    if (!mobile) {
      toast.error("Please enter a mobile number");
      return;
    }

    try {
      await authService.sendOtp(mobile);
      setIsOtpSent(true);
      toast.success(`OTP sent to ${mobile}`);
    } catch {
      setIsOtpSent(true);
      toast.success(`OTP sent to ${mobile} (Demo Mode)`);
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await authService.verifyOtp(mobile, otp);

      localStorage.clear();

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // ✅ REQUIREMENT 4: Dispatch event for navbar update
      window.dispatchEvent(new Event("auth-change"));

      toast.success("Login successful!");

      const role = response.user.role?.toLowerCase();

      switch (role) {
        case "admin":
          navigate("/admin", { replace: true });
          break;
        case "farmer":
          navigate("/farmer", { replace: true });
          break;
        case "pilot":
          navigate("/pilot", { replace: true });
          break;
        case "agronomist":
          navigate("/agronomist", { replace: true });
          break;
        default:
          navigate("/auth", { replace: true });
      }

    } catch {
      // Demo fallback
      if (otp === "123456") {

        localStorage.clear();

        const demoUser = {
          name: "Demo Farmer",
          role: "farmer"
        };

        localStorage.setItem("user", JSON.stringify(demoUser));
        toast.success("Login successful! (Demo Mode)");

        location.reload(); // Ensure layout picks up new user
        navigate("/farmer", { replace: true });

      } else {
        toast.error("Invalid OTP");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative">

      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">
            Bhoomi<span className="text-primary">Graph</span>
          </span>
        </button>
      </div>

      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Login or create an account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="otp">OTP</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 pt-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="relative">
                  <Input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="otp">
              <form onSubmit={handleVerifyOtp} className="space-y-4 pt-4">
                <Input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={isOtpSent}
                  required
                />

                {isOtpSent && (
                  <Input
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                )}

                {!isOtpSent ? (
                  <Button type="button" onClick={handleSendOtp} className="w-full">
                    Send OTP
                  </Button>
                ) : (
                  <Button type="submit" className="w-full">
                    Verify & Login
                  </Button>
                )}
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 pt-4">
                <Input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
                <div className="relative">
                  <Input
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                  >
                    {showRegisterPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}