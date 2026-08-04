# mcp-paperswithcode

Papers (ML research) MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_papers` | Search machine-learning / AI research papers (via Hugging Face Papers, the successor to Papers with Code). Returns arXiv id, title, authors, community upvotes, and a linked GitHub repo when available. Use for "papers on <topic>", "recent ML research about X". |
| `trending_papers` | Today's trending ML/AI papers (or a given day's), ranked by community upvotes, via Hugging Face Papers. Use for "what are the hot AI papers", "trending ML research", "top papers this week". |
| `get_paper` | Get full detail for a paper by its arXiv id (e.g. "2312.00752"): title, authors, abstract, AI-generated summary and keywords, community upvotes, and counts of linked models / datasets / demo Spaces. |
| `get_repositories` | Find IMPLEMENTATIONS of a paper (by arXiv id): the linked GitHub repository plus the most popular Hugging Face models, demo Spaces, and datasets that implement or reproduce it — the "papers with code" view. Use for "code/implementation for <paper>", "models trained on <paper>". |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "paperswithcode": {
      "url": "https://gateway.pipeworx.io/paperswithcode/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Paperswithcode data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
