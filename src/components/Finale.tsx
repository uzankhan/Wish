import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Heart, RotateCcw } from "lucide-react";

type Props = {
  celebrate: () => void;
  chime: () => void;
  swell: () => void;
  fadeOut: () => void;
  onReplay: () => void;
};

// More heart colors for variety
const heartColors = [
  "var(--firework-rose)",
  "var(--primary)",
  "var(--firework-pearl)",
  "var(--gold)",
  "var(--lavender)",
  "oklch(0.55 0.2 305)",
  "oklch(0.58 0.23 25)",
  "oklch(0.65 0.18 30)",
  "oklch(0.7 0.15 350)",
  "oklch(0.6 0.2 280)",
  "oklch(0.75 0.12 85)",
  "oklch(0.68 0.22 10)",
];

const fwColors = [
  "firework-rose",
  "firework-gold",
  "firework-pearl",
  "firework-pink",
];

const mobile = () =>
  typeof window !== "undefined" && window.innerWidth < 640;

function Firework({
  x,
  y,
  delay,
  color,
  repeat,
}: {
  x: number;
  y: number;
  delay: number;
  color: string;
  repeat?: boolean;
}) {
  return (
    <span
      className={`wish-firework ${color}`}
      style={
        {
          left: `${x}%`,
          top: `${y}%`,
          animationDelay: `${delay}s`,
          animationIterationCount: repeat ? "infinite" : "1",
        } as CSSProperties
      }
    >
      {Array.from({ length: 14 }, (_, k) => {
        const a = (k / 14) * Math.PI * 2;
        const r = 70 + (k % 3) * 18;
        return (
          <span
            key={k}
            className="wish-spark"
            style={
              {
                "--spark-x": `${Math.cos(a) * r}px`,
                "--spark-y": `${Math.sin(a) * r}px`,
                animationDelay: `${delay + k * 0.01}s`,
              } as CSSProperties
            }
          />
        );
      })}
    </span>
  );
}

