import { motion } from 'framer-motion';
import { Tractor, Landmark, ShieldCheck, Building, Package } from 'lucide-react';

const industries = [
  {
    icon: Tractor,
    stakeholder: 'Farmers & FPOs',
    value: 'Farm visibility, crop advisory, and direct financial linkages',
  },
  {
    icon: Landmark,
    stakeholder: 'Banks & NBFCs',
    value: 'Verified data for accurate risk scoring and faster loan approvals',
  },
  {
    icon: ShieldCheck,
    stakeholder: 'Insurance Companies',
    value: 'Satellite + ground data for real-time claim validation',
  },
  {
    icon: Building,
    stakeholder: 'Government & CSR Bodies',
    value: 'Data-driven monitoring and impact assessment tools',
  },
  {
    icon: Package,
    stakeholder: 'Agri-Businesses & Exporters',
    value: 'Input optimization, yield traceability, and sustainability insights',
  },
];

const IndustriesSection = () => {
  return (
    <section id="industries" className="py-24 section-green">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            Industries We Serve
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Multi-Stakeholder Value
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform creates value across the entire agricultural ecosystem
          </p>
        </motion.div>

        <div className="grid gap-4">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.stakeholder}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="card-gradient rounded-xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4 md:w-1/3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <industry.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold">{industry.stakeholder}</h3>
                </div>
                <p className="text-muted-foreground md:w-2/3">{industry.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
