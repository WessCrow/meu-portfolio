---
name: firecrawl
description: >
  Autonomously perform web scraping, searching, and browsing.
  Use this skill when you need to research or extract data from any webpage, search the web for missing information, 
  or perform multi-step browser automation. Highly effective for getting clean Markdown from JavaScript-heavy sites.
---

# Firecrawl Skill

This skill allows the agent to interact with the world through web scraping, searching, and autonomous browsing.

## Core Capabilities

### 1. Web Scraping (`firecrawl_scrape`)
- Clean Markdown extraction from any URL.
- Handles JavaScript-rendered content (SPAs) automatically.
- Best for single-page research.

### 2. Deep Search (`firecrawl_search`)
- Performs a web search and scrapes the results in one go.
- Use this when the current conversation lacks the external data needed for a decision.

### 3. Website Mapping (`firecrawl_map`)
- Discovers all indexed URLs on a domain.
- Perfect for finding sub-pages or specific documentation sections.

### 4. Recursive Crawling (`firecrawl_crawl`)
- Follows links to gather content from an entire site or subdirectory.
- Creates a comprehensive knowledge base for a specific topic.

### 5. Autonomous Browser (`firecrawl_browser_create`)
- Multi-step interactions: login, clicking, form filling, and extraction.
- Precise control via Chrome DevTools Protocol (CDP).

## Best Practices

- **Token Efficiency**: Prefer `firecrawl_scrape` with `onlyMainContent: true` to avoid noise.
- **Dynamic Content**: For SPAs, set a `waitFor` delay or use the `actions` parameter to trigger interactions.
- **Structured Data**: Use `firecrawl_extract` when you need specific fields (e.g., product prices, specs) rather than full page context.
- **Research Loops**: Start with `firecrawl_search` to find candidates, then `firecrawl_scrape` the most relevant one.

## Error Handling

- If a scrape fails, check if the site requires authentication or has bot protection.
- For heavily protected sites, use `firecrawl_browser_execute` with human-like interactions.
