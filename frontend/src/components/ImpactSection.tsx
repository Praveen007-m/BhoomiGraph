import { motion } from "framer-motion";
import { IndianRupee, TreePine, Users } from "lucide-react";

const impactAreas = [
  {
    icon: IndianRupee,
    title: "Economic",
    color: "primary",
    points: [
      "Boosts average farmer income by 20–30% through advisory and financial access",
      "Reduces insurance and loan approval times by 50%",
      "Enables transparent data flow across the agri value chain",
    ],
  },
  {
    icon: TreePine,
    title: "Environmental",
    color: "accent",
    points: [
      "Precision irrigation and input optimization reduce wastage and emissions",
      "Encourages climate-smart agriculture through monitoring and early alerts",
    ],
  },
  {
    icon: Users,
    title: "Social",
    color: "primary",
    points: [
      "Generates rural employment in drone operations, advisory, and data management",
      "Promotes digital inclusion for smallholder farmers",
    ],
  },
];

// SAFE Tailwind mapping
const colorStyles: Record<
  string,
  { bgLight: string; text: string; dot: string }
> = {
  primary: {
    bgLight: "bg-primary/20",
    text: "text-primary",
    dot: "bg-primary",
  },
  accent: {
    bgLight: "bg-accent/20",
    text: "text-accent",
    dot: "bg-accent",
  },
};

const ImpactSection = () => {
  return (
    <section id="impact" className="py-24">
      <div className="container mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
            Impact & Sustainability
          </span>

          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Creating Lasting Change
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform drives positive impact across economic, environmental,
            and social dimensions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {impactAreas.map((area, index) => {
            const styles = colorStyles[area.color];

            return (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="card-gradient rounded-2xl p-8 h-full border border-border/50 hover:border-primary/50 transition-all duration-300">

                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${styles.bgLight}`}
                  >
                    <area.icon className={`w-7 h-7 ${styles.text}`} />
                  </div>

                  <h3 className="text-xl font-display font-semibold mb-4">
                    {area.title}
                  </h3>

                  <ul className="space-y-3">
                    {area.points.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <span
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${styles.dot}`}
                        />
                        <span className="text-sm">{point}</span>
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

export default ImpactSection;
