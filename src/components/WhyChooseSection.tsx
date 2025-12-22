import { motion } from 'framer-motion';
import { Globe, Brain, Link, Layers, Leaf, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'Data from Ground + Space',
    description: '360° farm visibility with integrated drone, satellite, and sensor data',
  },
  {
    icon: Brain,
    title: 'AI-Driven Insights',
    description: 'Machine learning models validated by expert agronomists',
  },
  {
    icon: Link,
    title: 'Seamless API Integration',
    description: 'Connect with banks, insurers, and enterprise systems effortlessly',
  },
  {
    icon: Layers,
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
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Why Choose <span className="text-gradient">BhoomiGraph</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We combine cutting-edge technology with deep agricultural expertise to deliver solutions that transform farming operations.
            </p>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="card-gradient rounded-3xl p-8 border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-primary" />
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
      </div>
    </section>
  );
};

export default WhyChooseSection;
