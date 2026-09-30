import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Heart, RotateCcw } from "lucide-react";

type Props = { celebrate: () => void; chime: () => void; swell: () => void; fadeOut: () => void; onReplay: () => void };

const heartColors = ["var(--firework-rose)", "var(--primary)", "var(--firework-pearl)", "var(--gold)", "var(--lavender)", "oklch(0.55 0.2 305)", "oklch(0.58 0.23 25)"];
const fwColors = ["firework-rose", "firework-gold", "firework-pearl", "firework-pink"];
const mobile = () => typeof window !== "undefined" && window.innerWidth < 640;

function Firework({ x, y, delay, color, repeat }: { x: number; y: number; delay: number; color: string; repeat?: boolean }) {
  return (
    <span className={`wish-firework absolute ${color}`} style={{ left: `${x}%`, top: `${y}%`, background: "transparent" }}>
      <i className="wish-flash" style={{ animationDelay: `${delay}s`, animationIterationCount: repeat ? "infinite" : 1, animationDuration: repeat ? "4.5s" : undefined }} />
      {Array.from({ length: 14 }, (_, k) => {
        const a = (k / 14) * Math.PI * 2, r = 70 + (k % 3) * 18;
        return <i key={k} className="wish-spark" style={{ "--spark-x": `${Math.cos(a) * r}px`, "--spark-y": `${Math.sin(a) * r}px`, transform: `rotate(${(a * 180) / Math.PI + 90}deg)`, animationDelay: `${delay}s`, animationIterationCount: repeat ? "infinite" : 1, animationDuration: repeat ? "4.5s" : undefined } as CSSProperties} />;
      })}
    </span>
  );
}

