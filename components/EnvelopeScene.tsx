"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Church, Hand, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function playBellTone() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);
    gain.connect(ctx.destination);
    [783.99, 1046.5, 1318.5].forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, now + index * 0.02);
      osc.connect(gain);
      osc.start(now + index * 0.02);
      osc.stop(now + 2.2);
    });
  } catch {}
}

export default function EnvelopeScene({
  onComplete,
  babyName,
  eventDateISO,
}: {
  onComplete: () => void;
  babyName: string;
  eventDateISO: string;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const [activated, setActivated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getCountdown(eventDateISO));

  useEffect(() => {
    const interval = window.setInterval(
      () => setTimeLeft(getCountdown(eventDateISO)),
      1000,
    );
    return () => window.clearInterval(interval);
  }, [eventDateISO]);

  useGSAP(
    () => {
      gsap.set(".scene-fade", { opacity: 1 });
      gsap.set(".heavenly-glow", { opacity: 0.45, scale: 0.95 });
      gsap.set(".sky-particle", { opacity: 0.35 });
      gsap.set(".hand-left", {
        xPercent: -180,
        yPercent: 40,
        rotation: 10,
        opacity: 0,
      });
      gsap.set(".hand-right", {
        xPercent: 180,
        yPercent: 40,
        rotation: -10,
        opacity: 0,
      });
      gsap.set(".letter-sheet", { yPercent: 34, scale: 0.95, opacity: 0.96 });
      gsap.set(".envelope-flap", { rotateX: 0 });
      gsap.set(".wax-seal", { scale: 1, rotate: 0 });
      gsap.set(".invitation-shell", { scale: 1, y: 0 });
      gsap.to(".sky-particle", {
        y: "random(-24, 24)",
        x: "random(-12, 12)",
        opacity: "random(0.2, 0.85)",
        duration: "random(2.8, 5.8)",
        stagger: 0.08,
        repeat: -1,
        repeatRefresh: true,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".heavenly-glow", {
        opacity: 0.78,
        scale: 1.05,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope },
  );

  const playSequence = () => {
    if (isAnimating || activated) return;
    setActivated(true);
    setIsAnimating(true);
    playBellTone();
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        window.setTimeout(() => onComplete(), 650);
      },
    });
    tl.to(".seal-hint", { opacity: 0, y: -8, duration: 0.25 })
      .to(
        ".hand-left",
        {
          xPercent: -28,
          yPercent: -2,
          opacity: 1,
          rotation: 0,
          duration: 0.85,
        },
        0,
      )
      .to(
        ".hand-right",
        { xPercent: 28, yPercent: -2, opacity: 1, rotation: 0, duration: 0.85 },
        0.02,
      )
      .to(".wax-seal", { scale: 0.82, duration: 0.22 })
      .to(".wax-seal", { y: 18, rotate: 22, opacity: 0, duration: 0.45 })
      .to(".invitation-shell", { y: -6, scale: 1.01, duration: 0.35 }, "<")
      .to(".envelope-flap", { rotateX: -170, duration: 0.95 })
      .to(
        ".letter-sheet",
        {
          yPercent: -38,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.15",
      )
      .to(
        ".letter-sheet",
        { y: -6, duration: 0.75, ease: "sine.inOut", yoyo: true, repeat: 1 },
        "-=0.35",
      )
      .to(".hand-left", { xPercent: -65, opacity: 0, duration: 0.8 })
      .to(".hand-right", { xPercent: 65, opacity: 0, duration: 0.8 }, "<")
      .to(".scene-fade", {
        opacity: 0,
        scale: 1.03,
        duration: 1,
        ease: "power2.out",
      });
  };

  return (
    <section
      ref={scope}
      className="scene-fade relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8 md:px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(240,248,255,0.96)_36%,rgba(208,231,255,0.88)_74%,rgba(181,212,247,0.92)_100%)]" />
      <div className="heavenly-glow pointer-events-none absolute left-1/2 top-12 h-56 w-56 -translate-x-1/2 rounded-full bg-white/85 blur-3xl md:h-80 md:w-80" />
      <div className="pointer-events-none absolute -left-20 top-14 h-72 w-72 rounded-full bg-white/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-skyCloud/60 blur-3xl" />
      <FloatingParticles />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-3 font-serif text-xs uppercase tracking-[0.52em] text-skyAccent/80 md:text-sm">
            Baptism Invitation
          </p>
          <h1 className="font-serif text-4xl text-ink md:text-6xl">
            Tap the Seal to Begin
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink/70 md:text-base md:leading-8">
            The invitation begins with a sealed envelope
          </p>
        </div>
        <div className="grid items-center gap-6 lg:grid-cols-[0.84fr_1.16fr] lg:gap-10">
          <div className="order-2 rounded-[30px] border border-white/60 bg-white/65 p-5 shadow-luxe backdrop-blur lg:order-1 md:p-7">
            <div className="rounded-[24px] border border-skyLine/70 bg-white/80 p-5">
              <div className="flex items-center gap-3 text-skyAccent">
                <Church size={18} />
                <p className="text-xs uppercase tracking-[0.36em]">
                  A blessed day is coming
                </p>
              </div>
              <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">
                {babyName}
              </h2>
              <p className="mt-3 text-sm leading-7 text-ink/70">
                Purity, innocence, and grace inspire every movement of this
                sky-blue experience, from silk-like textures to the soft reveal
                of the invitation.
              </p>
              <div className="mt-6 grid grid-cols-4 gap-3 text-center">
                {timeLeft.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[20px] border border-skyLine bg-skyGlow/60 px-3 py-4"
                  >
                    <p className="font-serif text-2xl text-ink md:text-3xl">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-skyAccent/80 md:text-xs">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
              {/* <div className="mt-6 rounded-[22px] border border-skyLine bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(224,240,255,0.7))] p-4 text-sm leading-7 text-ink/75">
                Tip: add your baby photo, RSVP details, godparents, background
                lullaby, and countdown later in one file.
              </div> */}
            </div>
          </div>
          <div className="order-1 relative mx-auto flex h-[540px] w-full max-w-4xl items-center justify-center md:h-[620px] lg:order-2">
            <div className="hand-left absolute bottom-[9%] left-[5%] z-30 w-[170px] md:left-[8%] md:w-[230px]">
              <HandIllustration side="left" />
            </div>
            <div className="hand-right absolute bottom-[9%] right-[5%] z-30 w-[170px] md:right-[8%] md:w-[230px]">
              <HandIllustration side="right" />
            </div>
            <div className="invitation-shell relative z-20 w-full max-w-[720px] perspective-[1800px]">
              <div className="letter-sheet absolute left-1/2 top-[11%] z-10 w-[84%] -translate-x-1/2 rounded-[30px] border border-skyLine bg-[linear-gradient(180deg,#ffffff_0%,#edf7ff_100%)] px-7 py-9 shadow-[0_28px_70px_rgba(93,130,170,0.22)] md:px-14 md:py-10">
                <div className="mb-4 flex items-center justify-center gap-3 text-skyAccent/85">
                  <span className="h-px w-12 bg-current" />
                  <Sparkles className="h-5 w-5" />
                  <span className="h-px w-12 bg-current" />
                </div>
                <p className="text-center font-serif text-sm uppercase tracking-[0.42em] text-skyAccent/85">
                  Holy Baptism
                </p>
                <h2 className="mt-4 text-center font-serif text-3xl text-ink md:text-5xl">
                  {babyName}
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-7 text-ink/70 md:text-base">
                  Together with love and gratitude, our family invites you to
                  witness a beautiful beginning of faith, blessing, and grace.
                </p>
              </div>
              <div className="relative mx-auto mt-28 h-[360px] w-full max-w-[720px] rounded-[34px] bg-[linear-gradient(180deg,#dbecfb_0%,#b7d5f0_42%,#8eb7de_100%)] p-[1px] shadow-luxe md:h-[410px]">
                <div className="relative h-full overflow-hidden rounded-[33px] bg-[linear-gradient(180deg,#f9fdff_0%,#d6e9fa_100%)]">
                  <div className="absolute inset-x-0 bottom-0 z-20 h-[72%] bg-[linear-gradient(180deg,#d8ebfb_0%,#a8cae9_100%)] clip-envelope-front" />
                  <div className="envelope-flap absolute inset-x-0 top-0 z-30 h-[57%] origin-top bg-[linear-gradient(180deg,#edf7ff_0%,#b9d7f1_100%)] clip-envelope-flap shadow-[inset_0_-20px_40px_rgba(85,125,167,0.14)]" />
                  <div className="pointer-events-none absolute inset-0 z-40 rounded-[33px] ring-1 ring-white/40" />
                  <button
                    type="button"
                    onClick={playSequence}
                    disabled={activated}
                    aria-label="Open the invitation seal"
                    className="wax-seal absolute left-1/2 top-[53%] z-50 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-[radial-gradient(circle_at_30%_30%,#8fc7ff,#5ea6ed_58%,#3f7fb7_100%)] text-white shadow-[0_15px_35px_rgba(63,127,183,0.35)] transition-transform duration-300 hover:scale-105 disabled:cursor-default"
                  >
                    <Hand className="h-5 w-5" />
                  </button>
                  <div className="seal-hint absolute left-1/2 top-[70%] z-50 -translate-x-1/2 rounded-full border border-skyLine bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-ink/65 backdrop-blur">
                    tap the seal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          className="sky-particle absolute rounded-full bg-white/90 blur-[1px]"
          style={{
            width: `${6 + (index % 4) * 4}px`,
            height: `${6 + (index % 4) * 4}px`,
            left: `${(index * 5.3) % 100}%`,
            top: `${8 + ((index * 7.2) % 80)}%`,
            boxShadow: "0 0 22px rgba(255,255,255,0.8)",
          }}
        />
      ))}
    </div>
  );
}

