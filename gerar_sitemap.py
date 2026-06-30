from pathlib import Path
from datetime import date

BASE_URL = "https://utiliweb.vercel.app"
ROOT = Path(__file__).parent

urls = []

# Página inicial
urls.append(("/", "daily", "1.0"))

# Páginas principais
for page in ["about.html", "contact.html", "privacy.html"]:
    if (ROOT / page).exists():
        urls.append((f"/{page}", "monthly", "0.7"))

# Ferramentas
tools_dir = ROOT / "tools"
if tools_dir.exists():
    for item in sorted(tools_dir.iterdir()):
        if item.is_dir():
            urls.append((f"/tools/{item.name}/", "weekly", "0.9"))

# Jogos
games_dir = ROOT / "jogos"
if games_dir.exists():
    for item in sorted(games_dir.iterdir()):
        if item.is_dir():
            urls.append((f"/jogos/{item.name}/", "weekly", "0.8"))

today = date.today().isoformat()

xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
]

for path, freq, priority in urls:
    xml.extend([
        "  <url>",
        f"    <loc>{BASE_URL}{path}</loc>",
        f"    <lastmod>{today}</lastmod>",
        f"    <changefreq>{freq}</changefreq>",
        f"    <priority>{priority}</priority>",
        "  </url>"
    ])

xml.append("</urlset>")

(ROOT / "sitemap.xml").write_text("\n".join(xml), encoding="utf-8")

print(f"✅ Sitemap criado com {len(urls)} URLs.")
