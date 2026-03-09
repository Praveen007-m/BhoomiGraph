import { motion } from "framer-motion";
import { ArrowRight, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedCounter from "./AnimatedCounter";
import heroImage from "@/assets/hero-farm.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
    >
      {/* Background Image */}
      <div className="absolute right-0 top-0 w-full lg:w-3/5 h-full z-0">
        <img
          src={heroImage}
          alt="Aerial view of agricultural farmland with drone"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent lg:hidden" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              AI-Powered Precision Agriculture
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6"
          >
            Empowering Every Acre with{" "}
            <span className="text-gradient">
              Data-Driven Intelligence
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
          >
            BhoomiGraph turns raw agricultural data into actionable intelligence.
            Our integrated SaaS platform brings together farmers, FPOs,
            banks, insurers, and agri-enterprises to create smarter,
            more resilient, and profitable farms.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-6"
          >
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate("/dashboard")}
            >
              Explore Platform
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              variant="heroOutline"
              size="xl"
              onClick={() => navigate("/auth")}
            >
              <Handshake className="w-5 h-5 mr-2" />
              Partner With Us
            </Button>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground"
          >
            Farm data. Financial access. Future-ready agriculture.
          </motion.p>
        </div>

        {/* Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-16 lg:mt-24 pb-8"
        >
          <AnimatedCounter end={10000} suffix="+" label="Acres Digitized" />
          <AnimatedCounter end={5} suffix="+" label="Indian States Operational" />
          <AnimatedCounter end={25} suffix="+" label="Institutional Partners" />
          <AnimatedCounter
            end={2.5}
            suffix=" Cr+"
            prefix="₹"
            label="Value Enabled for Farmers"
            decimals={1}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
