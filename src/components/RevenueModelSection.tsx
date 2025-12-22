import { motion } from 'framer-motion';
import { Plane, Repeat, Database, Sprout, Tractor, Landmark } from 'lucide-react';

const revenueStreams = [
  {
    icon: Plane,
    channel: 'Drone & GIS Services',
    description: 'Precision mapping and farm digitization',
    type: 'Per-acre',
  },
  {
    icon: Repeat,
    channel: 'SaaS Subscriptions',
    description: 'Platform access for FPOs, banks, insurers',
    type: 'Recurring',
  },
  {
    icon: Database,
    channel: 'Data Licensing',
    description: 'API-based insights for B2B partners',
    type: 'Annual',
  },
  {
    icon: Sprout,
    channel: 'Crop Advisory Services',
    description: 'Subscription and sponsored content',
    type: 'Monthly / Annual',
  },
  {
    icon: Tractor,
    channel: 'Mechanization Marketplace',
    description: 'Partner commissions and referrals',
    type: 'Transactional',
  },
  {
    icon: Landmark,
    channel: 'Government & CSR Projects',
    description: 'Program digitization contracts',
    type: 'Project-based',
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
            💰 Revenue Model
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Sustainable Business Model
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Multiple revenue streams ensuring long-term growth and value creation
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {revenueStreams.map((stream, index) => (
            <motion.div
              key={stream.channel}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-gradient rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <stream.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-semibold mb-1">{stream.channel}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{stream.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground/70">Type:</span>
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                      {stream.type}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RevenueModelSection;
