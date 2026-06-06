import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import koloseumLogo from "../assets/koloseum-logo.svg";

const STEPS = [
  {
    tagline: "01 / ARCHITECT",
    title: "The Ultimate Event Hub",
    description:
      "An end-to-end integrated management platform to orchestrate schedules, manage live timelines, coordinate interactive Q&A sessions, and empower organizers.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
  },
  {
    tagline: "02 / INTEGRATION",
    title: "Seamless WhatsApp Automation",
    description:
      "Built with an organizer-oriented mindset. Inviting team collaborators and validating guest attendances becomes instant with automated invitation tools integrated directly into our WhatsApp Bot system.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
  },
  {
    tagline: "03 / IMMUTABLE JOURNAL",
    title: "Verified Memorial Repository",
    description:
      "Acts as an exclusive memorial repository. A dedicated social space where authentic highlights are strictly uploaded by verified admins and organizers to keep interactions focused, secured, and entirely spam-free.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
  },
  {
    tagline: "04 / COMMUNITY PULSE",
    title: "Real-Time Engagement",
    description:
      "Ignite the atmosphere of your competitions and live events. Members contribute directly through interactive polls, express support with likes, and discuss moments granularly within localized comment sections.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
  },
  {
    tagline: "05 / SHOWCASE",
    title: "Reveals & Project Showcases",
    description:
      "Access centralized official announcements, structured champion reveals, and interactive project showrooms displaying the absolute best creative works from participants.",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80",
  },
  {
    tagline: "ENTER THE ARENA",
    title: "Welcome to Koloseum",
    description:
      "The premium creative ecosystem where meticulous event architecture, historic memorialization, and boundless community collaboration converge into one.",
    image:
      "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?w=1200&q=80",
    isFinal: true,
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);

  const lastScrollTime = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const progress = useMemo(() => {
    return ((step + 1) / STEPS.length) * 100;
  }, [step]);

  const isLast = step === STEPS.length - 1;

  const handleNext = useCallback(() => {
    if (isLast) {
      if (user) {
        navigate("/explore");
      } else {
        navigate("/login");
      }
      return;
    }
    setStep((prev) => prev + 1);
  }, [isLast, user, navigate]);

  const handleBack = useCallback(() => {
    if (step === 0) return;
    setStep((prev) => prev - 1);
  }, [step]);

  function handleSkip() {
    navigate("/");
  }

  // Scroll wheel desktop interaction with custom throttling
  useEffect(() => {
    function handleWheel(e) {
      const now = Date.now();
      if (now - lastScrollTime.current < 900) return;

      if (e.deltaY > 30) {
        handleNext();
        lastScrollTime.current = now;
      } else if (e.deltaY < -30) {
        handleBack();
        lastScrollTime.current = now;
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleNext, handleBack]);

  // Mobile swipe layout interaction
  useEffect(() => {
    function handleTouchStart(e) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }

    function handleTouchEnd(e) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchStartX.current - touchEndX;
      const diffY = touchStartY.current - touchEndY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX > 0) {
          handleNext();
        } else {
          handleBack();
        }
      }
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleNext, handleBack]);

  return (
    <div className="fixed inset-0 z-9999 h-dvh max-h-dvh overflow-hidden bg-black select-none">
      {/* Background Banner Gallery */}
      <div className="absolute inset-0 overflow-hidden">
        {STEPS.map((s, idx) => (
          <img
            key={idx}
            src={s.image}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out ${
              idx === step ? "scale-100 opacity-35" : "scale-105 opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Atmospheric Soft Gradient Darkening */}
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/55 to-black/95" />

      {/* Main Structural Interface Container */}
      <div className="relative flex h-full flex-col justify-between">
        {/* TOP BAR: Progress Monitoring & Skip Redirection */}
        <div className="px-5 pt-6 md:px-10 md:pt-8">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="bg-brand h-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[10px] font-medium tracking-[0.25em] text-white/50 uppercase">
                <span>
                  Module {step + 1} / {STEPS.length}
                </span>
                <span>{Math.round(progress)}% Experience</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSkip}
              className="rounded-base cursor-pointer border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wider text-white/80 backdrop-blur-xs transition hover:bg-white/10"
            >
              Skip
            </button>
          </div>
        </div>

        {/* MAIN BODY: Smooth Dynamic Cinematic Typography */}
        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <div className="w-full max-w-3xl text-center">
            {STEPS.map((s, idx) => {
              if (idx !== step) return null;

              return (
                <div
                  key={idx}
                  className="animate-in fade-in slide-in-from-bottom-6 flex flex-col items-center duration-500 ease-out"
                >
                  {s.isFinal ? (
                    <>
                      {/* Final Showcase Container Brand Presentation */}
                      <div className="border-border/30 bg-surface/5 rounded-card animate-in zoom-in-95 mb-6 border p-8 shadow-2xl backdrop-blur-md delay-75 duration-500">
                        <img
                          src={koloseumLogo}
                          alt="Koloseum Logo"
                          className="mx-auto h-20 w-20 animate-pulse drop-shadow-[0_0_15px_rgba(182,148,99,0.3)] md:h-24 md:w-24"
                        />
                      </div>

                      <p className="text-brand mb-3 text-xs font-bold tracking-[0.4em] uppercase">
                        {s.tagline}
                      </p>
                      <h1 className="font-heading text-5xl leading-none font-semibold tracking-tight text-white md:text-7xl">
                        {s.title}
                      </h1>
                      <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/70 md:text-lg">
                        {s.description}
                      </p>
                    </>
                  ) : (
                    <>
                      {/* Standard Architectural Step Text Presentation */}
                      <p className="text-brand mb-4 text-xs font-bold tracking-[0.35em] uppercase">
                        {s.tagline}
                      </p>
                      <h2 className="font-heading text-4xl font-semibold tracking-tight text-white md:text-6xl">
                        {s.title}
                      </h2>
                      <div className="bg-brand/30 mx-auto my-6 h-px w-16" />
                      <p className="mx-auto max-w-2xl text-base leading-8 text-white/80 md:text-lg">
                        {s.description}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM CONTROLS: Navigational Matrix */}
        <div className="px-5 pb-8 md:px-10 md:pb-10">
          <div className="flex items-center justify-between gap-4">
            {/* Backward Step Action Controller */}
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0}
              className="rounded-base cursor-pointer border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-xs transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-20"
            >
              Back
            </button>

            {/* Pagination Dots Anchors Indicator */}
            <div className="hidden gap-2.5 sm:flex">
              {STEPS.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                    index === step
                      ? "bg-brand w-8"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {/* Forward Step Action Controller */}
            <button
              type="button"
              onClick={handleNext}
              className="bg-brand rounded-base shadow-brand/10 cursor-pointer px-6 py-3 text-xs font-bold tracking-widest text-white uppercase shadow-lg transition hover:opacity-95"
            >
              {isLast ? "Get Started" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