function HandIllustration({ side }: { side: "left" | "right" }) {
  const mirrored = side === "right" ? "scale-x-[-1]" : "";
  return (
    <div
      className={`drop-shadow-[0_16px_24px_rgba(71,94,117,0.18)] ${mirrored}`}
    >
      <svg viewBox="0 0 300 240" className="h-auto w-full overflow-visible">
        <defs>
          <linearGradient id={`skin-${side}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f8dfcf" />
            <stop offset="48%" stopColor="#ebc1a3" />
            <stop offset="100%" stopColor="#dcaa86" />
          </linearGradient>
          <linearGradient id={`shadow-${side}`} x1="0" x2="1">
            <stop offset="0%" stopColor="#c68b68" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#986749" stopOpacity="0.24" />
          </linearGradient>
        </defs>
        <path
          d="M40 188c13-24 34-43 51-56 12-10 23-26 25-40l6-41c1-12 9-20 18-20 11 0 18 9 17 22l-2 31 12-40c3-10 12-16 21-14 11 2 17 12 14 24l-10 38 18-43c4-10 14-15 24-11 10 4 14 15 9 26l-18 47 22-39c6-10 18-13 28-7 9 6 12 18 5 29l-41 63c-10 14-26 24-44 29l-58 16c-25 7-51-4-71-24-7-7-8-19-1-30z"
          fill={`url(#skin-${side})`}
        />
        <path
          d="M141 56c7 4 10 11 9 19l-4 34m30-38-12 42m32-35-15 40m34-22-18 32"
          fill="none"
          stroke="#c88963"
          strokeLinecap="round"
          strokeWidth="7"
          opacity="0.5"
        />
        <path
          d="M53 183c15 17 36 25 57 20l58-16c16-5 31-14 40-27l38-58"
          fill="none"
          stroke={`url(#shadow-${side})`}
          strokeLinecap="round"
          strokeWidth="18"
        />
      </svg>
    </div>
  );
}

function getCountdown(eventDateISO: string) {
  const target = new Date(eventDateISO).getTime();
  const now = Date.now();
  const difference = Math.max(0, target - now);
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);
  return [
    { label: "Days", value: String(days).padStart(2, "0") },
    { label: "Hours", value: String(hours).padStart(2, "0") },
    { label: "Minutes", value: String(minutes).padStart(2, "0") },
    { label: "Seconds", value: String(seconds).padStart(2, "0") },
  ];
}
