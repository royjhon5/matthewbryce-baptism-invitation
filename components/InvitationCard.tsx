"use client";

import Image from "next/image";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Phone,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

type Invitation = {
  babyName: string;
  eventDateISO: string;
  church: string;
  churchAddress: string;
  reception: string;
  receptionAddress: string;
  rsvpName: string;
  rsvpPhone: string;
  parents: string;
  godparents: string[];
};

const babyPhotos = [
  "/first.jpg",
  "/second.jpg",
  "/third.jpg",
  "/fourth.jpg",
  "/fifth.jpg",
  "/sixth.jpg",
  "/seventh.jpg",
  "/eight.jpg",
];

export default function InvitationCard({
  invitation,
  onReplay,
}: {
  invitation: Invitation;
  onReplay: () => void;
}) {
  const [musicOn, setMusicOn] = useState(false);
  const [particlesOn] = useState(true);
  const [countdown, setCountdown] = useState(
    getCountdown(invitation.eventDateISO),
  );
  const [activePhoto, setActivePhoto] = useState(0);
  const audioEngineRef = useRef<{ stop: () => void } | null>(null);
  const activePhotoSrc = useMemo(() => babyPhotos[activePhoto], [activePhoto]);

  useEffect(() => {
    const interval = window.setInterval(
      () => setCountdown(getCountdown(invitation.eventDateISO)),
      1000,
    );
    return () => window.clearInterval(interval);
  }, [invitation.eventDateISO]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActivePhoto((prev) => (prev + 1) % babyPhotos.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(
    () => () => {
      audioEngineRef.current?.stop();
      audioEngineRef.current = null;
    },
    [],
  );

  const toggleMusic = () => {
    if (musicOn) {
      audioEngineRef.current?.stop();
      audioEngineRef.current = null;
      setMusicOn(false);
      return;
    }
    const engine = startLullabyLoop();
    if (engine) {
      audioEngineRef.current = engine;
      setMusicOn(true);
    }
  };

  const showPreviousPhoto = () => {
    setActivePhoto((prev) =>
      prev === 0 ? babyPhotos.length - 1 : prev - 1,
    );
  };

  const showNextPhoto = () => {
    setActivePhoto((prev) => (prev + 1) % babyPhotos.length);
  };

  const eventDate = new Date(invitation.eventDateISO);
  const formattedDate = eventDate.toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 26, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.1, ease: "easeOut" }}
      className="relative min-h-screen overflow-hidden px-5 py-8 md:px-10 md:py-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88),rgba(239,248,255,0.92)_35%,rgba(208,232,252,0.84)_100%)]" />
      <div className="pointer-events-none absolute left-[-4rem] top-10 h-64 w-64 rounded-full bg-white/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-skyCloud/55 blur-3xl" />
      {particlesOn ? <AmbientParticles /> : null}
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-serif text-xs uppercase tracking-[0.42em] text-skyAccent/80 md:text-sm">
              Baptism Invitation
            </p>
            <h1 className="mt-2 font-serif text-3xl md:text-5xl">
              Matthew Bryce B. Cubillan
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <ControlButton onClick={onReplay} icon={<RotateCcw size={16} />}>
              Replay Intro
            </ControlButton>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-[34px] border border-white/60 bg-white/70 p-5 shadow-luxe backdrop-blur md:p-8"
          >
            <div className="rounded-[28px] border border-skyLine bg-[linear-gradient(180deg,#ffffff_0%,#eef8ff_100%)] p-7 md:p-12">
              <div className="mb-6 flex items-center justify-center gap-3 text-skyAccent/75">
                <span className="h-px w-10 bg-current" />
                <Sparkles size={18} />
                <span className="h-px w-10 bg-current" />
              </div>
              <p className="text-center font-serif text-xs uppercase tracking-[0.45em] text-skyAccent/80 md:text-sm">
                You are lovingly invited
              </p>
              <h2 className="mt-5 text-center font-serif text-4xl text-ink md:text-6xl">
                {invitation.babyName}
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-8 text-ink/70 md:text-base">
                Join us as we celebrate a treasured moment of blessing, faith,
                and new beginnings. Your presence will make this sacred day even
                more meaningful.
              </p>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                <InfoCard
                  icon={<CalendarDays size={18} />}
                  title="Date"
                  value={formattedDate}
                />
                <InfoCard
                  icon={<Clock3 size={18} />}
                  title="Time"
                  value={formattedTime}
                />
                <InfoCard
                  icon={<MapPin size={18} />}
                  title="Venue"
                  value={invitation.church}
                />
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-4">
                {countdown.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-skyLine bg-white/70 p-4 text-center shadow-sm"
                  >
                    <p className="font-serif text-2xl text-ink md:text-3xl">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.32em] text-skyAccent/80 md:text-xs">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-10 rounded-[26px] border border-skyLine bg-white/70 p-6">
                <p className="font-serif text-xl text-ink">
                  Reception to follow
                </p>
                <p className="mt-2 text-sm leading-7 text-ink/70">
                  {invitation.reception}, {invitation.receptionAddress}.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="space-y-8"
          >
            <div className="rounded-[34px] border border-white/60 bg-white/70 p-6 shadow-luxe backdrop-blur md:p-8 justify">
              On your baptism day, little one, may your heart always be pure,
              your smile always bright, and your life always surrounded by God’s
              love and protection. You are a precious blessing to us all.
            </div>
            <div className="rounded-[34px] border border-white/60 bg-[linear-gradient(180deg,#ffffff_0%,#eef8ff_100%)] p-6 shadow-luxe md:p-8">
              <div className="rounded-[28px] border border-dashed border-skyLine bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(226,242,255,0.95))] p-5">
                <div className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/70 p-4 shadow-[0_18px_55px_rgba(120,160,210,0.2)]">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-serif text-3xl text-ink">Baby Photo</p>
                      <p className="mt-1 text-sm leading-6 text-ink/65">
                        A sweet gallery of Matthew Bryce&apos;s lovely moments.
                      </p>
                    </div>
                    <div className="rounded-full border border-skyLine bg-white/85 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-skyAccent/80">
                      {activePhoto + 1} / {babyPhotos.length}
                    </div>
                  </div>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-skyGlow/40">
                    <motion.div
                      key={activePhotoSrc}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={activePhotoSrc}
                        alt={`${invitation.babyName} photo ${activePhoto + 1}`}
                        fill
                        priority={activePhoto === 0}
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </motion.div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#18344f]/35 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                      <button
                        type="button"
                        onClick={showPreviousPhoto}
                        aria-label="Show previous baby photo"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/80 text-ink shadow-md backdrop-blur transition hover:-translate-y-0.5"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={showNextPhoto}
                        aria-label="Show next baby photo"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/80 text-ink shadow-md backdrop-blur transition hover:-translate-y-0.5"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {babyPhotos.map((photo, index) => (
                      <button
                        key={photo}
                        type="button"
                        onClick={() => setActivePhoto(index)}
                        aria-label={`Show baby photo ${index + 1}`}
                        aria-pressed={index === activePhoto}
                        className={`h-2.5 rounded-full transition-all ${
                          index === activePhoto
                            ? "w-10 bg-skyAccent"
                            : "w-2.5 bg-skyAccent/25 hover:bg-skyAccent/45"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[30px] border border-white/60 bg-white/70 p-6 shadow-luxe backdrop-blur">
                <p className="font-serif text-2xl text-ink">Godparents</p>
                <div className="mt-4 space-y-2 text-sm leading-7 text-ink/70">
                  {invitation.godparents.map((name) => (
                    <p key={name}>• {name}</p>
                  ))}
                </div>
              </div>
              <div className="rounded-[30px] border border-white/60 bg-white/70 p-6 shadow-luxe backdrop-blur">
                <p className="font-serif text-2xl text-ink">RSVP</p>
                <p className="mt-4 text-sm leading-7 text-ink/70">
                  Please let {invitation.rsvpName} know if you can celebrate
                  with us.
                </p>
                <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-skyLine bg-skyGlow/50 px-4 py-3 text-sm text-ink">
                  <Phone size={16} /> {invitation.rsvpPhone}
                </div>
                <p className="mt-4 text-sm leading-7 text-ink/65">
                  {invitation.parents}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-skyLine bg-white/70 p-5 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-skyGlow text-skyAccent">
        {icon}
      </div>
      <p className="text-xs uppercase tracking-[0.3em] text-skyAccent/80">
        {title}
      </p>
      <p className="mt-2 font-serif text-xl text-ink">{value}</p>
    </div>
  );
}

function ControlButton({
  children,
  icon,
  onClick,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-skyLine bg-white/78 px-5 py-3 text-sm text-ink shadow-lg backdrop-blur transition hover:-translate-y-0.5"
    >
      {icon}
      {children}
    </button>
  );
}

function AmbientParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, index) => (
        <span
          key={index}
          className="animate-float-soft absolute rounded-full bg-white/90 blur-[1px]"
          style={{
            width: `${7 + (index % 4) * 3}px`,
            height: `${7 + (index % 4) * 3}px`,
            left: `${(index * 4.8) % 100}%`,
            top: `${5 + ((index * 6.7) % 85)}%`,
            animationDelay: `${index * 0.35}s`,
            animationDuration: `${4 + (index % 5)}s`,
            boxShadow: "0 0 20px rgba(255,255,255,0.9)",
          }}
        />
      ))}
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

function startLullabyLoop() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.03;
    master.connect(ctx.destination);
    let stopped = false;
    const notes = [
      523.25, 659.25, 783.99, 659.25, 587.33, 523.25, 493.88, 523.25,
    ];
    let index = 0;
    const schedule = () => {
      if (stopped) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(notes[index % notes.length], now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.03, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.95);
      index += 1;
      window.setTimeout(schedule, 620);
    };
    schedule();
    return {
      stop: () => {
        stopped = true;
        master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        window.setTimeout(() => {
          void ctx.close();
        }, 220);
      },
    };
  } catch {
    return null;
  }
}
