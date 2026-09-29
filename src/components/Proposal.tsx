import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { ArrowRight, Heart, Send } from "lucide-react";

const paragraphs = [
  "My Januu...",
  "Since childhood, I always loved the name 'Laiba'. I don't know why, but it always felt special to me. Even as a kid, I used to think — if my wife is ever named Laiba, wow, how beautiful would that be?",
  "And now... it came true. I found my Laiba. And the biggest blessing of my life is YOU.",
  "I just want you to be my Begum Jii. My forever. My world. My everything.",
  "Please be there with me till the very last end.",
];
const noLines = ["Nope, that's not an option 😜", "Try again, My Januu ♥", "Hehe, catch me if you can!", "Okay okay… only YES is left ♥"];
const burst = [[20,25,0],[80,20,.2],[50,35,.45],[30,60,.9],[75,55,1.1],[15,45,1.5],[60,15,1.7],[88,40,2.1],[40,20,2.5],[55,62,2.9]] as const;
const colors = ["firework-rose","firework-gold","firework-pearl","firework-pink"];

function Petals({ count = 18 }: { count?: number }) {
  return <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    {Array.from({ length: count }, (_, i) => <span key={i} className="wish-petal wish-petal-down" style={{ left: `${(i * 23) % 100}%`, animationDuration: `${7 + (i % 5)}s`, animationDelay: `-${i * .6}s`, "--petal-sway": `${(i % 2 ? 1 : -1) * (20 + i * 3)}px` } as CSSProperties} />)}
    {Array.from({ length: 10 }, (_, i) => <span key={`h${i}`} className="wish-heart absolute text-primary" style={{ left: `${(i * 17 + 5) % 100}%`, animationDuration: `${8 + i % 4}s`, animationDelay: `-${i}s` }}>♥</span>)}
  </div>;
}

function Fireworks() {
  return <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
    {burst.map(([x, y, d], b) => <span key={b} className={`wish-firework absolute ${colors[b % 4]}`} style={{ left: `${x}%`, top: `${y}%` }}>
      <span className="wish-flash" style={{ animationDelay: `${d}s` }} />
      {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2, r = 90 + (i % 3) * 25; return <span key={i} className="wish-spark" style={{ animationDelay: `${d}s`, rotate: `${a + Math.PI / 2}rad`, "--spark-x": `${Math.cos(a) * r}px`, "--spark-y": `${Math.sin(a) * r}px` } as CSSProperties} />; })}
    </span>)}
    {Array.from({ length: 24 }, (_, i) => <span key={`c${i}`} className="wish-heart absolute text-2xl text-primary" style={{ left: "50%", bottom: "40%", animationDuration: "2.4s", animationDelay: `${i * .05}s`, translate: `${(i - 12) * 18}px 0` }}>♥</span>)}
  </div>;
}

export function Proposal({ celebrate, chime, onNext }: { celebrate: () => void; chime: () => void; onNext: () => void }) {
  const [stage, setStage] = useState<"story" | "question" | "card">("story");
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [tries, setTries] = useState(0);
  const [boom, setBoom] = useState(false);

  useEffect(() => {
    if (stage !== "story") return;
    const text = paragraphs[line] ?? "";
    if (chars < text.length) { const t = setTimeout(() => setChars(c => c + 1), 32); return () => clearTimeout(t); }
    if (line < paragraphs.length - 1) { const t = setTimeout(() => { setLine(l => l + 1); setChars(0); }, 700); return () => clearTimeout(t); }
    const t = setTimeout(() => setStage("question"), 1600); return () => clearTimeout(t);
  }, [stage, line, chars]);

  const flee = () => {
    const n = tries + 1; setTries(n);
    setNoPos({ x: 8 + Math.random() * 70, y: 15 + Math.random() * 65 });
  };
  const yes = () => {
    setBoom(true); celebrate(); chime(); setTimeout(chime, 900); setTimeout(chime, 1800);
    setTimeout(() => setStage("card"), 1500); setTimeout(() => setBoom(false), 4200);
  };
  const skip = () => { setLine(paragraphs.length - 1); setChars((paragraphs.at(-1) ?? "").length); };

  return <div className="chapter relative mx-auto max-w-3xl py-6 text-center">
    <Petals />
    <div aria-hidden className="wish-halo pointer-events-none fixed inset-0 z-0" />
    {boom && <Fireworks />}
    <div className="relative z-10">
      {stage !== "card" && <>
        <p className="text-xs font-semibold uppercase tracking-[.25em] text-muted-foreground">The Question of Forever</p>
        <div className="mt-4 rounded-lg border border-paper/70 bg-paper/70 p-5 text-left shadow-xl backdrop-blur-md sm:p-8">
          {paragraphs.slice(0, line + 1).map((p, i) => {
            const shown = i < line ? p : p.slice(0, chars);
            return <p key={i} className={`animate-fade-in ${i === 0 ? "script text-4xl text-primary" : "quote mt-4 text-lg leading-relaxed text-foreground/85"}`}>
              {shown}{i === paragraphs.length - 1 && shown === p && <Heart className="ml-1 inline fill-paper text-primary" size={18} />}
              {i === line && stage === "story" && <span className="ml-0.5 animate-pulse text-primary">|</span>}
            </p>;
          })}
          {stage === "story" && <button onClick={skip} className="mt-4 text-xs text-muted-foreground underline">Show all</button>}
        </div>
      </>}

      {stage === "question" && <div className="animate-fade-in mt-8">
        <h2 className="wish-title script text-4xl font-bold text-primary sm:text-5xl">Do you know our names match so beautifully together? ♥</h2>
        <p className="quote mt-3 text-xl italic">Do you want to see it?</p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button onClick={yes} className="magic-button rounded-full bg-primary px-10 py-4 text-xl font-bold text-primary-foreground transition hover:scale-105">YES ♥</button>
          {tries < 4 ? <button
            onPointerEnter={flee} onPointerDown={e => { e.preventDefault(); flee(); }} onClick={flee}
            className="rounded-full bg-muted px-5 py-2 text-sm text-muted-foreground transition-all duration-300"
            style={noPos ? { position: "fixed", left: `${noPos.x}%`, top: `${noPos.y}%`, zIndex: 55, transform: `scale(${1 - tries * .15}) rotate(${tries % 2 ? 8 : -8}deg)` } : undefined}
          >NO 😜</button> : <button onClick={yes} className="magic-button rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">Also YES ♥</button>}
        </div>
        {tries > 0 && <p role="status" className="mt-4 font-medium text-primary">{noLines[Math.min(tries - 1, 3)]}</p>}
      </div>}

      {stage === "card" && <WeddingCard chime={chime} celebrate={celebrate} onNext={onNext} />}
    </div>
  </div>;
}

