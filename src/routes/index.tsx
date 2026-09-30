import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CakeSlice, Gift, Heart, Music2, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Proposal } from "../components/Proposal";
import floralWreath from "../assets/romantic-floral-wreath.png";
import chocolateCake from "../assets/chocolate-cake.png";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "A Special Surprise for My Januu" },
    { name: "description", content: "A magical birthday love letter from Uzan Khan to My Januu." },
    { property: "og:title", content: "A Special Surprise for My Januu" },
    { property: "og:description", content: "A magical birthday love letter from Uzan Khan to My Januu." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: BirthdaySurprise,
});

const chapterNames = ["Welcome", "Secret", "Wish", "Cake", "Forever?", "Memories", "Fun", "Letter", "Always"];
const memories = [
  ["🌅", "Remember this day?"], ["💬", "Our first conversation…"],
  ["😂", "This was so funny!"], ["💞", "Forever my favourite memory"],
];
const reasons = ["Your smile makes every day brighter.","You understand my silences.","You make ordinary moments magical.","Your laugh is my favourite sound.","You are endlessly kind.","You believe in me.","You make me feel at home.","Every memory is better with you.","You are beautifully, wonderfully you.","Simply: you are my Januu. ♥"];
const jarMemories = ["The first time you made me forget what I was saying.","That laugh I could listen to forever.","The little conversations that became my favourite memories.","Every time a simple hello made my whole day."];
const wishFireworks = [
  [15,21,0],[78,17,.15],[50,30,.35],[29,52,1.1],[88,47,1.3],[64,12,1.45],
  [13,39,2.15],[67,59,2.3],[43,13,2.6],[92,24,3.35],[22,72,3.55],[74,43,3.75],
  [73,34,4.55],[38,43,4.7],[56,69,4.9],[9,17,5.7],[83,62,5.9],[47,26,6.1],
  [26,32,6.95],[69,16,7.1],[58,56,7.35],[12,67,8.05],[87,30,8.2],[39,19,8.35],
] as const;
const wishColors = ["firework-rose","firework-gold","firework-pearl","firework-pink"];

function MagicButton({ children, onClick, type="button", disabled=false, className="" }: { children:ReactNode;onClick?:()=>void;type?:"button"|"submit";disabled?:boolean;className?:string }) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`magic-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-40 ${className}`}>{children}</button>;
}

