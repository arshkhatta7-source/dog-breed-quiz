import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Nav } from "@/components/Nav";
import { CookieBanner } from "@/components/CookieBanner";
import { CompareProvider } from "@/context/CompareContext";

import Home from "@/pages/Home";
import Quiz from "@/pages/Quiz";
import Results from "@/pages/Results";
import BreedDetail from "@/pages/BreedDetail";
import About from "@/pages/About";
import BrowseBreeds from "@/pages/BrowseBreeds";
import Compare from "@/pages/Compare";
import Privacy from "@/pages/Privacy";
import Contact from "@/pages/Contact";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/results" component={Results} />
          <Route path="/breed/:breedSlug" component={BreedDetail} />
          <Route path="/about" component={About} />
          <Route path="/browse" component={BrowseBreeds} />
          <Route path="/compare" component={Compare} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <CookieBanner />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <CompareProvider>
            <Router />
          </CompareProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
