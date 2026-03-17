import { motion } from "framer-motion";
import { Building2, Cpu, ShoppingCart } from "lucide-react";

const focusAreas = [
  {
    icon: Building2,
    title: "Digital Farm Infrastructure",
    bullets: [
      "Satellite & drone mapping",
      "GIS boundary validation",
      "Crop monitoring",
      "Soil intelligence",
      "Digital Farm Passport",
    ],
    color: "primary",
  },
  {
    icon: Cpu,
    title: "Intelligent Farm Operations",
    bullets: [
      "AI crop monitoring",
      "Pest & disease alerts",
      "Weather advisory",
      "Yield forecasting",
      "Farm mechanization",
    ],
    color: "accent",
  },
  {
    icon: ShoppingCart,
    title: "Connected Markets",
    bullets: [
      "B2B buyer network",
      "Export market access",
      "Demand intelligence",
      "Supply chain coordination",
      "Traceability systems",
    ],
    color: "primary",
  },
];

const colorStyles: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/20", text: "text-primary" },
  accent:  { bg: "bg-accent/20",  text: "text-accent"  },
};

const CoreFocusSection = () => {
  return (
    <section className="py-24 section-green">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Our Core Focus
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Building India's most trusted digital agriculture ecosystem
            through three interconnected pillars
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {focusAreas.map((area, index) => {
            const styles = colorStyles[area.color];

            return (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="card-gradient rounded-2xl p-8 h-full border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${styles.bg}`}
                  >
                    <area.icon className={`w-7 h-7 ${styles.text}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-display font-semibold mb-4">
                    {area.title}
                  </h3>

                  {/* Bullet list */}
                  <ul className="space-y-2">
                    {area.bullets.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-muted-foreground text-sm leading-relaxed"
                      >
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.text} bg-current`} />
                        {point}
                      </li>
                    ))}
                  </ul>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreFocusSection;