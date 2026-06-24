import { Link, useLocation } from "wouter";
import { Menu, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCompare } from "../context/CompareContext";

export function Nav() {
  const [location] = useLocation();
  const { compareIds } = useCompare();

  const links = [
    { href: "/", label: "Home" },
    { href: "/quiz", label: "Take Quiz" },
    { href: "/browse", label: "Browse Breeds" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
        <Link href="/" className="font-sans font-bold text-xl tracking-tight text-primary flex items-center gap-2" data-testid="nav-logo">
          DogBreedQuiz
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}
              data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {link.label}
            </Link>
          ))}

          {compareIds.length > 0 && (
            <Link
              href="/compare"
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
              data-testid="nav-link-compare"
            >
              <GitCompareArrows className="h-4 w-4" />
              Compare
              <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {compareIds.length}
              </span>
            </Link>
          )}

          <Button asChild variant="default" className="rounded-full px-6 shadow-sm" data-testid="nav-btn-start">
            <Link href="/quiz">Find My Match</Link>
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          {compareIds.length > 0 && (
            <Link href="/compare" data-testid="nav-mobile-compare">
              <div className="relative p-2">
                <GitCompareArrows className="h-5 w-5 text-primary" />
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {compareIds.length}
                </span>
              </div>
            </Link>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="nav-mobile-trigger">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-6 mt-8">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-lg font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {link.label}
                  </Link>
                ))}
                {compareIds.length > 0 && (
                  <Link href="/compare" className="text-lg font-medium text-primary flex items-center gap-2">
                    <GitCompareArrows className="h-5 w-5" />
                    Compare ({compareIds.length})
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
