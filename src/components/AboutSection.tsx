import { motion } from 'framer-motion';
import { Crosshair, Telescope, History, UsersRound } from 'lucide-react';

const teamRoles = [
  { icon: '🧑‍🌾', title: 'Agronomists', description: 'Guiding farmers toward precision cultivation' },
  { icon: '🛰️', title: 'GIS & UAV Specialists', description: 'Capturing and processing spatial data with accuracy' },
  { icon: '💻', title: 'Software & Data Engineers', description: 'Building scalable, secure SaaS infrastructure' },
  { icon: '💼', title: 'Financial & Policy Experts', description: 'Enabling access to credit, insurance, and markets' },
];

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

        <div className="grid md:grid-cols-2 gap-8 mb-16">
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
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
              <Telescope className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To empower every farmer with the intelligence to cultivate smarter, connect better, and grow sustainably.
            </p>
          </motion.div>
        </div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-gradient rounded-2xl p-8 border border-border/50 mb-16"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <History className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold mb-3">Our Story</h3>
              <p className="text-muted-foreground leading-relaxed">
                BhoomiGraph Technologies was founded to solve one of India's deepest challenges — fragmented and underutilized agricultural data. Despite the availability of drones, satellites, and IoT devices, farmers and institutions rarely benefit from unified insights. We bridge this gap by building a Data Intelligence Layer — connecting ground data with cloud analytics to serve farmers, banks, insurers, and policymakers alike.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <UsersRound className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-display font-semibold">Our Team</h3>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            BhoomiGraph brings together domain experts from across agriculture and technology:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamRoles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-colors"
              >
                <span className="text-4xl mb-4 block">{role.icon}</span>
                <h4 className="font-semibold mb-2">{role.title}</h4>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
