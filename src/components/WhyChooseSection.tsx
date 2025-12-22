import { motion } from 'framer-motion';
import { Satellite, BrainCircuit, Plug, Server, Leaf, BadgeCheck } from 'lucide-react';

const features = [
  {
    icon: Satellite,
    title: 'Data from Ground + Space',
    description: '360° farm visibility with integrated drone, satellite, and sensor data',
  },
  {
    icon: BrainCircuit,
    title: 'AI-Driven Insights',
    description: 'Machine learning models validated by expert agronomists',
  },
  {
    icon: Plug,
    title: 'Seamless API Integration',
    description: 'Connect with banks, insurers, and enterprise systems effortlessly',
  },
  {
    icon: Server,
    title: 'Scalable SaaS Platform',
    description: 'Built for multi-stakeholder use from small farms to enterprises',
  },
  {
    icon: Leaf,
    title: 'Sustainable & Climate-Aligned',
    description: 'Farmer-first approach promoting climate-smart agriculture',
  },
];

const WhyChooseSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Why Choose <span className="text-gradient">FarmOS</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We combine cutting-edge technology with deep agricultural expertise to deliver solutions that transform farming operations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="card-gradient rounded-3xl p-8 border border-border/50">
            <div className="flex items-center justify-center gap-3 mb-6">
              <BadgeCheck className="w-6 h-6 text-primary" />
              <span className="font-display font-semibold">Trusted By Industry Leaders</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground text-xs"
                >
                  Partner {i + 1}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-6 text-center">
              Government programs, FPOs, and financial partners
            </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
