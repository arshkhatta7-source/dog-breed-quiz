import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "dbq_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 220 }}
          className="fixed bottom-4 left-4 right-4 z-[100] max-w-xl mx-auto"
          role="dialog"
          aria-label="Cookie consent"
          data-testid="cookie-banner"
        >
          <div className="bg-card border-2 border-border rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="shrink-0 bg-primary/10 rounded-full p-2.5">
              <Cookie className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground mb-0.5">We use cookies</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We use cookies to improve your experience and show relevant ads.{" "}
                <Link href="/privacy" className="underline text-primary hover:opacity-80">
                  Privacy Policy
                </Link>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDecline}
                className="flex-1 sm:flex-none rounded-full"
                data-testid="cookie-decline"
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="flex-1 sm:flex-none rounded-full"
                data-testid="cookie-accept"
              >
                Accept
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
