import { motion } from 'framer-motion';
import { Crosshair, Telescope, History, UsersRound } from 'lucide-react';


const AboutSection = () => {
  return (
    <section id="about" className="py-24 section-green">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Our Mission & Vision
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-gradient rounded-2xl p-8 border border-border/50"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
              <Crosshair className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To create India's most trusted agri-data ecosystem — improving productivity, profitability, and sustainability through data-driven decisions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-gradient rounded-2xl p-8 border border-border/50"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
              <Telescope className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To empower every farmer with the intelligence to cultivate smarter, connect better, and grow sustainably.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card-gradient rounded-2xl p-8 border border-border/50"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
              <History className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">Our Story</h3>
            <p className="text-muted-foreground leading-relaxed">
              FarmOS Technologies was founded to solve one of India's deepest challenges — fragmented and underutilized agricultural data. We bridge this gap by building a Data Intelligence Layer — connecting ground data with cloud analytics to serve farmers, banks, insurers, and policymakers alike.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="card-gradient rounded-2xl p-8 border border-border/50"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
              <UsersRound className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">Our Team</h3>
            <p className="text-muted-foreground leading-relaxed">
              FarmOS brings together domain experts — agronomists, GIS & UAV specialists, software & data engineers, and financial & policy experts — working together to transform agriculture.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
