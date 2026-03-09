import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Monitor, FileText, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ContactSection = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    // Replace with real brochure file path later
    const link = document.createElement("a");
    link.href = "/brochure.pdf";
    link.download = "BhoomiGraph-Brochure.pdf";
    link.click();
  };

  return (
    <section id="contact" className="py-24 section-green">
      <div className="container mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Let's Build the Future of Agriculture Together
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            For partnerships, pilots, or collaborations — we'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="card-gradient rounded-2xl p-8 border border-border/50 h-full">
              <h3 className="text-xl font-display font-semibold mb-6">
                Get in Touch
              </h3>

              <div className="space-y-6">

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Head Office</h4>
                    <p className="text-muted-foreground text-sm">
                      BhoomiGraph Technologies Pvt. Ltd.<br />
                      Bangalore, Karnataka, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        Partnerships:{" "}
                        <a href="mailto:partners@bhoomigraph.com" className="text-primary hover:underline">
                          partners@bhoomigraph.com
                        </a>
                      </p>
                      <p>
                        Investments:{" "}
                        <a href="mailto:invest@bhoomigraph.com" className="text-primary hover:underline">
                          invest@bhoomigraph.com
                        </a>
                      </p>
                      <p>
                        General:{" "}
                        <a href="mailto:hello@bhoomigraph.com" className="text-primary hover:underline">
                          hello@bhoomigraph.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-muted-foreground text-sm">
                      +91 80 1234 5678
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* CTA Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >

            {/* Request Demo */}
            <div className="card-gradient rounded-xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Request a Demo</h4>
                    <p className="text-sm text-muted-foreground">
                      See BhoomiGraph in action
                    </p>
                  </div>
                </div>

                <Button onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              </div>
            </div>

            {/* Download Brochure */}
            <div className="card-gradient rounded-xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Download Brochure</h4>
                    <p className="text-sm text-muted-foreground">
                      Get our company overview
                    </p>
                  </div>
                </div>

                <Button variant="outline" onClick={handleDownload}>
                  Download
                </Button>
              </div>
            </div>

            {/* Pilot Program */}
            <div className="card-gradient rounded-xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Join Our Pilot Program</h4>
                    <p className="text-sm text-muted-foreground">
                      Be part of the revolution
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate("/auth")}
                >
                  Apply Now
                </Button>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
