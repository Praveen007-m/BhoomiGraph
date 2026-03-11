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
    stakeholder: 'Banks & Insurance',
    value: 'Verified data for accurate risk scoring and faster loan approvals',
  },
  {
    icon: Building,
    stakeholder: 'Government Agencies',
    value: 'Data-driven monitoring and impact assessment tools',
  },
  {
    icon: Package,
    stakeholder: 'Buyers & Exporters',
    value: 'Sourcing intelligence, traceability, and market connectivity',
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
            Who We Serve
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            LOEMS Ecosystem Partners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform creates value across the entire agricultural ecosystem
          </p>
        </motion.div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.stakeholder}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="card-gradient rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 h-full flex flex-col items-center text-center hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <industry.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-3">{industry.stakeholder}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{industry.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