function BirthdaySurprise() {
  const [chapter,setChapter]=useState(0); const [unlocked,setUnlocked]=useState(false);
  const [playing,setPlaying]=useState(false); const [volume,setVolume]=useState(.18); const audio=useRef<AudioContext|null>(null); const timer=useRef<number|null>(null);
  const [confetti,setConfetti]=useState<number[]>([]); const [countdown,setCountdown]=useState("");
  useEffect(()=>{ const tick=()=>{const now=new Date();let target=new Date(now.getFullYear(),9,1);if(now>target)target=new Date(now.getFullYear()+1,9,1);const d=target.getTime()-now.getTime();setCountdown(`${Math.floor(d/86400000)}d  ${Math.floor(d/3600000)%24}h  ${Math.floor(d/60000)%60}m  ${Math.floor(d/1000)%60}s`)};tick();const id=window.setInterval(tick,1000);return()=>clearInterval(id)},[]);
  useEffect(()=>{const move=(e:PointerEvent)=>{if(Math.random()>.62){const s=document.createElement("span");s.className="cursor-heart";s.textContent=Math.random()>.5?"💗":"✦";s.style.left=`${e.clientX}px`;s.style.top=`${e.clientY}px`;document.body.appendChild(s);setTimeout(()=>s.remove(),800)}};window.addEventListener("pointermove",move);return()=>window.removeEventListener("pointermove",move)},[]);
  useEffect(()=>()=>{if(timer.current)window.clearInterval(timer.current);audio.current?.close()},[]);
  const sound=(notes=[523.25,659.25,783.99])=>{try{const ctx=audio.current??new AudioContext();audio.current=ctx;notes.forEach((n,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type="sine";o.frequency.value=n;g.gain.setValueAtTime(volume*.18,ctx.currentTime+i*.1);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+i*.1+.35);o.connect(g).connect(ctx.destination);o.start(ctx.currentTime+i*.1);o.stop(ctx.currentTime+i*.1+.36)})}catch{return}};
  const toggleMusic=()=>{if(!playing){sound([261.63,329.63,392,523.25]);timer.current=window.setInterval(()=>sound([261.63,329.63,392,523.25]),4300);setPlaying(true)}else{if(timer.current)window.clearInterval(timer.current);setPlaying(false)}};
  const celebrate=()=>{setConfetti(Array.from({length:55},(_,i)=>Date.now()+i));sound([523,659,784,1047]);setTimeout(()=>setConfetti([]),3000)};
  const tune=()=>{try{const ctx=audio.current??new AudioContext();audio.current=ctx;const r=(n:number)=>261.63*Math.pow(2,n/12);const m:[number,number][]=[[7,.3],[7,.15],[9,.5],[7,.5],[12,.5],[11,1],[7,.3],[7,.15],[9,.5],[7,.5],[14,.5],[12,1],[7,.3],[7,.15],[19,.5],[16,.5],[12,.5],[11,.5],[9,1],[17,.3],[17,.15],[16,.5],[12,.5],[14,.5],[12,1.2]];let t=ctx.currentTime+.05;const v=Math.max(volume,.12)*.9;m.forEach(([n,d])=>{[1,2].forEach(h=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=h===1?"triangle":"sine";o.frequency.value=r(n)*h;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v/h,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+d*.95);o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+d)});t+=d*.9})}catch{return}};
  const soften=(on:boolean)=>setVolume(v=>on?(v>0?Math.min(v,.05):0):(v>0?.18:0));
  const go=(n:number)=>{setChapter(Math.max(0,Math.min(8,n)));sound([440,587]);};
  return <main onClick={(e)=>{const r=document.createElement("i");r.className="cursor-heart";r.textContent="✦";r.style.left=`${e.clientX}px`;r.style.top=`${e.clientY}px`;document.body.appendChild(r);setTimeout(()=>r.remove(),800)}} className="dream-bg relative h-[100dvh] overflow-hidden text-foreground selection:bg-primary/20">
    <MagicSky />
    {confetti.map((id,i)=><i key={id} className="confetti-piece h-3 w-2 rounded-sm bg-gold" style={{left:`${(i*37)%100}%`,"--dx":`${(i%2?1:-1)*(20+i%50)}px`,animationDelay:`${(i%9)*.04}s`} as CSSProperties}/>)}
    {chapter>0&&<header className="safe-top fixed inset-x-0 top-0 z-50 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3 sm:p-5">
      <button aria-label="Previous chapter" onClick={()=>go(chapter-1)} className="grid size-10 place-items-center rounded-full border border-border bg-paper/80 text-primary backdrop-blur"><ArrowLeft size={18}/></button>
      <div className="mx-auto flex max-w-xl items-center gap-1.5" aria-label={`Chapter ${chapter+1} of 9`}>
        {chapterNames.map((n,i)=><button key={n} aria-label={n} onClick={()=>unlocked&&go(i)} className={`grid size-6 place-items-center text-xs transition sm:size-8 ${i<=chapter?"text-primary":"text-muted-foreground/40"}`}>{i<=chapter?"♥":"♡"}</button>)}
      </div><span className="hidden text-xs font-medium text-muted-foreground sm:block">{chapterNames[chapter]}</span>
    </header>}
    <section className="scrollbar-soft relative z-10 h-full overflow-y-auto px-4 pb-28 pt-[calc(4.5rem+env(safe-area-inset-top))] sm:px-8">
      {chapter===0&&<Welcome countdown={countdown} onStart={()=>{toggleMusic();go(1)}}/>}
      {chapter===1&&<Lock onUnlock={()=>{setUnlocked(true);celebrate();setTimeout(()=>go(2),1900)}}/>}
      {chapter===2&&<Wish onNext={()=>go(3)} chime={()=>sound([783.99,1046.5,1318.51,1567.98])}/>} {chapter===3&&<Cake celebrate={celebrate} chime={()=>sound([783.99,1046.5,1318.51,1567.98])} tune={tune} soften={soften} onNext={()=>go(4)}/>} {chapter===4&&<Proposal celebrate={celebrate} chime={()=>sound([783.99,1046.5,1318.51,1567.98])} onNext={()=>go(5)}/>} {chapter===5&&<MemoryLane onNext={()=>go(6)}/>} {chapter===6&&<FunZone onNext={()=>go(7)} celebrate={celebrate}/>} {chapter===7&&<Letter onNext={()=>go(8)}/>} {chapter===8&&<Finale celebrate={celebrate} chime={()=>sound([783.99,1046.5,1318.51,1567.98])} swell={()=>sound([196,261.63,329.63,392,523.25,659.25])} fadeOut={()=>{if(timer.current)window.clearInterval(timer.current);setPlaying(false);sound([523.25,392,329.63,261.63])}} onReplay={()=>{setUnlocked(false);setChapter(0)}}/>}
    </section>
    <div className="safe-bottom fixed right-3 z-50 flex items-center gap-2 rounded-full border border-border bg-paper/85 p-2 shadow-lg backdrop-blur">
      <button aria-label={playing?"Pause music":"Play music"} onClick={toggleMusic} className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">{playing?<Pause size={16}/>:<Play size={16}/>}</button>
      <button aria-label={volume?"Mute":"Unmute"} onClick={()=>setVolume(volume?0:.18)} className="grid size-11 place-items-center text-primary">{volume?<Volume2 size={16}/>:<VolumeX size={16}/>}</button>
      <input aria-label="Volume" className="hidden w-20 accent-primary sm:block" type="range" min="0" max="0.5" step="0.02" value={volume} onChange={e=>setVolume(Number(e.target.value))}/>
    </div>
    <footer className="pointer-events-none fixed bottom-1 left-3 z-40 hidden text-[10px] sm:block text-muted-foreground sm:text-xs">Made with ♥ by Uzan Khan for My Januu</footer>
  </main>;
}

