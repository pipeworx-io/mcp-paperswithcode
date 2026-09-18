# mcp-paperswithcode

Papers (ML research) MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/paperswithcode/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Paperswithcode data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/paperswithcode_search_papers \
  -H 'Content-Type: application/json' \
  -d '{"query":"attention transformer"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/paperswithcode_search_papers`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.
