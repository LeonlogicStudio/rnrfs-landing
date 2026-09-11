import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import logo from "@/assets/freakshow-logo.png";
import banner from "@/assets/banner.jpg";
import tiger from "@/assets/tiger.png";
import wallpaper from "@/assets/wallpaper.jpg";

// ── EDIT THESE ──────────────────────────────────────────────
const TICKET_URL =
  "https://ticketlounge.co.uk/product/professional-101-live-the-queens-hall-nuneaton-july-10-2026-professional-101-digital-album/";
const WHATSAPP_URL = "https://chat.whatsapp.com/G9ottfvIHuvLbg5PZHq9qv";
const ALBUM_URL =
  "https://ticketlounge.co.uk/product/professional-101-this-is-the-sound-digital-download/";
const SALE_DATE = "2026-07-24T10:00:00+01:00"; // unused — kept for reference
const KLAVIYO_COMPANY_ID = "UKQS7R"; // Klaviyo public API key / site ID
const KLAVIYO_LIST_ID = "Ua95zq"; // RNRFS mailing list
const KLAVIYO_FALLBACK_URL =
  "https://manage.kmail-lists.com/subscriptions/subscribe?a=UKQS7R&g=Ua95zq";
const VIDEO_URL = ""; // paste trailer URL when Rex sends it (YouTube embed link or .mp4)
// ────────────────────────────────────────────────────────────

const pad = (n: number) => String(n).padStart(2, "0");

