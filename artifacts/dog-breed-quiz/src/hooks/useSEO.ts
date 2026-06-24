import { useEffect } from "react";

interface SEOOptions {
  title: string;
  description: string;
  canonical?: string;
  schema?: object;
}

const BASE_URL = "https://dogbreedquiz.replit.app";

export function useSEO({ title, description, canonical, schema }: SEOOptions) {
  useEffect(() => {
    document.title = title;

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    const canonicalHref = canonical ? `${BASE_URL}${canonical}` : `${BASE_URL}${window.location.pathname}`;
    setLink("canonical", canonicalHref);
    setMeta("property", "og:url", canonicalHref);

    if (schema) {
      const existing = document.getElementById("__schema_ld");
      if (existing) existing.remove();
      const script = document.createElement("script");
      script.id = "__schema_ld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const schemaEl = document.getElementById("__schema_ld");
      if (schemaEl) schemaEl.remove();
    };
  }, [title, description, canonical, schema]);
}

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