export default function Finale({
  celebrate,
  chime,
  swell,
  fadeOut,
  onReplay,
}: Props) {
  const [phase, setPhase] = useState<"idle" | "bye" | "after" | "glow">(
    "idle"
  );
  const [revealed, setRevealed] = useState(false);
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const timers = useRef<number[]>([]);
  const small = mobile();

  useEffect(() => {
    celebrate();
    swell();
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const bye = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.currentTarget as HTMLElement;
    const r = target.getBoundingClientRect();
    const point =
      "touches" in e && e.touches && e.touches.length > 0
        ? e.touches[0]
        : "clientX" in e && "clientY" in e
          ? e
          : null;
    const clientX = point?.clientX ?? 0;
    const clientY = point?.clientY ?? 0;

    setRipples((v) => [
      ...v,
      { id: Date.now(), x: clientX - r.left, y: clientY - r.top },
    ]);

    if (phase !== "idle") return;
    setPhase("bye");
    celebrate();

    const t = (fn: () => void, ms: number) =>
      timers.current.push(window.setTimeout(fn, ms));

    for (let ms = 0; ms <= 8400; ms += 1400) t(chime, ms);
    t(celebrate, 3000);
    t(celebrate, 6000);
    t(() => setPhase("after"), 9500);
    t(fadeOut, 10500);
    t(() => setPhase("glow"), 15500);
  };

  // More hearts on mobile for fuller effect
  const heartCount = small ? 50 : 90;
  const active = phase === "bye";

  return (
    <section className="finale-scene chapter relative min-h-[100dvh] overflow-hidden px-4 py-14 sm:px-6">
      {/* Night-to-dawn sky */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: small ? 30 : 60 }, (_, i) => (
          <span
            key={`star-${i}`}
            className="finale-star absolute size-1 rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 70}%`,
              animationDelay: `${(i % 10) * 0.3}s`,
            }}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <span
            key={`shoot-${i}`}
            className="finale-shoot absolute h-px w-24"
            style={{
              left: `${10 + i * 30}%`,
              top: `${8 + i * 12}%`,
              animationDelay: `${i * 3.5}s`,
            }}
          />
        ))}
        {(
          [
            [15, 22],
            [82, 18],
            [50, 12],
            [30, 38],
            [72, 40],
          ] as [number, number][]
        )
          .slice(0, small ? 3 : 5)
          .map(([x, y], i) => (
            <Firework
              key={`fw-${i}`}
              x={x}
              y={y}
              delay={i * 0.7}
              color={fwColors[i % fwColors.length]!}
              repeat
            />
          ))}
        {Array.from({ length: small ? 10 : 20 }, (_, i) => (
          <span
            key={`bokeh-${i}`}
            className="wish-bokeh absolute size-1.5 rounded-full"
            style={{
              left: `${(i * 41) % 100}%`,
              top: `${(i * 29) % 100}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
        {Array.from({ length: small ? 8 : 16 }, (_, i) => (
          <span
            key={`glitter-${i}`}
            className="wish-glitter absolute text-[10px] text-[var(--gold)]"
            style={{
              left: `${(i * 61) % 100}%`,
              top: `${(i * 17) % 90}%`,
              animationDelay: `${i * 0.25}s`,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* Bye celebration layer */}
      {active && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* HEARTS FALLING FROM TOP - Different colors */}
          {Array.from({ length: heartCount }, (_, i) => (
            <span
              key={`bye-heart-${i}`}
              className="finale-fall absolute text-xl sm:text-3xl"
              style={
                {
                  left: `${(i * 13.7) % 100}%`,
                  color: heartColors[i % heartColors.length],
                  animationDelay: `${(i % 12) * 0.35}s`,
                  animationDuration: `${3.5 + (i % 5) * 0.8}s`,
                } as CSSProperties
              }
            >
              ♥
            </span>
          ))}

          {/* PARTY POPPERS - Confetti bursts from sides */}
          {Array.from({ length: small ? 14 : 28 }, (_, i) => (
            <span
              key={`popper-${i}`}
              className="confetti-piece absolute size-2 rounded-sm"
              style={
                {
                  left: `${i % 2 === 0 ? 0 : 100}%`,
                  top: `${10 + (i * 11) % 70}%`,
                  background: heartColors[i % heartColors.length],
                  animationDelay: `${(i % 8) * 0.4}s`,
                  animationDuration: `${2.8 + (i % 4) * 0.5}s`,
                } as CSSProperties
              }
            />
          ))}

          {/* Rose petals falling */}
          {Array.from({ length: small ? 20 : 40 }, (_, i) => (
            <span
              key={`petal-fall-${i}`}
              className="wish-petal wish-petal-down"
              style={
                {
                  left: `${(i * 17) % 100}%`,
                  animationDelay: `${(i % 10) * 0.5}s`,
                  animationDuration: `${4 + (i % 4) * 1.2}s`,
                  "--petal-sway": `${(i % 2 ? 1 : -1) * (30 + i * 3)}px`,
                } as CSSProperties
              }
            />
          ))}

          {/* Sparkles */}
          {Array.from({ length: small ? 16 : 30 }, (_, i) => (
            <span
              key={`sparkle-${i}`}
              className="wish-glitter absolute text-xs text-[var(--firework-pearl)]"
              style={{
                left: `${(i * 31) % 100}%`,
                top: `${(i * 47) % 100}%`,
                animationDelay: `${i * 0.15}s`,
              }}
            >
              ✦
            </span>
          ))}
        </div>
      )}

      {/* Big BYE JANUU text */}
      {active && (
        <div className="relative z-10 flex min-h-[70dvh] flex-col items-center justify-center text-center">
          <h2
            className="script finale-bye-in text-5xl font-bold sm:text-7xl md:text-8xl"
            style={{
              color: "var(--foreground)",
              textShadow:
                "0 0 20px color-mix(in oklab, var(--primary) 80%, transparent), 0 0 40px color-mix(in oklab, var(--gold) 60%, transparent), 0 0 80px color-mix(in oklab, var(--firework-pink) 50%, transparent)",
            }}
          >
            BYE JANUU
          </h2>
          <p
            className="script mt-4 text-2xl sm:text-3xl md:text-4xl"
            style={{
              color: "var(--foreground)",
              textShadow: "0 0 16px color-mix(in oklab, var(--gold) 60%, transparent)",
            }}
          >
            See you soon, my love ♡
          </p>
          <p
            className="mt-6 max-w-md text-sm sm:text-base"
            style={{ color: "color-mix(in oklab, var(--foreground) 80%, transparent)" }}
          >
            Until we meet again…
          </p>
        </div>
      )}

      {/* Final soft glow with a single beating heart */}
      {phase === "glow" && (
        <div className="finale-glow absolute inset-0 z-20 grid place-items-center px-4">
          <div className="text-center">
            <Heart
              className="finale-beat mx-auto text-5xl sm:text-6xl"
              style={{ color: "var(--primary)" }}
              fill="currentColor"
            />
            <p className="script mt-6 text-2xl sm:text-3xl" style={{ color: "var(--foreground)" }}>
              You are my forever, My Januu
            </p>
            <button
              onClick={onReplay}
              className="magic-button safe-bottom mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              <RotateCcw size={16} /> Replay our story
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      {phase !== "glow" && (
        <div className="relative z-10 mx-auto mt-10 max-w-xl text-center">
          {phase === "after" ? (
            <div className="chapter">
              <p className="script text-3xl sm:text-4xl" style={{ color: "var(--foreground)" }}>
                Until we meet again…
              </p>
              <p className="script mt-4 text-2xl sm:text-3xl" style={{ color: "var(--foreground)" }}>
                You are my forever, My Januu ♡
              </p>
              <p className="mt-6 text-sm" style={{ color: "color-mix(in oklab, var(--foreground) 75%, transparent)" }}>
                — Uzan Khan
              </p>
            </div>
          ) : (
            <>
              <h2 className="script text-4xl sm:text-5xl" style={{ color: "var(--foreground)" }}>
                Happy Birthday, My Januu!
              </h2>
              <p className="mt-4 text-sm sm:text-base" style={{ color: "color-mix(in oklab, var(--foreground) 85%, transparent)" }}>
                Thank you for being you, My Januu
              </p>
              <p className="mt-2 text-sm" style={{ color: "color-mix(in oklab, var(--foreground) 75%, transparent)" }}>
                This was made with all my love, just for you.
              </p>
              <p className="mt-2 text-sm" style={{ color: "color-mix(in oklab, var(--foreground) 75%, transparent)" }}>
                — Uzan Khan ♥
              </p>

              {!revealed && (
                <button
                  onClick={() => setRevealed(true)}
                 className="group mt-8 block min-h-11 w-full rounded-lg border border-border bg-paper px-6 py-4 text-sm text-muted-foreground transition sm:mx-auto sm:w-auto"
                >
                  A tiny secret is hiding here…
                  <span className="mt-1 block text-primary opacity-0 transition group-hover:opacity-100 group-focus:opacity-100">
                    In every lifetime, I would still choose you. ✦
                  </span>
                </button>
              )}
              {revealed && (
                <p className="script mt-4 text-xl sm:text-2xl" style={{ color: "var(--gold)" }}>
                  In every lifetime, I would still choose you. ✦
                </p>
              )}

              {/* BYE JANUU BUTTON - replaces More Magic */}
              <button
                onClick={bye}
                onTouchStart={bye}
                className="bye-button relative mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-base font-semibold text-primary-foreground sm:w-auto"
                aria-label="Bye Januu — celebrate with hearts"
              >
                Bye Januu 💗
                {ripples.map((r) => (
                  <span
                    key={r.id}
                    className="bye-ripple"
                    style={{ left: `${r.x}px`, top: `${r.y}px` }}
                    onAnimationEnd={() =>
                      setRipples((v) => v.filter((x) => x.id !== r.id))
                    }
                  />
                ))}
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}