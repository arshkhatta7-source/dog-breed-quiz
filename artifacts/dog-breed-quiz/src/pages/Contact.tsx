import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSEO } from "../hooks/useSEO";
import { CheckCircle2 } from "lucide-react";

export default function Contact() {
  useSEO({
    title: "Contact Us | DogBreedQuiz",
    description: "Have a question, suggestion, or feedback about DogBreedQuiz? Get in touch with our team.",
    canonical: "/contact",
  });

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.message.trim() || form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <nav className="text-sm text-muted-foreground mb-8 flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <span className="text-foreground">Contact</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">Contact Us</h1>
          <p className="text-lg text-muted-foreground mb-10">
            Have a question, feedback, or a breed suggestion? We'd love to hear from you.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border-2 border-green-200 rounded-2xl p-10 text-center"
              data-testid="contact-success"
            >
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold font-serif text-foreground mb-2">Message received!</h2>
              <p className="text-muted-foreground mb-6">
                Thanks for reaching out. We'll get back to you as soon as possible.
              </p>
              <Button asChild className="rounded-full px-8">
                <Link href="/">Back to Homepage</Link>
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6" data-testid="contact-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-semibold text-foreground mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="contact-name"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Jane Smith"
                    className={errors.name ? "border-red-400 focus-visible:ring-red-300" : ""}
                    data-testid="contact-input-name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-foreground mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="jane@example.com"
                    className={errors.email ? "border-red-400 focus-visible:ring-red-300" : ""}
                    data-testid="contact-input-email"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-sm font-semibold text-foreground mb-1.5">
                  Subject
                </label>
                <select
                  id="contact-subject"
                  value={form.subject}
                  onChange={set("subject")}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="contact-input-subject"
                >
                  <option value="">Select a subject...</option>
                  <option value="general">General Question</option>
                  <option value="feedback">Feedback or Suggestion</option>
                  <option value="breed">Breed Information</option>
                  <option value="quiz">Quiz Question</option>
                  <option value="bug">Report a Problem</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-semibold text-foreground mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={set("message")}
                  rows={5}
                  placeholder="Tell us what's on your mind..."
                  className={`w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring resize-y ${
                    errors.message ? "border-red-400 focus:ring-red-300" : "border-input"
                  }`}
                  data-testid="contact-input-message"
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              <Button type="submit" size="lg" className="w-full rounded-full" data-testid="contact-btn-submit">
                Send Message
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
