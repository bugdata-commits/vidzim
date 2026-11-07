import { FormEvent, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Clipboard,
  Clock3,
  Download,
  FileVideo,
  Gauge,
  Link2,
  Loader2,
  LockKeyhole,
  Play,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Format = {
  id: string;
  label: string;
  detail: string;
  size: string;
  recommended?: boolean;
};

type RecentItem = {
  id: number;
  title: string;
  source: string;
  format: string;
  time: string;
};

const formats: Format[] = [
  { id: "1080", label: "Full HD", detail: "1080p · MP4", size: "18.4 MB", recommended: true },
  { id: "720", label: "HD", detail: "720p · MP4", size: "9.8 MB" },
  { id: "audio", label: "Audio only", detail: "M4A · 128 kbps", size: "4.2 MB" },
];

const platformMap: Record<string, string> = {
  "youtube.com": "YouTube",
  "youtu.be": "YouTube",
  "vimeo.com": "Vimeo",
  "tiktok.com": "TikTok",
  "instagram.com": "Instagram",
  "facebook.com": "Facebook",
  "x.com": "X / Twitter",
  "twitter.com": "X / Twitter",
  "reddit.com": "Reddit",
};

function displayHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source url";
  }
}

function platformFor(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const match = Object.entries(platformMap).find(([domain]) => host === domain || host.endsWith(`.${domain}`));
    return match?.[1] ?? "Direct source";
  } catch {
    return "Unknown source";
  }
}

