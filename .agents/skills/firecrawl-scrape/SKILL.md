---
name: firecrawl-scrape
description: Use Firecrawl MCP to scrape and crawl websites with AI-optimized responses. Converts web pages to clean, LLM-ready markdown. Supports dynamic content, batch processing, and intelligent search.
---

# Firecrawl Scrape Skill

## Overview
Firecrawl is a powerful web-scraping and crawling API designed specifically for AI agents. It effectively bypasses anti-bot measures, handles JavaScript-heavy pages, and cleans HTML into high-quality, structured Markdown. This skill instructs the agent on how to use the Firecrawl MCP tools (`scrape`, `crawl`, `search`) optimally to gather high-fidelity information from the web.

## MCP Tools Integration
The following tools are available via the `firecrawl-mcp` server:

| Tool | Action | Usage Scenario |
| :--- | :--- | :--- |
| `scrape` | Scrape a single URL | Targeted data extraction from a known page. |
| `crawl` | Crawl multiple pages | Mapping a site's structure or gathering data across a domain. |
| `search` | Search and scrape top results | Broad research and competitive analysis. |

## Core Directives for Scraping

### 1. Intent Preview (IAA Framework)
Before initiating a crawl or wide scrape, provide a brief intent preview:
"I am about to scrape [Target Website] to extract [Specific Information] using Firecrawl to ensure high-fidelity markdown output."

### 2. High-Fidelity Extraction
Firecrawl is the preferred tool over basic `read_url_content` when:
- The target page is complex or JavaScript-reliant.
- Structured data (tables, lists) needs to be preserved.
- Precise content mapping is required without the noise of navbars/footers.

### 3. Rate-Limit & Credit Consciousness
- **Batch wisely:** Scrape only what is necessary to conserve credits.
- **Explainable Rationale:** If a scrape fails, verify the URL and site accessibility before retrying.

## Execution Rules
1. **Tool selection:** Use `scrape` for specific documentation or articles. Use `search` for general questions where the source is unknown.
2. **Context preservation:** When a page is scraped, summarize the key findings relative to the project's current state.
3. **Data formatting:** Ensure any scraped data is formatted according to the project's Design System or Knowledge Item (KI) requirements.

## Troubleshooting
- **Auth Error:** Ensure the `FIRECRAWL_API_KEY` is correctly set in the environment variables within the MCP configuration.
- **Verification:** Run `npx -y firecrawl-mcp` in the terminal to verify server availability.
