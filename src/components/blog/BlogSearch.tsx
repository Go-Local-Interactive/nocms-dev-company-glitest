import * as React from "react";
import { Search } from "lucide-react";

/**
 * Blog search input — submits a `q` querystring to `/blog/search`. Source:
 * storage-theme-payload `src/components/BlogSearch`. The upstream uses the
 * shared Button component; here the submit button is inline-styled to match
 * the template's primary CTA aesthetic.
 *
 * Editor contract: `data-nocms-component` only — the input is interactive,
 * not a static text leaf.
 */

interface BlogSearchProps {
  action?: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function BlogSearch({
  action = "/blog/search",
  label = "Search the blog",
  placeholder = "Search posts…",
  className = "",
}: BlogSearchProps) {
  return (
    <form
      data-nocms-component="blog-search"
      className={`w-full ${className}`}
      action={action}
      role="search"
    >
      <fieldset>
        <legend className="sr-only">{label}</legend>
        <label
          htmlFor="blog-search-input"
          className="block text-xs font-bold uppercase tracking-wide text-zinc-500 mb-2"
        >
          {label}
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"
            />
            <input
              id="blog-search-input"
              type="search"
              name="q"
              placeholder={placeholder}
              required
              className="w-full h-11 pl-9 pr-3 rounded-md border border-zinc-300 bg-white text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              aria-describedby="blog-search-help"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center bg-primary text-white font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity text-sm"
          >
            Search
          </button>
        </div>
        <span id="blog-search-help" className="sr-only">
          Search blog posts by title, content, or keywords
        </span>
      </fieldset>
    </form>
  );
}
