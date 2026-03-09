import { motion } from 'framer-motion';
import { MapPin, HeartPulse, Wheat, ShieldCheck, Tractor, Database } from 'lucide-react';

const modules = [
  {
    icon: MapPin,
    title: 'Farm Digitization Suite',
    features: [
      'Advanced mapping for land boundaries, elevation, and slope',
      'Multi-source data integration from drones, satellites, and field sensors',
      'GIS-based farm asset and boundary management',
    ],
  },
  {
    icon: HeartPulse,
    title: 'Farm Health Dashboard',
    features: [
      'Real-time vegetation analysis and crop health monitoring',
      'AI-based stress detection using NDVI/NDRE indices',
      'Predictive yield estimation and anomaly alerts',
    ],
  },
  {
    icon: Wheat,
    title: 'Agronomy & Advisory Hub',
    features: [
      'Expert-backed crop and input recommendations',
      'Fertilizer, nutrient, and irrigation planning',
      'Disease and pest identification with preventive measures',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Financial & Insurance Integration',
    features: [
      'Automated crop verification and land geotagging',
      'Credit-ready farmer profiles for banks and NBFCs',
      'Digital claim validation for insurers',
    ],
  },
  {
    icon: Tractor,
    title: 'Mechanization & Partner Network',
    features: [
      'Access verified partners for tractors, harvesters, and sprayers',
      'Integrated irrigation and automation service network',
      'Partnership ecosystem ensuring affordability and availability',
    ],
  },
  {
    icon: Database,
    title: 'Data Intelligence API',
    features: [
      'Secure API suite for banks, insurers, and agri-enterprises',
      'Policy analytics and yield forecasting tools for government programs',
      'Scalable integration for external platforms and startups',
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
            Our Platform
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            End-to-End SaaS Platform
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Designed to digitize every farm, monitor every crop, and connect every stakeholder in the agricultural value chain.
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
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <module.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-4">{module.title}</h3>
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
      </div>
    </section>
  );
};

export default PlatformSection;