function useCountdown(target: string) {
  const [t, setT] = useState({ d: "--", h: "--", m: "--", s: "--", done: false });
  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setT({
        d: pad(Math.floor(diff / 86400000)),
        h: pad(Math.floor((diff % 86400000) / 3600000)),
        m: pad(Math.floor((diff % 3600000) / 60000)),
        s: pad(Math.floor((diff % 60000) / 1000)),
        done: diff === 0,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

const marqueeItems = [
  "Live Music",
  "Performers",
  "Dancers",
  "Sideshows",
  "DJ's",
  "Good Times",
];

const MailingList = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch(
        `https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/vnd.api+json",
            revision: "2025-07-15",
          },
          body: JSON.stringify({
            data: {
              type: "subscription",
              attributes: {
                custom_source: "RNRFS landing page",
                profile: { data: { type: "profile", attributes: { email } } },
              },
              relationships: {
                list: { data: { type: "list", id: KLAVIYO_LIST_ID } },
              },
            },
          }),
        }
      );
      if (res.status !== 202) throw new Error(`HTTP ${res.status}`);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="section mail" id="mailing-list">
      <div className="wrap center">
        <span className="tape tilt-l">The Rock N Roll Freak Show</span>
        <h2 className="h2 display mail-title">Join the Freak List</h2>
        <p className="mail-sub">
          Ticket drops, lineup reveals and RNRFS chaos — first, straight to your inbox.
        </p>

        {status === "done" ? (
          <p className="mail-done display">
            <span className="sticker green tilt-l">You're on the list.</span>{" "}
            <span className="sticker yellow tilt-r">Expect chaos ⚡</span>
          </p>
        ) : (
          <form className="mail-form" onSubmit={submit}>
            <input
              type="email"
              required
              placeholder="YOUR@EMAIL.COM"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              disabled={status === "sending"}
            />
            <button type="submit" className="btn btn-mail" disabled={status === "sending"}>
              {status === "sending" ? "Signing…" : "Sign Me Up"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mail-error">
            That didn't work — try again, or{" "}
            <a href={KLAVIYO_FALLBACK_URL} target="_blank" rel="noopener noreferrer">
              sign up here
            </a>
            .
          </p>
        )}
        <p className="mail-smallprint">
          Emails from The Rock N Roll Freak Show. No spam, unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="fs-page">
      <style>{css}</style>

      {/* BANNER HERO */}
      <header className="hero">
        <img
          className="banner"
          src={banner}
          alt="The Rock N' Roll Freak Show Experience — November 6 2026, Electric Brixton, London. Tickets from www.ticketlounge.co.uk"
        />

        <div className="drop" style={{ backgroundImage: `url(${wallpaper})` }}>
          <div className="drop-inner">
            <span className="tape tilt-l">Electric Brixton • London • Nov 6 2026</span>
            <h1 className="return display">
              The Return of the Rock n Roll Freak Show Experience
            </h1>
            <p className="features">
              Live Music · DJ's · Performers · Dancers · Sideshows · Good Times
            </p>
            <p className="drop-title display">
              <span className="sticker yellow tilt-l">Tickets</span>{" "}
              <span className="sticker green tilt-l">£29.99</span>
            </p>

            <a className="btn" href={TICKET_URL} target="_blank" rel="noopener noreferrer">
              Get Tickets →
            </a>
            <p className="urgency">£29.99 · via Ticket Lounge · 18+ event</p>
          </div>
        </div>
      </header>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <div className="track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i}>
              <span>{item}</span>
              <span className="star"> ★ </span>
            </span>
          ))}
        </div>
      </div>

      {/* VIDEO — removed for now. When Rex sends the trailer: set VIDEO_URL
          at the top of this file and un-comment this whole section.
      <section className="section center" style={{ backgroundImage: `url(${wallpaper})` }}>
        <div className="wrap">
          <h2 className="h2 display">
            <span className="sticker green tilt-l">Watch</span>{" "}
            <span className="sticker yellow tilt-r">the chaos</span>
          </h2>
          <div className="video-frame">
            {VIDEO_URL.endsWith(".mp4") ? (
              <video controls playsInline src={VIDEO_URL} />
            ) : (
              <iframe
                src={VIDEO_URL}
                title="The Rock N' Roll Freak Show — trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </section>
      */}

      {/* MAILING LIST */}
      <MailingList />

      {/* PROFESSIONAL 101 — ALBUM */}
      <section className="section center band" style={{ backgroundImage: `url(${wallpaper})` }}>
        <div className="wrap">
          <div className="band-tiger" style={{ backgroundImage: `url(${tiger})` }} aria-hidden="true" />
          <span className="tape tilt-r">House Band</span>
          <h2 className="h2 display band-title">Professional 101</h2>
          <div className="band-copy">
            <p>
              <b>PROFESSIONAL 101</b> are the muscle behind the RNRFSE. Support the band by
              pre-ordering a digital copy of the album <b>"This Is The Sound"</b> — release date
              November 6 2026 on Atomic Children Records.
            </p>
          </div>
          <a className="btn btn-sm" href={ALBUM_URL} target="_blank" rel="noopener noreferrer">
            Pre-Order the Album →
          </a>
        </div>
      </section>

      {/* FAQ / NEED TO KNOW */}
      <section
        className="section faq"
        id="info"
        style={{ "--tiger": `url(${tiger})` } as CSSProperties}
      >
        <div className="wrap center">
          <h2 className="h2 display">Need to know</h2>
          <p className="faq-sub">The essentials — everything else stays a surprise</p>
          <div className="facts">
            <div className="fact">
              <div className="k">The Date</div>
              <div className="v">Nov 6, 2026</div>
              <div className="bar" />
            </div>
            <div className="fact">
              <div className="k">Venue</div>
              <div className="v">Electric Brixton,<br />London</div>
              <div className="bar" />
            </div>
            <div className="fact hot">
              <div className="k">Tickets</div>
              <div className="v">£29.99</div>
              <div className="bar" />
            </div>
            <div className="fact">
              <div className="k">Doors</div>
              <div className="v">7:00 PM</div>
              <div className="bar" />
            </div>
            <div className="fact">
              <div className="k">Age</div>
              <div className="v">18+ · ID Required</div>
              <div className="bar" />
            </div>
            <div className="fact">
              <div className="k">Dress Code</div>
              <div className="v">No rules.<br />Come as you are.</div>
              <div className="bar" />
            </div>
          </div>
          <p className="smallprint">
            Official ticket partner: Ticket Lounge · All tickets subject to booking fees
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="section footer" style={{ backgroundImage: `url(${wallpaper})` }}>
        <div className="wrap">
          <div className="whats">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              ⚡ Join the Freak Show community on WhatsApp
            </a>
          </div>
          <div className="outro">
            <div className="misfits">
              This is for the misfits.<br /><b>Expect extraordinary.</b>
            </div>
            <img className="logo-small" src={logo} alt="" loading="lazy" />
          </div>
          <p className="copyright">© 2026 The Rock N Roll Freak Show. All rights reserved.</p>
        </div>
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className="sticky-cta">
        <div className="info">
          Nov 6 · Electric Brixton<br />
          <b>⚡ 18+ · via Ticket Lounge</b>
        </div>
        <a className="btn" href={TICKET_URL} target="_blank" rel="noopener noreferrer">
          Tickets £29.99
        </a>
      </div>
    </div>
  );
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

.fs-page{
  --pink:#ED1A52; --pink-deep:#C90E40; --yellow:#FFAF14; --green:#2E8F2A;
  --ink:#0D0A08; --tape:#EFC488; --paper:#FFF6E8;
  --displayF:'Anton','Arial Narrow',Impact,sans-serif;
  --monoF:'Courier New',Courier,monospace;
  font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;
  color:var(--ink); background:var(--pink); overflow-x:hidden;
}
.fs-page *{margin:0;padding:0;box-sizing:border-box}
.fs-page img{max-width:100%;display:block}
.fs-page a{color:inherit}

.display{font-family:var(--displayF);font-weight:400;text-transform:uppercase;line-height:.92;letter-spacing:.01em}
.tape{font-family:var(--monoF);font-weight:700;text-transform:uppercase;background:var(--tape);color:var(--ink);
  padding:.45em .9em;display:inline-block;letter-spacing:.14em;font-size:clamp(.68rem,1.6vw,.82rem);
  box-shadow:3px 3px 0 rgba(0,0,0,.4)}
.sticker{display:inline-block;padding:.28em .55em;box-shadow:4px 4px 0 rgba(0,0,0,.38)}
.sticker.yellow{background:var(--yellow);color:var(--ink)}
.sticker.green{background:var(--green);color:var(--ink)}
.sticker.black{background:var(--ink);color:var(--yellow)}
.tilt-l{transform:rotate(-2deg)}
.tilt-r{transform:rotate(1.6deg)}

/* banner hero */
.hero{position:relative}
.banner{width:100%;height:auto}
.drop{padding:3.2rem 1.2rem 3.8rem;background-size:cover;background-position:center;text-align:center}
.drop-inner{display:flex;flex-direction:column;align-items:center;gap:1.1rem;max-width:880px;margin:0 auto}
.return{font-size:clamp(1.5rem,4.4vw,2.4rem);color:var(--paper);max-width:16em;
  text-shadow:2px 2px 0 rgba(0,0,0,.55);text-wrap:balance}
.features{font-family:var(--monoF);font-weight:700;letter-spacing:.18em;text-transform:uppercase;
  font-size:clamp(.66rem,1.8vw,.82rem);color:var(--ink);background:rgba(255,246,232,.85);
  padding:.4em 1em;box-shadow:3px 3px 0 rgba(0,0,0,.35);transform:rotate(-1deg)}
.drop-title{font-size:clamp(1.8rem,5.5vw,3rem);margin-top:.4rem}
.drop-sub{font-size:clamp(1.4rem,4.5vw,2.2rem);color:var(--paper);text-shadow:2px 2px 0 rgba(0,0,0,.5)}
.drop-sub.on-sale{color:var(--yellow);text-shadow:3px 3px 0 rgba(0,0,0,.55);font-size:clamp(1.8rem,5.5vw,2.8rem)}

.count{display:flex;gap:.5rem;align-items:stretch}
.count .cell{background:var(--ink);color:var(--yellow);padding:.5rem .6rem .45rem;min-width:4.2rem;
  box-shadow:4px 4px 0 rgba(0,0,0,.35)}
.count .cell:nth-child(odd){transform:rotate(-1.5deg)}
.count .cell:nth-child(even){transform:rotate(1.2deg)}
.count .num{font-family:var(--displayF);font-size:clamp(1.7rem,5vw,2.6rem);font-variant-numeric:tabular-nums;line-height:1}
.count .lab{font-family:var(--monoF);font-weight:700;font-size:.6rem;letter-spacing:.22em;color:var(--paper);margin-top:.25rem}

.btn{font-family:var(--displayF);text-transform:uppercase;text-decoration:none;display:inline-block;
  background:var(--yellow);color:var(--ink);font-size:clamp(1.3rem,3.6vw,1.8rem);letter-spacing:.04em;
  padding:.55em 1.4em;border:3px solid var(--ink);box-shadow:6px 6px 0 var(--ink);
  transition:transform .12s ease,box-shadow .12s ease}
.btn:hover{transform:translate(2px,2px);box-shadow:4px 4px 0 var(--ink)}
.btn:active{transform:translate(6px,6px);box-shadow:0 0 0 var(--ink)}
.btn:focus-visible{outline:4px dashed var(--paper);outline-offset:4px}
.drop .btn{margin-top:.5rem}
.urgency{font-family:var(--monoF);font-weight:700;font-size:.78rem;letter-spacing:.12em;
  text-transform:uppercase;color:var(--paper);text-shadow:1px 1px 0 rgba(0,0,0,.6)}

.marquee{background:var(--ink);color:var(--yellow);overflow:hidden;white-space:nowrap;padding:.55rem 0;
  transform:rotate(-1.2deg) scale(1.02);position:relative;z-index:2}
.marquee .track{display:inline-block;font-family:var(--displayF);text-transform:uppercase;
  font-size:clamp(1.05rem,3vw,1.5rem);letter-spacing:.08em;animation:fs-roll 26s linear infinite}
.marquee .track span span{margin:0 .45em}
.marquee .star{color:var(--pink)}
@keyframes fs-roll{from{transform:translateX(0)}to{transform:translateX(-33.33%)}}
@media (prefers-reduced-motion:reduce){.marquee .track{animation:none}.btn{transition:none}}

.section{padding:4.5rem 1.2rem;position:relative;background-size:cover;background-position:center}
.wrap{max-width:880px;margin:0 auto}
.center{text-align:center}
.h2{font-size:clamp(1.9rem,6vw,3.2rem)}

/* video */
.video-frame{margin:2.4rem auto 0;max-width:760px;background:var(--ink);
  box-shadow:0 0 0 3px var(--ink),10px 10px 0 rgba(0,0,0,.35);transform:rotate(-.5deg)}
.video-frame video,.video-frame iframe{width:100%;aspect-ratio:16/9;display:block;border:0}
.video-placeholder{aspect-ratio:16/9;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:1.1rem;background-color:var(--ink);background-repeat:no-repeat;background-position:center;
  background-size:52%;position:relative}
.video-placeholder::after{content:"";position:absolute;inset:0;background:rgba(13,10,8,.55)}
.video-placeholder .play{position:relative;z-index:1;color:var(--yellow);font-size:clamp(2.4rem,7vw,3.6rem);
  border:4px solid var(--yellow);width:2.1em;height:2.1em;display:flex;align-items:center;justify-content:center;
  border-radius:50%;padding-left:.15em;box-shadow:5px 5px 0 rgba(237,26,82,.75)}
.video-placeholder .soon{position:relative;z-index:1;transform:rotate(-1.5deg)}

/* mailing list */
.mail{background:var(--ink);color:var(--paper);padding:4rem 1.2rem;overflow:hidden;position:relative}
.mail::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.15;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n2)' opacity='0.5'/%3E%3C/svg%3E")}
.mail .wrap{position:relative;z-index:1}
.mail-title{color:var(--yellow);text-shadow:4px 4px 0 rgba(237,26,82,.55);margin-top:1rem}
.mail-sub{margin-top:1rem;font-family:var(--monoF);font-weight:700;letter-spacing:.14em;
  text-transform:uppercase;font-size:clamp(.68rem,1.8vw,.8rem);color:rgba(255,246,232,.8);line-height:2}
.mail-form{display:flex;gap:.9rem;justify-content:center;align-items:stretch;flex-wrap:wrap;
  margin-top:2rem}
.mail-form input{font-family:var(--monoF);font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  font-size:.85rem;background:var(--paper);color:var(--ink);border:3px solid var(--ink);
  padding:.9em 1.2em;width:min(100%,340px);box-shadow:5px 5px 0 rgba(237,26,82,.7);
  transform:rotate(-.6deg)}
.mail-form input:focus{outline:4px dashed var(--yellow);outline-offset:3px}
.mail-form input::placeholder{color:rgba(13,10,8,.45)}
.btn-mail{font-size:clamp(1.1rem,2.8vw,1.4rem);cursor:pointer;transform:rotate(.8deg);
  box-shadow:6px 6px 0 var(--pink)}
.btn-mail:hover{box-shadow:4px 4px 0 var(--pink)}
.btn-mail:active{box-shadow:0 0 0 var(--pink)}
.btn-mail:disabled{opacity:.6;cursor:wait}
.mail-done{margin-top:2rem;font-size:clamp(1.3rem,4vw,2rem)}
.mail-error{margin-top:1.2rem;font-family:var(--monoF);font-weight:700;font-size:.72rem;
  letter-spacing:.12em;text-transform:uppercase;color:var(--yellow)}
.mail-error a{color:var(--yellow)}
.mail-smallprint{margin-top:1.6rem;font-family:var(--monoF);font-weight:700;font-size:.6rem;
  letter-spacing:.14em;text-transform:uppercase;opacity:.5;line-height:2}

/* professional 101 */
.band .band-tiger{width:min(70vw,420px);aspect-ratio:16/9;margin:0 auto .6rem;
  background-repeat:no-repeat;background-position:center;background-size:contain;
  filter:drop-shadow(0 8px 22px rgba(0,0,0,.35))}
.band .band-title{margin-top:.9rem;color:var(--ink);text-shadow:4px 4px 0 rgba(255,246,232,.28)}
.band .band-copy{max-width:32em;margin:1.5rem auto 0;background:var(--paper);color:var(--ink);
  padding:1.3rem 1.5rem;font-size:clamp(.95rem,2.3vw,1.08rem);line-height:1.55;text-align:left;
  box-shadow:6px 6px 0 rgba(0,0,0,.35);transform:rotate(.6deg)}
.band .band-copy b{color:var(--pink-deep)}
.band .btn-sm{margin-top:1.7rem;font-size:clamp(1.05rem,2.8vw,1.35rem)}

/* faq — ticket stubs */
.faq{background:var(--ink);color:var(--paper);overflow:hidden;padding:4rem 1.2rem 4.5rem}
.faq::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.13;
  background-image:var(--tiger);background-repeat:no-repeat;
  background-position:right -140px center;background-size:min(52%,620px)}
.faq::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.15;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")}
.faq .wrap{position:relative;z-index:1}
.faq .h2{color:var(--yellow);text-shadow:4px 4px 0 rgba(237,26,82,.55)}
.faq-sub{margin-top:.9rem;font-family:var(--monoF);font-weight:700;letter-spacing:.2em;
  text-transform:uppercase;font-size:.7rem;color:rgba(255,246,232,.65)}
.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem 1.4rem;margin-top:2.8rem;text-align:center}
@media (max-width:840px){.facts{grid-template-columns:repeat(2,1fr)}}
@media (max-width:520px){.facts{grid-template-columns:1fr;max-width:330px;margin-left:auto;margin-right:auto}}
.fact{position:relative;display:flex;flex-direction:column;gap:.5rem;
  background:var(--paper);color:var(--ink);padding:1.15rem 1.1rem .9rem;
  box-shadow:6px 6px 0 rgba(237,26,82,.6);transition:transform .15s ease}
.fact::before,.fact::after{content:"";position:absolute;top:50%;width:16px;height:16px;
  border-radius:50%;background:var(--ink);transform:translateY(-50%)}
.fact::before{left:-8px}
.fact::after{right:-8px}
.fact:nth-child(odd){transform:rotate(-1.2deg)}
.fact:nth-child(even){transform:rotate(1deg)}
.fact:hover{transform:rotate(0) translateY(-4px)}
.fact .k{font-family:var(--monoF);font-weight:700;font-size:.62rem;letter-spacing:.24em;
  text-transform:uppercase;color:var(--pink-deep)}
.fact .k::before{content:"\\2605\\00a0\\00a0"}
.fact .k::after{content:"\\00a0\\00a0\\2605"}
.fact .v{font-family:var(--displayF);text-transform:uppercase;font-size:clamp(1.1rem,2.6vw,1.35rem);line-height:1.12}
.fact .bar{margin-top:auto;padding-top:.75rem}
.fact .bar::after{content:"";display:block;height:13px;opacity:.85;
  background:repeating-linear-gradient(90deg,currentColor 0 2px,transparent 2px 4px,
    currentColor 4px 7px,transparent 7px 9px,currentColor 9px 10px,transparent 10px 13px)}
.fact.hot{background:var(--yellow);border:3px solid var(--ink);
  box-shadow:6px 6px 0 rgba(255,246,232,.35);z-index:1}
.fact.hot .k{color:var(--ink)}
.fact.hot:nth-child(odd),.fact.hot:nth-child(even){transform:rotate(-1.6deg) scale(1.05)}
.fact.hot:hover{transform:rotate(0) scale(1.05) translateY(-4px)}
.smallprint{margin-top:2.2rem;font-family:var(--monoF);font-weight:700;font-size:.65rem;
  letter-spacing:.13em;text-transform:uppercase;opacity:.6;text-align:center;line-height:2}

/* footer */
.footer{padding-bottom:6rem}
.whats{text-align:center}
.whats a{font-family:var(--monoF);font-weight:700;text-transform:uppercase;text-decoration:none;
  letter-spacing:.14em;font-size:.75rem;background:var(--green);color:var(--paper);display:inline-block;
  padding:.9em 1.6em;box-shadow:4px 4px 0 rgba(0,0,0,.4);transform:rotate(-1deg)}
.whats a:hover{transform:rotate(-1deg) translate(2px,2px);box-shadow:2px 2px 0 rgba(0,0,0,.4)}
.outro{text-align:center;margin-top:3rem}
.outro .misfits{font-family:var(--displayF);text-transform:uppercase;font-size:clamp(1.5rem,5vw,2.4rem);
  color:var(--paper);text-shadow:3px 3px 0 rgba(0,0,0,.55)}
.outro .misfits b{color:var(--yellow);font-weight:400}
.outro .logo-small{width:min(60vw,300px);margin:1.6rem auto 0;opacity:.95}
.copyright{font-family:var(--monoF);font-weight:700;font-size:.6rem;letter-spacing:.18em;
  text-transform:uppercase;color:rgba(255,246,232,.65);margin-top:2rem;text-align:center}

/* sticky mobile cta */
.sticky-cta{position:fixed;bottom:0;left:0;right:0;z-index:50;background:var(--ink);
  padding:.6rem .9rem;display:flex;align-items:center;justify-content:space-between;gap:.8rem;
  box-shadow:0 -6px 20px rgba(0,0,0,.4)}
.sticky-cta .info{font-family:var(--monoF);font-weight:700;font-size:.62rem;letter-spacing:.1em;
  text-transform:uppercase;color:var(--paper);line-height:1.7}
.sticky-cta .info b{color:var(--yellow)}
.sticky-cta .btn{font-size:1.05rem;padding:.45em 1em;border-width:2px;box-shadow:3px 3px 0 var(--pink)}
@media (min-width:900px){.sticky-cta{display:none}}
`;

export default Index;
