import { motion } from 'framer-motion';
import { Database, Sprout, Wallet } from 'lucide-react';

const focusAreas = [
  {
    icon: Database,
    title: 'Farm Data Intelligence',
    description: 'Unified data from drones, satellites, and sensors — processed into high-resolution insights for precision agriculture.',
    color: 'primary',
  },
  {
    icon: Sprout,
    title: 'Agronomy & Crop Advisory',
    description: 'Personalized recommendations from our agronomy engine to improve yield, optimize inputs, and build climate resilience.',
    color: 'accent',
  },
  {
    icon: Wallet,
    title: 'Financial & Insurance Access',
    description: 'Verified data powering instant access to loans, credit, and crop insurance.',
    color: 'secondary',
  },
];

const CoreFocusSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Core Focus</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Building India's most trusted agri-data ecosystem through three interconnected pillars
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {focusAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="card-gradient rounded-2xl p-8 h-full border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className={`w-14 h-14 rounded-xl bg-${area.color}/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <area.icon className={`w-7 h-7 text-${area.color}`} />
                </div>
                <h3 className="text-xl font-display font-semibold mb-4">{area.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{area.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreFocusSection;