function isDirectMedia(url: string) {
  return /\.(mp4|webm|mov|m4v|mp3|m4a)(?:$|[?#])/i.test(url);
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("1080");
  const [recent, setRecent] = useState<RecentItem[]>([
    { id: 1, title: "studio-tour-04", source: "vimeo.com", format: "1080p MP4", time: "2m ago" },
    { id: 2, title: "launch-teaser", source: "direct source", format: "720p MP4", time: "18m ago" },
    { id: 3, title: "field-notes-12", source: "youtube.com", format: "M4A audio", time: "1h ago" },
  ]);

  const sourceName = useMemo(() => (source ? platformFor(source) : "Paste a source link"), [source]);
  const currentFormat = formats.find(format => format.id === selectedFormat) ?? formats[0];

  const handleScan = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSource("");

    const raw = url.trim();
    if (!raw) {
      setError("Drop a video URL here to get started.");
      return;
    }

    let normalized = raw;
    if (!/^https?:\/\//i.test(normalized)) normalized = `https://${normalized}`;

    try {
      const parsed = new URL(normalized);
      if (!parsed.hostname.includes(".")) throw new Error("invalid host");
      setUrl(normalized);
      setIsScanning(true);
      window.setTimeout(() => {
        setSource(normalized);
        setIsScanning(false);
      }, 850);
    } catch {
      setError("That doesn’t look like a valid URL. Try including the full domain, like https://...");
    }
  };

  const handlePasteExample = () => {
    setUrl("https://vimeo.com/76979871");
    setError("");
    setNotice("");
  };

  const handleDownload = () => {
    if (!source) return;
    setNotice("");
    setIsDownloading(true);

    window.setTimeout(() => {
      setIsDownloading(false);
      const title = displayHost(source).split(".")[0];
      setRecent(items => [
        { id: Date.now(), title: `${title}-capture`, source: displayHost(source), format: currentFormat.detail, time: "just now" },
        ...items,
      ].slice(0, 4));

      if (isDirectMedia(source)) {
        const anchor = document.createElement("a");
        anchor.href = source;
        anchor.download = `${title}-${selectedFormat}.${selectedFormat === "audio" ? "m4a" : "mp4"}`;
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
        anchor.click();
        setNotice("Your direct media file is opening in a new tab for download.");
      } else {
        setNotice("Format queued in demo mode. Connect a permitted source resolver to enable file transfer for this platform.");
      }
    }, 700);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Vidzim home">
          <span className="brand-mark"><Play size={15} fill="currentColor" strokeWidth={0} /></span>
          <span>vidzim</span>
        </a>
        <div className="topbar-actions">
          <span className="status-chip"><span className="status-dot" /> systems online</span>
          <button className="icon-button" aria-label="Open settings"><span className="menu-lines"><i /><i /></span></button>
        </div>
      </header>

      <main className="page-frame">
        <section className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> video utility / 01</div>
            <h1>Drop a link.<br /><span>Keep the moment.</span></h1>
            <p className="hero-lede">A clean handoff from video URL to ready-to-save file. No clutter, no guesswork.</p>
          </div>
          <div className="hero-note">
            <span className="note-index">A / 24</span>
            <p>Built for the links you own, publish, or have permission to save.</p>
          </div>
        </section>

        <section className="workspace-grid">
          <div className="workspace-main">
            <div className="section-label"><span>01</span> capture source</div>
            <form className="capture-card" onSubmit={handleScan}>
              <div className="capture-card-topline">
                <span className="card-kicker"><Link2 size={14} /> video URL</span>
                <span className="card-hint">any platform / direct file</span>
              </div>
              <div className={`url-input-wrap ${error ? "has-error" : ""} ${source ? "has-source" : ""}`}>
                <Link2 className="url-icon" size={21} />
                <input
                  value={url}
                  onChange={event => { setUrl(event.target.value); setError(""); }}
                  placeholder="https://paste-your-video-link.com"
                  aria-label="Video URL"
                  spellCheck={false}
                />
                {url && <button type="button" className="clear-input" aria-label="Clear URL" onClick={() => { setUrl(""); setSource(""); setError(""); setNotice(""); }}><X size={16} /></button>}
              </div>
              <div className="capture-footer">
                <div className="capture-meta">
                  <ShieldCheck size={15} /> <span>safe to scan · no account needed</span>
                </div>
                <Button type="submit" className="scan-button" disabled={isScanning}>
                  {isScanning ? <><Loader2 size={17} className="spin" /> scanning source</> : <><ScanSearch size={17} /> scan this source</>}
                </Button>
              </div>
              {error && <div className="inline-message error-message"><TriangleAlert size={15} /> {error}</div>}
              {!url && !error && <button type="button" className="example-link" onClick={handlePasteExample}>try an example <ArrowUpRight size={13} /></button>}
            </form>

            <div className="trust-row">
              <div><LockKeyhole size={15} /> no credentials requested</div>
              <div><Gauge size={15} /> lightweight by design</div>
              <div><FileVideo size={15} /> mp4 · webm · audio</div>
            </div>

            {source ? (
              <section className="results-section result-enter">
                <div className="section-label"><span>02</span> choose format</div>
                <div className="source-preview">
                  <div className="source-thumb"><Play size={22} fill="currentColor" strokeWidth={0} /></div>
                  <div className="source-details">
                    <div className="source-status"><span className="ready-dot" /> source ready</div>
                    <h2>{sourceName} capture</h2>
                    <p>{displayHost(source)} <span>·</span> scanned just now</p>
                  </div>
                  <div className="source-actions"><button type="button" className="copy-button" onClick={() => navigator.clipboard?.writeText(source)}><Clipboard size={14} /> copy link</button></div>
                </div>
                <div className="format-list">
                  {formats.map(format => (
                    <button key={format.id} type="button" className={`format-row ${selectedFormat === format.id ? "selected" : ""}`} onClick={() => setSelectedFormat(format.id)}>
                      <span className="format-radio">{selectedFormat === format.id && <Check size={13} strokeWidth={3} />}</span>
                      <span className="format-name">{format.label}{format.recommended && <span className="recommended">recommended</span>}</span>
                      <span className="format-detail">{format.detail}</span>
                      <span className="format-size">{format.size}</span>
                      <ChevronDown className="format-chevron" size={16} />
                    </button>
                  ))}
                </div>
                <div className="download-row">
                  <div className="download-note"><Sparkles size={16} /><span>ready when you are<span>downloads stay on your device</span></span></div>
                  <Button className="download-button" onClick={handleDownload} disabled={isDownloading}>
                    {isDownloading ? <><Loader2 size={17} className="spin" /> queuing</> : <><Download size={17} /> download {currentFormat.label.toLowerCase()}</>}
                  </Button>
                </div>
                {notice && <div className="inline-message notice-message"><Check size={15} /> {notice}</div>}
              </section>
            ) : (
              <section className="empty-state">
                <div className="empty-mark"><ScanSearch size={19} /></div>
                <div><strong>Nothing in the queue yet.</strong><p>Scan a link to reveal the cleanest available formats.</p></div>
                <span className="empty-index">02—</span>
              </section>
            )}
          </div>

          <aside className="activity-rail">
            <div className="rail-heading"><span className="section-label"><span>03</span> recent activity</span><button type="button" className="refresh-button" aria-label="Refresh recent activity"><RefreshCw size={15} /></button></div>
            <div className="recent-list">
              {recent.map(item => (
                <article className="recent-item" key={item.id}>
                  <div className="recent-icon"><FileVideo size={16} /></div>
                  <div className="recent-copy"><strong>{item.title}</strong><span>{item.source}</span></div>
                  <div className="recent-meta"><span>{item.format}</span><time>{item.time}</time></div>
                </article>
              ))}
            </div>
            <div className="rail-footer"><Clock3 size={14} /> local session history <span>·</span> 3 items</div>
            <div className="rail-callout"><span className="callout-mark">↳</span><p>Vidzim never asks for your account password. If a source is locked, we leave it locked.</p></div>
          </aside>
        </section>

        <footer className="page-footer">
          <span>vidzim / link to file, simply</span>
          <span>for content you’re authorized to save <span className="footer-dot">●</span></span>
        </footer>
      </main>
    </div>
  );
}
