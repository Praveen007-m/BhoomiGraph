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
            className="card-mission rounded-2xl p-8 border border-primary/20 min-h-[220px] shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/30 flex items-center justify-center mb-4">
              <Crosshair className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3 text-foreground">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To create India's most trusted agri-data ecosystem — improving productivity, profitability, and sustainability through data-driven decisions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-vision rounded-2xl p-8 border border-secondary/20 min-h-[220px] shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/30 flex items-center justify-center mb-4">
              <Telescope className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3 text-foreground">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To empower every farmer with the intelligence to cultivate smarter, connect better, and grow sustainably.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card-story rounded-2xl p-8 border border-orange-300/40 min-h-[220px] shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-400/30 flex items-center justify-center mb-4">
              <History className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3 text-foreground">Our Story</h3>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>BhoomiGraph Technologies was founded to solve one of India's deepest challenges — fragmented and underutilized agricultural data.</p>
              <p>Despite the availability of drones, satellites, and IoT devices, farmers and institutions rarely benefit from unified insights.</p>
              <p>We bridge this gap by building a <span className="font-semibold text-foreground">Data Intelligence Layer</span> — connecting ground data with cloud analytics to serve farmers, banks, insurers, and policymakers alike.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="card-team rounded-2xl p-8 border border-purple-300/40 min-h-[220px] shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-400/30 flex items-center justify-center mb-4">
              <UsersRound className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3 text-foreground">Our Team</h3>
            <div className="text-muted-foreground leading-relaxed space-y-2">
              <p>BhoomiGraph brings together domain experts from across agriculture and technology:</p>
              <p><span className="text-lg">🧑‍🌾</span> <span className="font-semibold text-foreground">Agronomists</span> — Guiding farmers toward precision cultivation.</p>
              <p><span className="text-lg">🛰️</span> <span className="font-semibold text-foreground">GIS & UAV Specialists</span> — Capturing and processing spatial data with accuracy.</p>
              <p><span className="text-lg">💻</span> <span className="font-semibold text-foreground">Software & Data Engineers</span> — Building scalable, secure SaaS infrastructure.</p>
              <p><span className="text-lg">💼</span> <span className="font-semibold text-foreground">Financial & Policy Experts</span> — Enabling access to credit, insurance, and markets.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
