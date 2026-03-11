import { motion } from 'framer-motion';
import { MapPin, HeartPulse, TrendingUp, Store, Users, ArrowRight } from 'lucide-react';

const modules = [
  {
    icon: MapPin,
    title: 'LAND',
    subtitle: 'Digital Farm Infrastructure',
    features: [
      'Farm boundary mapping and GIS validation',
      'Satellite monitoring and drone mapping',
      'Digital farm passport creation',
    ],
  },
  {
    icon: HeartPulse,
    title: 'OUTPUT',
    subtitle: 'Intelligent Farm Operations',
    features: [
      'NDVI crop health monitoring',
      'Weather insights and IoT sensors',
      'AI advisory and smart crop planning',
    ],
  },
  {
    icon: TrendingUp,
    title: 'EARNINGS',
    subtitle: 'Farm Economics & Financial Intelligence',
    features: [
      'Yield forecasting and productivity analytics',
      'Income optimization strategies',
      'Financial-grade farm data for loans & insurance',
    ],
  },
  {
    icon: Store,
    title: 'MARKET',
    subtitle: 'Connected Agricultural Marketplace',
    features: [
      'Buyer marketplace and institutional sourcing',
      'Export market connectivity',
      'Pricing intelligence and supply chain traceability',
    ],
  },
  {
    icon: Users,
    title: 'SUPPORT',
    subtitle: 'Ecosystem Support & Services',
    features: [
      'Agronomist advisory services',
      'Government schemes and insurance integration',
      'Financial institutions and mechanization services',
    ],
  },
];

const PlatformSection = () => {
  return (
    <section id="platform" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            LOEMS Platform
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Digital Infrastructure for Modern Agriculture
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive platform connecting verified land, intelligent operations, financial access, and market reach.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="card-gradient rounded-2xl p-6 h-full border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <module.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-primary">{module.title}</h3>
                    <p className="text-xs text-muted-foreground">{module.subtitle}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {module.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Platform CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Ready to transform your farm operations?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started with LOEMS
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformSection;