export default function Finale({ celebrate, chime, swell, fadeOut, onReplay }: Props) {
  const [phase, setPhase] = useState<"idle" | "bye" | "after" | "glow">("idle");
  const [revealed, setRevealed] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const timers = useRef<number[]>([]);
  const small = mobile();

  useEffect(() => { celebrate(); swell(); return () => timers.current.forEach(clearTimeout); }, []);

  const bye = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setRipples(v => [...v, { id: Date.now(), x: e.clientX - r.left, y: e.clientY - r.top }]);
    if (phase !== "idle") return;
    setPhase("bye"); celebrate();
    const t = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
    for (let ms = 0; ms <= 8400; ms += 1400) t(chime, ms);
    t(celebrate, 3000); t(celebrate, 6000);
    t(() => setPhase("after"), 9500);
    t(fadeOut, 10500);
    t(() => setPhase("glow"), 15500);
  };

  const heartCount = small ? 34 : 70;
  const active = phase === "bye";

  return (
    <div className="chapter finale-scene relative flex min-h-[calc(100dvh-7rem)] items-center justify-center">
      {/* Night-to-dawn sky */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {Array.from({ length: small ? 30 : 60 }, (_, i) => <i key={`s${i}`} className="finale-star absolute rounded-full" style={{ left: `${(i * 53) % 100}%`, top: `${(i * 29) % 70}%`, width: i % 5 ? 2 : 3, height: i % 5 ? 2 : 3, animationDelay: `${(i % 10) * .3}s` }} />)}
        {[0, 1, 2].map(i => <i key={`sh${i}`} className="shooting-star absolute h-px w-24 finale-shoot" style={{ top: `${8 + i * 14}%`, left: 0, animationDelay: `${i * 3.3}s` }} />)}
        {([[15, 22], [82, 18], [50, 12], [30, 38], [72, 40]] as [number, number][]).slice(0, small ? 3 : 5).map(([x, y], i) => <Firework key={`f${i}`} x={x} y={y} delay={i * .9} color={fwColors[i % 4]!} repeat />)}
        {Array.from({ length: small ? 10 : 20 }, (_, i) => <i key={`p${i}`} className="wish-petal wish-petal-down" style={{ left: `${(i * 37) % 100}%`, animationDuration: `${11 + (i % 5) * 2}s`, animationDelay: `${-(i * 1.3)}s`, "--petal-sway": `${(i % 2 ? 1 : -1) * (30 + i * 4)}px` } as CSSProperties} />)}
        {Array.from({ length: small ? 8 : 16 }, (_, i) => <Heart key={`h${i}`} className="wish-heart absolute fill-current text-primary/70" size={12 + (i % 4) * 5} style={{ left: `${(i * 61) % 100}%`, animationDuration: `${8 + (i % 5)}s`, animationDelay: `${i * .7}s` }} />)}
      </div>

      {/* Bye celebration layer */}
      {active && <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {Array.from({ length: heartCount }, (_, i) => <Heart key={`bh${i}`} className="finale-fall absolute fill-current" size={14 + (i % 5) * 6} style={{ color: heartColors[i % heartColors.length], left: `${(i * 41) % 100}%`, animationDuration: `${3 + (i % 5) * .6}s`, animationDelay: `${(i * 8.5 / heartCount).toFixed(2)}s` }} />)}
        {Array.from({ length: small ? 14 : 28 }, (_, i) => <i key={`bp${i}`} className="wish-petal wish-petal-down" style={{ left: `${(i * 29) % 100}%`, animationDuration: `${4 + (i % 4)}s`, animationDelay: `${(i % 12) * .6}s`, "--petal-sway": `${(i % 2 ? 1 : -1) * 60}px` } as CSSProperties} />)}
        {Array.from({ length: small ? 20 : 40 }, (_, i) => <i key={`c${i}`} className={`wish-cannon absolute ${i % 2 ? "wish-cannon-right" : "wish-cannon-left"} ${fwColors[i % 4]!}`} style={{ animationDelay: `${(i % 10) * .25 + Math.floor(i / 20) * 3}s`, "--cannon-x": `${(i % 2 ? -1 : 1) * (20 + (i % 7) * 6)}vw`, "--cannon-y": `${-(35 + (i % 5) * 9)}vh` } as CSSProperties} />)}
        {Array.from({ length: small ? 6 : 10 }, (_, i) => <Firework key={`bf${i}`} x={10 + (i * 37) % 80} y={10 + (i * 23) % 50} delay={i * .8} color={fwColors[i % 4]!} />)}
        {Array.from({ length: small ? 16 : 30 }, (_, i) => <span key={`g${i}`} className="wish-glitter absolute text-gold" style={{ left: `${(i * 47) % 100}%`, top: `${(i * 31) % 100}%`, animationDelay: `${(i % 8) * .25}s` }}>✦</span>)}
      </div>}

      {/* Big bye text */}
      {active && <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center px-4 text-center">
        <div className="finale-bye-in">
          <p className="wish-title quote text-[clamp(2.6rem,13vw,8rem)] font-black leading-none text-primary">BYE JANUU <Heart className="inline fill-current align-middle" style={{ width: "0.8em", height: "0.8em" }} /></p>
          <p className="wish-title script mt-4 text-[clamp(1.8rem,8vw,4.5rem)] font-bold text-primary">See you soon, my love ♡</p>
        </div>
      </div>}

      {/* Final soft glow with a single beating heart */}
      {phase === "glow" && <div className="finale-glow fixed inset-0 z-50 grid place-items-center px-6 text-center">
        <div>
          <Heart className="finale-beat mx-auto fill-current text-primary" size={96} />
          <p className="script mt-6 text-[clamp(1.6rem,7vw,3rem)] text-primary">You are my forever, My Januu</p>
          <button onClick={onReplay} className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/30 bg-paper px-6 py-3 font-semibold text-primary"><RotateCcw size={17} /> Replay our story</button>
        </div>
      </div>}

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        {phase === "after" ? (
          <div className="finale-bye-in rounded-2xl border border-border bg-paper/70 px-6 py-10 backdrop-blur">
            <p className="quote text-[clamp(1.4rem,5vw,2.2rem)] italic">Until we meet again…</p>
            <p className="script mt-4 text-[clamp(2rem,8vw,3.5rem)] font-bold text-primary">You are my forever, My Januu ♡</p>
            <p className="script mt-4 text-[clamp(1.4rem,5vw,2rem)] text-primary">— Uzan Khan</p>
          </div>
        ) : (
          <>
            <h2 className="wish-title script text-[clamp(2.6rem,11vw,6rem)] font-bold leading-tight text-primary">Happy Birthday, My Januu!</h2>
            <div className="finale-message mx-auto mt-6 rounded-2xl border border-gold/60 bg-paper/60 px-5 py-6 backdrop-blur">
              <p className="quote text-[clamp(1.15rem,4.5vw,1.7rem)] italic">Thank you for being you, My Januu <Heart className="inline fill-current text-primary" size={20} /></p>
              <p className="mt-2 text-[clamp(.95rem,3.6vw,1.15rem)] text-muted-foreground">This was made with all my love, just for you.</p>
            </div>
            <p className="script mt-4 text-[clamp(1.6rem,6vw,2.2rem)] text-primary">— Uzan Khan ♥</p>
            <button onClick={() => setRevealed(true)} className="group mx-auto mt-6 block min-h-11 rounded-lg border border-border bg-paper/65 px-6 py-4 text-sm text-muted-foreground transition hover:bg-paper focus:bg-paper">
              <span className={revealed ? "hidden" : "group-hover:hidden group-focus:hidden"}>A tiny secret is hiding here…</span>
              <strong className={`${revealed ? "block" : "hidden group-hover:block group-focus:block"} text-primary`}>In every lifetime, I would still choose you. ✦</strong>
            </button>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button onClick={bye} disabled={phase !== "idle"} className="bye-button relative min-h-14 overflow-hidden rounded-full px-9 py-4 text-lg font-bold text-primary-foreground">
                Bye Januu <Heart className="finale-beat inline fill-current" size={20} />
                {ripples.map(r => <span key={r.id} className="bye-ripple" style={{ left: r.x, top: r.y }} onAnimationEnd={() => setRipples(v => v.filter(x => x.id !== r.id))} />)}
              </button>
              <button onClick={onReplay} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/30 bg-paper px-6 py-3 font-semibold text-primary"><RotateCcw size={17} /> Replay our story</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
