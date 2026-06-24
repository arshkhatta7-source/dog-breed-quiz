import { motion } from "framer-motion";
import { Link } from "wouter";
import { useSEO } from "../hooks/useSEO";

export default function Privacy() {
  useSEO({
    title: "Privacy Policy | DogBreedQuiz",
    description: "DogBreedQuiz privacy policy — how we collect, use, and protect your data, cookies, and advertising.",
    canonical: "/privacy",
  });

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <nav className="text-sm text-muted-foreground mb-8 flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>›</span>
          <span className="text-foreground">Privacy Policy</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-10">Last updated: June 2026</p>

          <div className="space-y-10 text-muted-foreground leading-relaxed">

            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-3">1. Introduction</h2>
              <p>
                Welcome to DogBreedQuiz ("we," "us," or "our"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website at{" "}
                <a href="https://dogbreedquiz.replit.app" className="text-primary hover:underline">
                  dogbreedquiz.replit.app
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-3">2. Information We Collect</h2>
              <p className="mb-3">
                DogBreedQuiz is a free, fully client-side quiz tool. We do <strong>not</strong> require you to create an account or submit any personal identifying information to use the quiz.
              </p>
              <h3 className="text-lg font-semibold text-foreground mb-2">Quiz Answers</h3>
              <p className="mb-3">
                Your quiz answers are stored temporarily in your browser's session storage and are never transmitted to our servers. They are automatically deleted when you close your browser tab.
              </p>
              <h3 className="text-lg font-semibold text-foreground mb-2">Automatically Collected Information</h3>
              <p>
                When you visit our site, we may automatically collect certain technical information such as your IP address, browser type, operating system, referring URLs, and pages visited. This information is collected through third-party analytics tools (see Section 4).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-3">3. Cookies</h2>
              <p className="mb-3">
                We use cookies and similar tracking technologies to improve your experience on our site. A cookie is a small data file placed on your device.
              </p>
              <h3 className="text-lg font-semibold text-foreground mb-2">Types of Cookies We Use</h3>
              <ul className="list-disc list-inside space-y-2 mb-3">
                <li><strong>Essential cookies:</strong> Required for basic site functionality, such as remembering your cookie consent preference.</li>
                <li><strong>Analytics cookies:</strong> Used by Google Analytics to understand how visitors use our site (pages visited, time on site, etc.). This data is anonymized and aggregated.</li>
                <li><strong>Advertising cookies:</strong> If Google AdSense is enabled, Google may use cookies to show you personalized advertisements based on your interests and browsing history.</li>
              </ul>
              <p>
                You can control cookies through your browser settings. Declining cookies will not prevent you from using DogBreedQuiz, but some features may work differently.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-3">4. Analytics and Advertising</h2>
              <h3 className="text-lg font-semibold text-foreground mb-2">Google Analytics</h3>
              <p className="mb-3">
                We use Google Analytics 4 to analyze website traffic and improve our content. Google Analytics collects anonymized usage data. You can opt out using the{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Google Analytics Opt-out Browser Add-on
                </a>.
              </p>
              <h3 className="text-lg font-semibold text-foreground mb-2">Google AdSense</h3>
              <p>
                We may display advertisements served by Google AdSense. Google uses cookies to serve ads based on your prior visits to our site and other websites. You can opt out of personalized advertising by visiting{" "}
                <a href="https://www.google.com/settings/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Google Ad Settings
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-3">5. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To operate and maintain DogBreedQuiz</li>
                <li>To improve site performance and user experience</li>
                <li>To analyze usage patterns and popular content</li>
                <li>To display relevant advertisements</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-3">6. Third-Party Services</h2>
              <p>
                Our site may contain links to third-party websites. We are not responsible for the privacy practices of those sites. We encourage you to read their privacy policies. Third-party services we use include: Google Analytics, Google AdSense, and Google Fonts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-3">7. Data Retention</h2>
              <p>
                We retain analytics data in aggregated, anonymized form. Quiz answers stored in session storage are deleted automatically when the browser session ends. Cookie consent preferences stored in localStorage persist until you clear your browser data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-3">8. Your Rights</h2>
              <p className="mb-3">Depending on your location, you may have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request deletion of your personal data</li>
                <li>Opt out of data collection for advertising purposes</li>
                <li>Lodge a complaint with a supervisory authority (EU/UK residents)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-3">9. Children's Privacy</h2>
              <p>
                DogBreedQuiz is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last updated" date at the top of this page. Your continued use of DogBreedQuiz after changes are posted constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-3">11. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please use our{" "}
                <Link href="/contact" className="text-primary hover:underline">contact form</Link>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
