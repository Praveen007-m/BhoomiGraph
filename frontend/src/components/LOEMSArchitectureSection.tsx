import { motion } from "framer-motion";
import { MapPin, HeartPulse, TrendingUp, Store, Users, ArrowRight } from "lucide-react";

const pillars = [
  {
    id: "LAND",
    title: "LAND",
    subtitle: "Digital Farm Infrastructure",
    icon: MapPin,
    color: "from-emerald-500 to-teal-600",
    features: [
      "Farm boundary mapping",
      "Satellite monitoring",
      "Drone mapping",
      "GIS validation",
      "Digital farm passport",
    ],
  },
  {
    id: "OUTPUT",
    title: "OUTPUT",
    subtitle: "Intelligent Farm Operations",
    icon: HeartPulse,
    color: "from-blue-500 to-cyan-600",
    features: [
      "NDVI crop monitoring",
      "Weather insights",
      "IoT sensors",
      "Agronomist advisory",
      "Drone services",
    ],
  },
  {
    id: "EARNINGS",
    title: "EARNINGS",
    subtitle: "Farm Economics & Financial Intelligence",
    icon: TrendingUp,
    color: "from-amber-500 to-orange-600",
    features: [
      "Yield forecasting",
      "Productivity analytics",
      "Financial-grade farm data",
      "Loan & insurance enablement",
    ],
  },
  {
    id: "MARKET",
    title: "MARKET",
    subtitle: "Connected Agricultural Marketplace",
    icon: Store,
    color: "from-violet-500 to-purple-600",
    features: [
      "Buyer integration",
      "Export market linkage",
      "Pricing intelligence",
      "Supply chain traceability",
    ],
  },
  {
    id: "SUPPORT",
    title: "SUPPORT",
    subtitle: "Ecosystem Support & Services",
    icon: Users,
    color: "from-rose-500 to-pink-600",
    features: [
      "Agronomist advisory",
      "Government schemes",
      "Insurance integration",
      "Financial institutions",
      "Mechanization services",
    ],
  },
];

const LOEMSArchitectureSection = () => {
  return (
    <section id="architecture" className="py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            Platform Architecture
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            LOEMS Digital Infrastructure
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A unified ecosystem connecting verified land, intelligent operations, financial access, and market reach — transforming farms into digital, finance-ready assets.
          </p>
        </motion.div>

        {/* Architecture Flow - Horizontal on Desktop, Vertical on Mobile */}
        <div className="relative">
          {/* Connection Line (Desktop only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 via-amber-500 via-violet-500 to-rose-500 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                {/* Pillar Card */}
                <div className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col">
                  {/* Icon Header */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <pillar.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-display font-bold text-primary">{pillar.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{pillar.subtitle}</p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2 flex-grow">
                    {pillar.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Arrow Connector (Desktop) */}
                  {index < pillars.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                      <div className="w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Flow Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-muted-foreground">
            <span className="font-semibold text-primary">LAND</span>
            <span className="mx-2">→</span>
            <span className="font-semibold text-blue-600">OUTPUT</span>
            <span className="mx-2">→</span>
            <span className="font-semibold text-amber-600">EARNINGS</span>
            <span className="mx-2">→</span>
            <span className="font-semibold text-violet-600">MARKET</span>
            <span className="mx-2">→</span>
            <span className="font-semibold text-rose-600">SUPPORT</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            From digital farm identity to market access — complete agricultural value chain
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-primary to-emerald-600 text-white font-semibold hover:from-primary/90 hover:to-emerald-600/90 transition-all shadow-lg shadow-primary/25"
          >
            Explore the LOEMS Ecosystem
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default LOEMSArchitectureSection;