function MagicSky(){return <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">{Array.from({length:12},(_,i)=><span key={`p${i}`} className="petal text-lg" style={{left:`${i*9}%`,animationDuration:`${10+i%5}s`,animationDelay:`-${i*.8}s`}}>{i%3===0?"❀":"🌷"}</span>)}{Array.from({length:10},(_,i)=><span key={`h${i}`} className="heart-float text-sm" style={{left:`${(i*13)%100}%`,animationDuration:`${9+i%6}s`,animationDelay:`-${i*1.2}s`}}>♡</span>)}<span className="shooting-star absolute top-6 text-gold">✦ ─────</span></div>}
function Frame({children,className=""}:{children:ReactNode;className?:string}){return <div className={`mx-auto w-full max-w-3xl rounded-lg border border-paper/70 bg-paper/70 p-5 shadow-[0_20px_70px_color-mix(in_oklab,var(--primary)_18%,transparent)] backdrop-blur-md sm:p-10 ${className}`}>{children}</div>}

function Welcome({countdown,onStart}:{countdown:string;onStart:()=>void}){const [gift,setGift]=useState(false);return <div className="chapter mx-auto flex min-h-[calc(100dvh-5rem)] max-w-5xl flex-col items-center justify-center text-center"><div className="relative mb-2 size-32 sm:size-44"><img src={floralWreath} alt="Pink roses and white lilies" width={1024} height={1024} className="size-full rounded-full object-cover shadow-xl"/><Gift className="floaty absolute inset-0 m-auto text-primary" size={44}/></div><p className="mb-2 text-xs font-semibold uppercase tracking-[.22em] text-muted-foreground">October 1 • a little world made for you</p><h1 className="script max-w-4xl text-5xl font-bold leading-tight text-primary drop-shadow-sm sm:text-7xl">A Special Surprise for My Januu ♥</h1><p className="quote mt-4 text-lg italic text-foreground/75">Something magical, made just for you…</p><div className="my-7 rounded-lg border border-border bg-paper/55 px-5 py-3"><span className="block text-[10px] uppercase tracking-[.2em] text-muted-foreground">Counting down to your day</span><strong className="mt-1 block tabular-nums text-primary">{countdown}</strong></div><div className="flex flex-wrap justify-center gap-3"><MagicButton onClick={onStart}>Click to Start <span>✦</span></MagicButton><button onClick={()=>setGift(!gift)} aria-label="Open virtual gift" className="grid size-12 place-items-center rounded-full border border-primary/30 bg-paper text-primary transition hover:-translate-y-1"><Gift size={20}/></button></div>{gift&&<p className="quote mt-5 animate-fade-in text-lg italic text-primary">A lifetime supply of my love—no returns allowed. Gift</p>}</div>}

function Lock({onUnlock}:{onUnlock:()=>void}){const [value,setValue]=useState("");const [error,setError]=useState(false);const [success,setSuccess]=useState(false);const submit=(e:FormEvent)=>{e.preventDefault();if(value==="for-you-i-will"){setSuccess(true);setError(false);onUnlock()}else{setError(true);setValue("");setTimeout(()=>setError(false),1200)}};return <div className="chapter flex min-h-[calc(100dvh-6rem)] items-center"><Frame className={`text-center ${error?"shake":""}`}><div className="floaty mx-auto mb-5 grid size-24 place-items-center rounded-full bg-rose-soft text-5xl shadow-xl">{success?"♥":"♥"}</div><h2 className="script text-5xl font-bold text-primary">{success?"Welcome, My Januu! ✦":"Only for My Januu"}</h2><p className="mt-3 text-sm text-muted-foreground">Enter the secret code to unlock your surprise…</p><form onSubmit={submit} className="mx-auto mt-8 max-w-sm"><label className="sr-only" htmlFor="secret">Secret code</label><input id="secret" autoFocus type="password" value={value} onChange={e=>{setValue(e.target.value);setError(false)}} className="w-full rounded-full border border-border bg-background/70 px-5 py-3 text-center outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="Our secret code"/><MagicButton type="submit" className="mt-4 w-full">Unlock ♥</MagicButton>{error&&<p role="alert" className="mt-4 text-sm font-medium text-primary">Oops! That's not you  Try again, My Januu!</p>}</form></Frame></div>}

function Wish({onNext,chime}:{onNext:()=>void;chime:()=>void}){
  const text="You are my best friend, my crush, my everything. Today is your day, and I just want to see you smile. Without you, everything feels incomplete. You are the reason my world feels brighter. — Yours forever, Uzan Khan 💗";
  const [shown,setShown]=useState("");
  const chimeRef=useRef(chime);
  chimeRef.current=chime;
  useEffect(()=>{
    let i=0;
    const typing=window.setInterval(()=>{i++;setShown(text.slice(0,i));if(i>=text.length)window.clearInterval(typing)},34);
    const first=window.setTimeout(()=>chimeRef.current(),300);
    const ringing=window.setInterval(()=>chimeRef.current(),2200);
    const stop=window.setTimeout(()=>window.clearInterval(ringing),8800);
    return()=>{window.clearInterval(typing);window.clearTimeout(first);window.clearInterval(ringing);window.clearTimeout(stop)};
  },[]);
  return <div className="wish-scene chapter relative isolate flex min-h-[calc(100dvh-6rem)] items-center justify-center py-10 text-center">
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="wish-halo absolute inset-0"/>
      {Array.from({length:24},(_,i)=><i key={`b${i}`} className="wish-bokeh absolute rounded-full" style={{left:`${(i*43+7)%100}%`,top:`${(i*31+12)%88}%`,width:`${7+i%5*5}px`,height:`${7+i%5*5}px`,animationDelay:`-${i*.61}s`,animationDuration:`${3+i%4}s`}}/>)}
      {wishFireworks.map(([x,y,delay],i)=><div key={`f${i}`} className={`wish-firework absolute ${wishColors[i%wishColors.length]}`} style={{left:`${x}%`,top:`${y}%`,animationDelay:`${delay}s`}}>
        <i className="wish-flash" style={{animationDelay:`${delay}s`}}/>
        {Array.from({length:16},(_,j)=>{const angle=j*Math.PI/8;return <i key={j} className="wish-spark" style={{"--spark-x":`${Math.cos(angle)*(48+i%3*16)}px`,"--spark-y":`${Math.sin(angle)*(48+i%3*16)}px`,animationDelay:`${delay}s`} as CSSProperties}/>})}
      </div>)}
      {Array.from({length:40},(_,i)=><i key={`p${i}`} className={`wish-petal ${i%2?"wish-petal-up":"wish-petal-down"}`} style={{left:`${(i*37+4)%100}%`,animationDelay:`-${(i*1.17)%9}s`,animationDuration:`${6+i%5}s`,"--petal-sway":`${(i%2?1:-1)*(28+i%4*17)}px`} as CSSProperties}/>)}
      {Array.from({length:38},(_,i)=><i key={`c${i}`} className={`wish-cannon absolute ${i%2?"wish-cannon-right":"wish-cannon-left"} ${wishColors[i%4]}`} style={{"--cannon-x":`${(i%2?-1:1)*(85+i%9*28)}px`,"--cannon-y":`${-125-i%7*42}px`,animationDelay:`${(i%19)*.12}s`} as CSSProperties}/>)}
      {Array.from({length:18},(_,i)=><span key={`h${i}`} className="wish-heart absolute text-primary" style={{left:`${(i*29+9)%96}%`,animationDelay:`-${i*.67}s`,animationDuration:`${5+i%4}s`}}>♥</span>)}
      {Array.from({length:32},(_,i)=><span key={`g${i}`} className="wish-glitter absolute text-gold" style={{left:`${(i*47+3)%98}%`,top:`${(i*37+9)%96}%`,animationDelay:`-${i*.23}s`}}>✦</span>)}
    </div>
    <div className="relative z-10 mx-auto w-full max-w-4xl px-2">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[.25em] text-primary sm:text-sm">October 1 · the world celebrates you</p>
      <div className="wish-title-wrap relative mx-auto max-w-3xl">
        <span aria-hidden="true" className="wish-crown script block text-4xl text-gold sm:text-5xl">✦ ♥ ✦</span>
        <h2 className="wish-title script relative mx-auto mt-2 text-[clamp(2.8rem,9vw,6.5rem)] font-bold leading-[1.04] text-primary">Happy Birthday,<br/>My Januu! <CakeSlice aria-label="birthday cake" className="inline-block size-[.65em] align-baseline text-gold" strokeWidth={1.6}/></h2>
      </div>
      <div className="mx-auto mt-7 max-w-2xl border-y border-primary/20 bg-paper/65 px-4 py-5 shadow-lg backdrop-blur-sm sm:mt-9 sm:px-10 sm:py-7">
        <p className="quote min-h-40 text-base leading-8 italic text-foreground sm:min-h-32 sm:text-xl">{shown.replace("💗", "")} {shown.includes("💗")&&<Heart className="inline-block size-5 fill-primary align-middle text-primary" aria-label="pink heart"/>}<span aria-hidden="true" className="animate-pulse text-primary">|</span></p>
      </div>
      <div aria-hidden="true" className="mt-5 text-xl text-primary">✦ &nbsp; ♡ &nbsp; ✦</div>
      <MagicButton onClick={onNext} className="mt-4">Make a wish <ArrowRight size={18}/></MagicButton>
    </div>
  </div>;
}

const balloonColors=["var(--firework-pink)","var(--gold)","var(--paper)","var(--lavender)"];
function Cake({celebrate,chime,tune,soften,onNext}:{celebrate:()=>void;chime:()=>void;tune:()=>void;soften:(on:boolean)=>void;onNext:()=>void}){
  type Phase="intro"|"pause"|"blow"|"granted"|"cut"|"reveal";
  const [phase,setPhase]=useState<Phase>("intro");const [candles,setCandles]=useState([true,true,true]);
  const timers=useRef<number[]>([]);const later=(f:()=>void,ms:number)=>{timers.current.push(window.setTimeout(f,ms))};
  useEffect(()=>()=>{timers.current.forEach(clearTimeout);soften(false)},[]);// eslint-disable-line react-hooks/exhaustive-deps
  const startPause=()=>{setPhase("pause");soften(true);chime();later(()=>setPhase("blow"),2600)};
  const blow=(i:number)=>{if(phase!=="blow")return;const next=candles.map((v,j)=>j===i?false:v);setCandles(next);chime();if(next.every(v=>!v)){later(()=>{setPhase("granted");soften(false)},600)}};
  const cut=()=>{setPhase("cut");celebrate();tune();later(celebrate,1600);later(celebrate,3400);later(()=>setPhase("reveal"),6500)};
  const partying=phase==="cut"||phase==="reveal";
  const msg=phase==="intro"?"Ready for the sweetest moment?":phase==="blow"?"Tap each candle to blow it out ♥":phase==="granted"?"Now take the knife and cut the cake":"";
  return <div className="chapter relative isolate flex min-h-[calc(100dvh-6rem)] items-center py-8">
    {partying&&<div aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {wishFireworks.map(([x,y,d],i)=><div key={`f${i}`} className={`wish-firework absolute ${wishColors[i%4]}`} style={{left:`${x}%`,top:`${y}%`,animationDelay:`${d*.8}s`}}><i className="wish-flash" style={{animationDelay:`${d*.8}s`}}/>{Array.from({length:14},(_,j)=>{const a=j*Math.PI/7;return <i key={j} className="wish-spark" style={{"--spark-x":`${Math.cos(a)*(50+i%3*18)}px`,"--spark-y":`${Math.sin(a)*(50+i%3*18)}px`,animationDelay:`${d*.8}s`} as CSSProperties}/>})}</div>)}
      {Array.from({length:44},(_,i)=><i key={`c${i}`} className={`wish-cannon absolute ${i%2?"wish-cannon-right":"wish-cannon-left"} ${wishColors[i%4]}`} style={{"--cannon-x":`${(i%2?-1:1)*(90+i%9*30)}px`,"--cannon-y":`${-140-i%7*45}px`,animationDelay:`${(i%22)*.08}s`} as CSSProperties}/>)}
      {Array.from({length:36},(_,i)=><i key={`p${i}`} className={`wish-petal ${i%2?"wish-petal-up":"wish-petal-down"}`} style={{left:`${(i*37+4)%100}%`,animationDelay:`-${(i*1.17)%9}s`,animationDuration:`${6+i%5}s`,"--petal-sway":`${(i%2?1:-1)*(28+i%4*17)}px`} as CSSProperties}/>)}
      {Array.from({length:26},(_,i)=><span key={`b${i}`} className="cake-balloon" style={{left:`${(i*41+3)%96}%`,background:balloonColors[i%4],animationDelay:`${(i%13)*.35}s`,animationDuration:`${6+i%4}s`,"--sway":`${(i%2?1:-1)*(20+i%5*8)}px`} as CSSProperties}/>)}
    </div>}
    {phase==="pause"&&<div className="cake-pause fixed inset-0 z-30 grid place-items-center px-6 text-center"><p className="script text-4xl font-bold text-paper drop-shadow-lg sm:text-6xl">Wait… close your eyes<br/>and make a wish first <Heart className="inline size-[.7em] fill-paper"/></p></div>}
    <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-muted-foreground">The sweetest chapter</p>
      <h2 className="script text-5xl font-bold text-primary">Your Birthday Cake</h2>
      {phase==="granted"&&<p className="script mt-2 animate-scale-in text-4xl font-bold text-gold drop-shadow">Wish granted! ✦</p>}
      <p className="mt-2 min-h-5 text-sm text-muted-foreground">{msg}</p>
      <div className={`cake-stage relative mx-auto mt-4 aspect-square w-[min(88vw,440px)] ${phase==="pause"?"cake-frozen":""}`}>
        <div className="cake-shadow absolute inset-x-[18%] bottom-[2%] h-[6%] rounded-full"/>
        <img src={chocolateCake} alt="Realistic two-tier chocolate cake with ganache drips, strawberries, cherries, lilies and roses, reading Happy Birthday My Januu" width={1024} height={1024} className={`cake-half cake-left absolute inset-0 size-full ${partying?"cake-cut":""}`}/>
        <img src={chocolateCake} alt="" aria-hidden="true" width={1024} height={1024} className={`cake-half cake-right absolute inset-0 size-full ${partying?"cake-cut":""}`}/>
        {!partying&&<div className="absolute left-[39%] top-[3%] flex w-[26%] justify-between">{candles.map((lit,i)=><button key={i} aria-label={`Blow out candle ${i+1}`} disabled={!lit||phase!=="blow"} onClick={()=>blow(i)} className="relative h-[5.5rem] w-7 sm:h-24">
          {lit?<i className="flame cake-flame absolute left-1/2 top-0 h-7 w-4 -translate-x-1/2"/>:<><i className="cake-smoke"/><i className="cake-smoke" style={{animationDelay:".3s"}}/></>}
          <i className="cake-candle absolute bottom-0 left-1/2 h-[70%] w-3 -translate-x-1/2 rounded-sm"/>
        </button>)}</div>}
        {phase==="granted"&&Array.from({length:10},(_,i)=><span key={i} className="wish-glitter absolute text-gold" style={{left:`${20+(i*37)%60}%`,top:`${(i*23)%40}%`,animationDelay:`-${i*.2}s`}}>✦</span>)}
        {phase==="granted"&&<button onClick={cut} aria-label="Cut the cake with the knife" className="cake-knife absolute right-[4%] top-[18%] z-10 text-5xl sm:text-6xl">🔪</button>}
      </div>
      {phase==="intro"&&<MagicButton onClick={startPause}>Cut the cake ✦</MagicButton>}
      {phase==="granted"&&<MagicButton onClick={cut}>Tap the knife to cut</MagicButton>}
      {phase==="cut"&&<p className="script animate-fade-in text-5xl font-bold text-primary">Happy Birthday! ♥</p>}
      {phase==="reveal"&&<div className="relative mx-auto mt-2 max-w-xl animate-scale-in">
        {Array.from({length:12},(_,i)=><span key={i} aria-hidden="true" className="wish-heart absolute text-primary" style={{left:`${(i*29+5)%95}%`,bottom:0,animationDelay:`-${i*.5}s`,animationDuration:`${4+i%3}s`}}>♥</span>)}
        <div className="cake-card relative rounded-2xl border border-gold/50 bg-paper/85 px-6 py-7 backdrop-blur-md">
          <p className="script text-3xl font-bold text-primary sm:text-4xl">Your gift is with me, My Januu <Gift className="inline size-7 text-gold"/> ✦</p>
          <p className="quote mt-4 text-lg italic leading-8 text-foreground">To get it, you'll have to come to me…<br/>And send me your picture in my favourite pose <Heart className="inline size-5 fill-primary text-primary"/> <span className="cake-wink inline-block">😉</span></p>
        </div>
        <MagicButton onClick={onNext} className="mt-5">Continue <ArrowRight size={18}/></MagicButton>
      </div>}
    </div>
  </div>;
}

function MemoryLane({onNext}:{onNext:()=>void}){const [reason,setReason]=useState(-1);const [memory,setMemory]=useState("");return <div className="chapter mx-auto max-w-6xl py-8 text-center"><h2 className="script text-5xl font-bold text-primary">Our Beautiful Memories ♥</h2><p className="mt-2 text-sm text-muted-foreground">Every little moment with you belongs here.</p><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{memories.map(([icon,caption],i)=><article key={caption} className={`rounded-sm bg-paper p-3 pb-6 shadow-xl transition hover:-translate-y-2 hover:rotate-0 ${i%2?"rotate-2":"-rotate-2"}`}><div className="grid aspect-[4/5] place-items-center bg-gradient-to-br from-rose-soft to-lavender text-7xl">{icon}</div><p className="script mt-4 text-xl text-primary">{caption}</p></article>)}</div><p className="quote mt-10 text-xl italic">And many more memories to make… ♥</p><div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2"><button onClick={()=>setReason((reason+1)%reasons.length)} className="rounded-lg border border-border bg-paper/70 p-5 text-left transition hover:-translate-y-1"><span className="text-xs uppercase tracking-widest text-muted-foreground">Reason {reason+2} of 10</span><strong className="mt-2 block text-primary">{reason<0?"Tap to reveal why I love you":reasons[reason]??"You make everything better."}</strong></button><button onClick={()=>setMemory(jarMemories[Math.floor(Math.random()*jarMemories.length)]??jarMemories[0]??"")} className="rounded-lg border border-border bg-paper/70 p-5 text-left transition hover:-translate-y-1"><span className="text-xs uppercase tracking-widest text-muted-foreground">Memory jar </span><strong className="mt-2 block text-primary">{memory||"Pull out a tiny memory"}</strong></button></div><MagicButton onClick={onNext} className="mt-8">Let’s play <ArrowRight size={18}/></MagicButton></div>}

function FunZone({onNext,celebrate}:{onNext:()=>void;celebrate:()=>void}){const [tab,setTab]=useState(0);const labels=["Quiz","Scratch","Love Meter","Balloons","Emoji Guess"];return <div className="chapter mx-auto max-w-5xl py-7 text-center"><h2 className="script text-5xl font-bold text-primary">Fun Zone for My Januu </h2><div className="scrollbar-soft mt-6 flex gap-2 overflow-x-auto pb-2">{labels.map((x,i)=><button key={x} onClick={()=>setTab(i)} className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${tab===i?"border-primary bg-primary text-primary-foreground":"border-border bg-paper/60"}`}>{x}</button>)}</div><Frame className="mt-4 min-h-96">{tab===0&&<Quiz celebrate={celebrate}/>} {tab===1&&<Scratch/>} {tab===2&&<LoveMeter celebrate={celebrate}/>} {tab===3&&<Balloons celebrate={celebrate}/>} {tab===4&&<EmojiGuess celebrate={celebrate}/>}</Frame><MagicButton onClick={onNext} className="mt-6">Read your letter <ArrowRight size={18}/></MagicButton></div>}
function Quiz({celebrate}:{celebrate:()=>void}){const qs=["Which colour feels most like our story?","Which flower belongs in your birthday garden?","What is my favourite view?","What makes everything better?","How long will I choose you?"];const opts=[["Soft pink","Grey skies","Neon green"],["Lilies & roses","Cactus","None"],["The moon","You smiling","A screen"],["Your laugh","Mondays","Traffic"],["One day","A while","Forever"]];const ans=[0,0,1,0,2];const [q,setQ]=useState(0);const [score,setScore]=useState(0);const pick=(i:number)=>{if(i===ans[q])setScore(score+1);if(q===4)celebrate();setQ(Math.min(5,q+1))};if(q===5)return <div><div className="text-6xl">⭐</div><h3 className="script text-4xl text-primary">You know our love!</h3><p className="mt-3">Score: {score}/5 — but you’ll always be my perfect match.</p><button className="mt-5 text-sm text-primary underline" onClick={()=>{setQ(0);setScore(0)}}>Play again</button></div>;const choices=opts[q]??[];return <div><div className="mb-6 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{width:`${q*20}%`}}/></div><h3 className="quote text-xl">{qs[q]??"A little love question"}</h3><div className="mx-auto mt-6 grid max-w-sm gap-3">{choices.map((o,i)=><button key={o} onClick={()=>pick(i)} className="rounded-full border border-border bg-background/60 px-4 py-3 transition hover:border-primary hover:text-primary">{o}</button>)}</div></div>}
function Scratch(){const msgs=["Your smile is the best in the world","You are my favourite person","Everything is boring without you"];const [open,setOpen]=useState<boolean[]>([false,false,false]);return <div><h3 className="script text-4xl text-primary">Scratch Card Surprise Gift</h3><p className="mt-1 text-sm text-muted-foreground">Rub or tap each golden card.</p><div className="mt-8 grid gap-4 sm:grid-cols-3">{msgs.map((m,i)=><button key={m} onPointerMove={e=>{if(e.buttons)setOpen(v=>v.map((x,j)=>j===i?true:x))}} onClick={()=>setOpen(v=>v.map((x,j)=>j===i?true:x))} className={`grid min-h-36 touch-none select-none place-items-center rounded-lg border p-4 transition ${open[i]?"border-primary bg-rose-soft/40":"border-gold bg-secondary text-secondary-foreground"}`}>{open[i]?m:"✦ Scratch me ✦"}</button>)}</div></div>}
function LoveMeter({celebrate}:{celebrate:()=>void}){const [v,setV]=useState(0);const run=()=>{setV(0);let n=0;const id=setInterval(()=>{n+=2;setV(n);if(n>=100){clearInterval(id);celebrate()}},24)};return <div><h3 className="script text-4xl text-primary">How much do I love My Januu? ♥</h3><div className="mx-auto my-10 max-w-md"><div className="h-7 overflow-hidden rounded-full border border-border bg-muted"><div className="h-full bg-primary transition-all" style={{width:`${v}%`}}/></div><strong className="mt-3 block text-3xl text-primary">{v}%</strong></div>{v===100?<p className="text-xl font-semibold text-primary">Perfect Match! ♥ 100% Forever</p>:<MagicButton onClick={run}>Check Our Love %</MagicButton>}</div>}
function Balloons({celebrate}:{celebrate:()=>void}){const msgs=["You're amazing! ★","You make me smile ","You're my favourite ♥","You're beautiful ❀","You're my everything ♥"];const [popped,setPopped]=useState<number[]>([]);return <div><h3 className="script text-4xl text-primary">Balloon Pop ♡</h3><div className="mt-8 flex min-h-48 flex-wrap items-center justify-center gap-4">{msgs.map((m,i)=><button key={m} onClick={()=>{const n=[...popped,i];setPopped(n);if(n.length===5)celebrate()}} className={`floaty grid h-32 w-24 place-items-center rounded-[50%_50%_45%_45%] border border-border p-2 text-xs transition ${popped.includes(i)?"bg-paper":"bg-rose-soft text-primary"}`}>{popped.includes(i)?m:"♡"}</button>)}</div>{popped.length===5&&<p className="font-semibold text-primary">You win! Prize: one virtual hug a warm hug</p>}</div>}
function EmojiGuess({celebrate}:{celebrate:()=>void}){const data=[["🌙 ⭐ ♥","love story"],["❀ ♥ ✦","lily and rose"],["♡ ✦ ♡","birthday party"]];const [q,setQ]=useState(0);const [value,setValue]=useState("");const [msg,setMsg]=useState("");const current=data[q]??data[0]??["💗","love"];const check=()=>{if(value.trim().toLowerCase()===current[1]){setMsg("You got it! ✦");celebrate();setTimeout(()=>{setQ((q+1)%3);setValue("");setMsg("")},800)}else setMsg("Almost—try another little guess hint")};return <div><h3 className="script text-4xl text-primary">Emoji Guess</h3><div className="my-8 text-5xl tracking-[.25em]">{current[0]}</div><div className="mx-auto flex max-w-md gap-2"><input value={value} onChange={e=>setValue(e.target.value)} onKeyDown={e=>e.key==="Enter"&&check()} className="min-w-0 flex-1 rounded-full border border-border bg-background/60 px-4" placeholder="What does it mean?"/><MagicButton onClick={check}>Guess</MagicButton></div><p className="mt-4 text-sm text-primary">{msg}</p></div>}

function Letter({onNext}:{onNext:()=>void}){const [open,setOpen]=useState(false);return <div className="chapter flex min-h-[calc(100dvh-6rem)] items-center"><div className="mx-auto w-full max-w-3xl text-center"><h2 className="script text-5xl font-bold text-primary">A Letter From My Heart</h2>{!open?<button onClick={()=>setOpen(true)} className="floaty relative mx-auto mt-14 block h-52 w-72 rounded-lg bg-primary/75 shadow-2xl"><span className="absolute inset-x-0 top-0 h-0 border-x-[144px] border-t-[105px] border-x-transparent border-t-paper/50"/><span className="absolute inset-0 grid place-items-center text-5xl">♥</span><span className="absolute -bottom-10 inset-x-0 text-sm text-primary">Tap to open</span></button>:<div className="animate-fade-in relative mt-7 overflow-hidden rounded-sm bg-paper p-7 text-left shadow-2xl sm:p-12"><img src={floralWreath} alt="" loading="lazy" width={1024} height={1024} className="pointer-events-none absolute inset-0 size-full object-cover opacity-15"/><div className="relative"><p className="script text-3xl font-bold text-primary">My Dearest Januu,</p><p className="quote mt-5 whitespace-pre-line text-lg leading-8 italic">You are my world. Every day with you is special. This surprise was made for you, because you deserve all the happiness in the world.{"\n\n"}Thank you for being you. Happy Birthday, my love! ♥</p><p className="script mt-7 text-right text-2xl text-primary">— Yours forever, Uzan Khan</p></div><div className="mt-7 text-center"><MagicButton onClick={onNext}>One last surprise <ArrowRight size={18}/></MagicButton></div></div>}</div></div>}

