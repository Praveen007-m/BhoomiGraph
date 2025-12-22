import { motion } from 'framer-motion';
import { Repeat, CreditCard, Handshake, Award } from 'lucide-react';

const revenueStreams = [
  {
    icon: Repeat,
    title: 'SaaS Subscriptions',
    description: 'Tiered plans for farmers, FPOs, and enterprises with monthly/annual billing',
  },
  {
    icon: CreditCard,
    title: 'Pay-per-Use Data Services',
    description: 'Credit-based access for satellite imagery, drone surveys, and soil reports',
  },
  {
    icon: Handshake,
    title: 'B2B Partnerships',
    description: 'Custom integrations for banks, insurers, and government departments',
  },
  {
    icon: Award,
    title: 'Licensing & White-Label',
    description: 'Platform licensing for agri-corporates and international markets',
  },
];

const RevenueModelSection = () => {
  return (
    <section id="revenue" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            Revenue Model
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Sustainable Business Model
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Multiple revenue streams ensuring long-term growth and value creation
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {revenueStreams.map((stream, index) => (
            <motion.div
              key={stream.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-gradient rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <stream.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">{stream.title}</h3>
              <p className="text-sm text-muted-foreground">{stream.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RevenueModelSection;
