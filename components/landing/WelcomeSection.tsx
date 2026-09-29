
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
} from "lucide-react";

const VIDEO_SRC = "/uploads/meh.mp4";
const POSTER_SRC = "/uploads/mehholder.png";

const EASE = [0.22, 1, 0.36, 1] as const;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);

  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

export default function WelcomeSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = Boolean(useReducedMotion());

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoError, setVideoError] = useState(false);

  const togglePlayback = async () => {
    const video = videoRef.current;

    if (!video || videoError) return;

    if (!video.paused) {
      video.pause();
      return;
    }

    try {
      if (video.ended || hasEnded) {
        video.currentTime = 0;
      }

      await video.play();
    } catch (error) {
      console.error("Unable to play MEH video:", error);
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) return;

    const nextMuted = !video.muted;

    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const seekTo = (value: number) => {
    const video = videoRef.current;

    if (!video || !Number.isFinite(video.duration)) {
      return;
    }

    video.currentTime = value;
    setCurrentTime(value);
  };

  const enterFullscreen = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      if (video.requestFullscreen) {
        await video.requestFullscreen();
      } else if ("webkitEnterFullscreen" in video) {
        (
          video as HTMLVideoElement & {
            webkitEnterFullscreen: () => void;
          }
        ).webkitEnterFullscreen();
      }
    } catch {
      // Fullscreen is optional.
    }
  };

  return (
    <section
      aria-labelledby="welcome-heading"
      className="relative overflow-hidden bg-[#f7f6f2] py-20 text-[#171714] sm:py-28 lg:py-36"
    >
      {/* INTRODUCTION */}
      <div className="mx-auto max-w-[1000px] px-6 text-center sm:px-10">
        <motion.div
          initial={
            reducedMotion
              ? false
              : { opacity: 0, y: 12 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            ease: EASE,
          }}
          className="flex items-center justify-center gap-4"
        >
          <span className="h-px w-8 bg-[#b8975a]" />

          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#a2824f]">
            Welcome to MEH Realty
          </span>

          <span className="h-px w-8 bg-[#b8975a]" />
        </motion.div>

        <motion.h2
          id="welcome-heading"
          initial={
            reducedMotion
              ? false
              : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.9,
            ease: EASE,
          }}
          className="mt-10 font-[family-name:var(--font-fraunces)] text-[clamp(2.65rem,5vw,5.8rem)] font-light leading-[1.12] tracking-[-0.05em]"
        >
          More than a place to live.

          <span className="mt-2 block italic text-[#b8975a]">
            A way of living.
          </span>
        </motion.h2>

        <motion.p
          initial={
            reducedMotion
              ? false
              : { opacity: 0, y: 12 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.75,
            delay: 0.1,
            ease: EASE,
          }}
          className="mx-auto mt-8 max-w-[630px] text-[14px] leading-[1.9] text-[#171714]/55 sm:text-[15px]"
        >
          We bring together architecture, purposeful design
          and a considered approach to property development
          and management.
        </motion.p>
      </div>

      {/* LARGE CINEMATIC VIDEO */}
      <motion.div
        initial={
          reducedMotion
            ? false
            : {
                opacity: 0,
                y: 30,
                scale: 0.99,
              }
        }
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.1,
        }}
        transition={{
          duration: 1,
          ease: EASE,
        }}
        className="mx-auto mt-16 w-[90%] sm:mt-20 lg:mt-24"
      >
        {/* VIDEO LABEL */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#b8975a]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#716958]">
              The MEH Film
            </span>
          </div>

          <span className="hidden text-[10px] uppercase tracking-[0.18em] text-[#171714]/40 sm:block">
            An introduction to our world
          </span>
        </div>

        {/* VIDEO FRAME */}
        <div className="group relative aspect-video w-full overflow-hidden bg-[#10110e] shadow-[0_45px_110px_-55px_rgba(0,0,0,0.32)]">
          {/* ACTUAL VIDEO */}
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            preload="metadata"
            playsInline
            controls={false}
            muted={isMuted}
            className="absolute inset-0 h-full w-full object-cover"
            onPlay={() => {
              setIsPlaying(true);
              setHasStarted(true);
              setHasEnded(false);
            }}
            onPause={() => {
              setIsPlaying(false);
            }}
            onEnded={() => {
              setIsPlaying(false);
              setHasEnded(true);
            }}
            onLoadedMetadata={(event) => {
              setDuration(event.currentTarget.duration);
            }}
            onTimeUpdate={(event) => {
              setCurrentTime(
                event.currentTarget.currentTime
              );
            }}
            onError={() => {
              setVideoError(true);
            }}
          />

          {/* THUMBNAIL BEFORE FIRST PLAY */}
          {!hasStarted && !videoError && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${POSTER_SRC}")`,
              }}
            />
          )}

          {/* SUBTLE CINEMATIC OVERLAY */}
          {!isPlaying && !videoError && (
            <div className="pointer-events-none absolute inset-0 bg-black/15" />
          )}

          {/* CENTRE PLAY BUTTON */}
          {!isPlaying && !videoError && (
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={
                hasEnded
                  ? "Replay MEH Realty film"
                  : hasStarted
                    ? "Resume MEH Realty film"
                    : "Play MEH Realty film"
              }
              className="group/play absolute inset-0 z-10 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#d9bd8d]"
            >
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/70 bg-black/25 text-white backdrop-blur-md transition-all duration-500 group-hover/play:scale-110 group-hover/play:border-[#b8975a] group-hover/play:bg-[#b8975a] group-hover/play:text-[#10110e] sm:h-28 sm:w-28 lg:h-32 lg:w-32">
                <span className="absolute -inset-3 rounded-full border border-white/20" />

                {hasEnded ? (
                  <RotateCcw
                    size={30}
                    strokeWidth={1.2}
                  />
                ) : (
                  <Play
                    size={32}
                    strokeWidth={1.2}
                    fill="currentColor"
                    className="ml-1"
                  />
                )}
              </span>
            </button>
          )}

          {/* VIDEO ERROR */}
          {videoError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
              <Play
                size={34}
                strokeWidth={1}
                className="text-[#b8975a]"
              />

              <p className="mt-5 font-[family-name:var(--font-fraunces)] text-2xl font-light text-white">
                Film unavailable
              </p>

              <p className="mt-3 max-w-[360px] text-[12px] leading-relaxed text-white/55">
                Please check that the video exists at
                public/uploads/meh.mp4.
              </p>
            </div>
          )}

          {/* PLAYER CONTROLS */}
          {hasStarted && !videoError && (
            <div
              className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/30 to-transparent px-4 pb-4 pt-12 transition-opacity duration-300 sm:px-7 sm:pb-7 ${
                isPlaying
                  ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                  : "opacity-100"
              }`}
            >
              {/* VIDEO PROGRESS */}
              <input
                type="range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={Math.min(
                  currentTime,
                  duration || 1
                )}
                onChange={(event) =>
                  seekTo(Number(event.target.value))
                }
                aria-label="Video progress"
                className="mb-5 h-1 w-full cursor-pointer accent-[#b8975a]"
              />

              {/* PLAYBACK ACTIONS */}
              <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={togglePlayback}
                    aria-label={
                      isPlaying
                        ? "Pause video"
                        : "Play video"
                    }
                    className="text-white transition-colors hover:text-[#d9bd8d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d9bd8d]"
                  >
                    {isPlaying ? (
                      <Pause
                        size={19}
                        fill="currentColor"
                      />
                    ) : (
                      <Play
                        size={19}
                        fill="currentColor"
                      />
                    )}
                  </button>

                  <span className="text-[11px] tabular-nums text-white/75">
                    {formatTime(currentTime)} /{" "}
                    {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={
                      isMuted
                        ? "Unmute video"
                        : "Mute video"
                    }
                    className="text-white transition-colors hover:text-[#d9bd8d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d9bd8d]"
                  >
                    {isMuted ? (
                      <VolumeX size={19} />
                    ) : (
                      <Volume2 size={19} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={enterFullscreen}
                    aria-label="Enter fullscreen"
                    className="text-white transition-colors hover:text-[#d9bd8d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d9bd8d]"
                  >
                    <Maximize size={19} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BORDER */}
          <div className="pointer-events-none absolute inset-0 border border-[#b8975a]/15" />
        </div>

        {/* VIDEO CAPTION */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-b border-[#171714]/10 pb-8">
          <div>
            <p className="font-[family-name:var(--font-fraunces)] text-[23px] font-light italic sm:text-[28px]">
              An introduction to MEH
            </p>

            <p className="mt-2 text-[12px] leading-relaxed text-[#171714]/45">
              Discover our philosophy and the spaces
              we create.
            </p>
          </div>

          <span className="text-[10px] uppercase tracking-[0.2em] text-[#a2824f]">
            MEH Realty
          </span>
        </div>
      </motion.div>

      {/* SECTION CTA */}
      <div className="mx-auto mt-16 flex flex-col items-center gap-7 px-6 text-center sm:mt-20">
        <p className="font-[family-name:var(--font-fraunces)] text-[clamp(1.5rem,2.5vw,2.5rem)] font-light italic text-[#514b41]">
          Every space tells a story.
        </p>

        <Link
          href="/about"
          className="group inline-flex items-center gap-4 border-b border-[#b8975a] pb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[#171714] transition-colors hover:text-[#b8975a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b8975a]"
        >
          Discover our story

          <ArrowUpRight
            size={17}
            strokeWidth={1.3}
            className="text-[#b8975a] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}