function WeddingCard({ chime, celebrate, onNext }: { chime: () => void; celebrate: () => void; onNext: () => void }) {
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [hearts, setHearts] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); if (!msg.trim()) return;
    setStatus("sending");
    try {
      const r = await fetch("https://formsubmit.co/ajax/uzankhan17@gmail.com", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _subject: "A message from your Januu ♥", _template: "box", _captcha: "false", message: msg }),
      });
      if (!r.ok) throw new Error();
      setStatus("sent"); setHearts(true); celebrate(); chime(); setTimeout(() => setHearts(false), 2500);
    } catch { setStatus("error"); }
  };

  return <div ref={ref}>
    <div className="wedding-card relative mx-auto max-w-md overflow-hidden rounded-lg p-2">
      <div className="wedding-inner relative rounded-md px-6 py-10 sm:px-10">
        <span aria-hidden className="wedding-shimmer" />
        {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map(c => <span key={c} aria-hidden className={`wish-glitter absolute ${c} text-xl text-gold`}>❀</span>)}
        <p dir="rtl" lang="ar" className="wedding-gold text-2xl leading-loose sm:text-3xl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <div className="wedding-rule" />
        <p className="quote text-sm italic text-wedding-maroon">We are pleased to announce<br />the wedding of</p>
        <h3 className="script mt-4 text-5xl font-bold text-wedding-maroon">Laiba Khan</h3>
        <p className="wedding-gold quote my-1 text-lg italic">weds</p>
        <h3 className="script text-5xl font-bold text-wedding-maroon">Uzan Khan</h3>
        <div className="wedding-rule" />
        <p className="quote text-lg font-semibold text-wedding-maroon">InshaAllah, One Day</p>
        <p className="text-xs italic text-wedding-maroon/80">(The beginning of forever)</p>
        <div className="wedding-rule" />
        <p className="text-sm text-wedding-maroon">With the blessings of Allah<br />and our families</p>
        <p className="quote mt-3 text-sm italic text-wedding-maroon">Your presence will make it<br />even more special <Heart className="inline fill-primary text-primary" size={14} /></p>
        <div className="wedding-seal mx-auto mt-6 grid size-14 place-items-center rounded-full text-xl">♥</div>
      </div>
    </div>

    <form onSubmit={submit} className="relative mx-auto mt-10 max-w-md rounded-lg border border-paper/70 bg-paper/75 p-6 text-left shadow-xl backdrop-blur-md">
      <span aria-hidden className="absolute -left-3 -top-3 text-2xl text-primary">❀</span><span aria-hidden className="absolute -bottom-3 -right-3 text-2xl text-primary">❀</span>
      <h3 className="script text-center text-4xl text-primary">Write your heart out, My Januu ♥</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground">Tell me what you feel... and I'll get it directly in my heart (email) ♡</p>
      <label htmlFor="reply" className="sr-only">Your response</label>
      <textarea id="reply" rows={5} maxLength={3000} value={msg} onChange={e => setMsg(e.target.value)} disabled={status === "sent"} placeholder="Write your response here, My Januu..." className="mt-4 w-full resize-none rounded-lg border-2 border-rose-soft bg-background/70 p-4 outline-none transition focus:border-primary focus:shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_35%,transparent)]" />
      <div className="relative mt-3 text-center">
        {hearts && Array.from({ length: 14 }, (_, i) => <span key={i} aria-hidden className="wish-heart absolute text-primary" style={{ left: `${30 + (i * 7) % 40}%`, bottom: "50%", animationDuration: "2s", animationDelay: `${i * .06}s` }}>♥</span>)}
        {status === "sent"
          ? <p role="status" className="script animate-fade-in text-2xl text-primary">Sent with love! Uzan will receive it soon ♥</p>
          : <button type="submit" disabled={status === "sending" || !msg.trim()} className="magic-button inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground disabled:opacity-50"><Send size={16} />{status === "sending" ? "Sending…" : "Send to Uzan ♥"}</button>}
        {status === "error" && <p role="alert" className="mt-2 text-sm text-primary">It didn't go through — please check the internet and try again ♥</p>}
      </div>
    </form>
    <button onClick={onNext} className="magic-button mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Continue <ArrowRight size={18} /></button>
  </div>;
}
