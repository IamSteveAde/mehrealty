"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Headphones, Pause, Play, Volume2, X } from "lucide-react";

const STORAGE_KEY = "meh:welcome-introduction:v2";
const REOPEN_EVENT = "meh:open-introduction";
const AUDIO_URL = process.env.NEXT_PUBLIC_MEH_INTRO_AUDIO_URL?.trim() || "/uploads/meh-introduction.mp3";
type Playback = "idle" | "loading" | "playing" | "paused" | "ended" | "error";

function hasMadeChoice() {
  try { return localStorage.getItem(STORAGE_KEY) === "seen"; }
  catch { try { return sessionStorage.getItem(STORAGE_KEY) === "seen"; } catch { return false; } }
}
function rememberChoice() {
  try { localStorage.setItem(STORAGE_KEY, "seen"); }
  catch { try { sessionStorage.setItem(STORAGE_KEY, "seen"); } catch { /* Storage is optional. */ } }
}

export default function WelcomeIntroduction() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const mountedRef = useRef(true);
  const [promptOpen, setPromptOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playback, setPlayback] = useState<Playback>("idle");
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!hasMadeChoice()) timer = setTimeout(() => setPromptOpen(true), 1400);
    const reopen = () => {
      if (timer) clearTimeout(timer);
      if (audioRef.current && audioRef.current.currentTime > 0) setPlayerOpen(true);
      else setPromptOpen(true);
    };
    window.addEventListener(REOPEN_EVENT, reopen);
    const audio = audioRef.current;
    return () => {
      mountedRef.current = false;
      if (timer) clearTimeout(timer);
      window.removeEventListener(REOPEN_EVENT, reopen);
      audio?.pause();
    };
  }, []);

  function decline() {
    rememberChoice();
    setPromptOpen(false);
  }

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.ended || audio.error) {
      if (audio.error) audio.load();
      audio.currentTime = 0;
      setProgress(0);
    }
    setPlayback("loading");
    try {
      await audio.play();
      if (mountedRef.current) setPlayback("playing");
    } catch {
      if (mountedRef.current) setPlayback("error");
    }
  }, []);

  function accept() {
    rememberChoice();
    setPromptOpen(false);
    setPlayerOpen(true);
    void play();
  }

  function togglePlayback() {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setPlayback("paused");
    } else void play();
  }

  function stop() {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setPlayback("idle");
    setProgress(0);
    setPlayerOpen(false);
  }

  return (
    <>
      <audio ref={audioRef} src={AUDIO_URL} preload="none" onPlay={() => setPlayback("playing")} onPause={() => setPlayback(current => current === "ended" ? current : "paused")} onEnded={() => { setPlayback("ended"); setProgress(100); }} onError={() => setPlayback("error")} onTimeUpdate={event => { const audio = event.currentTarget; setProgress(audio.duration ? audio.currentTime / audio.duration * 100 : 0); }} />

      {promptOpen && <aside className="meh-audio-prompt" aria-labelledby="audio-prompt-title" aria-describedby="audio-prompt-description" role="region">
        <span className="prompt-symbol" aria-hidden="true"><Headphones size={23} strokeWidth={1.3} /></span>
        <div className="prompt-copy"><h2 id="audio-prompt-title">Meet MEH</h2><p id="audio-prompt-description">Listen to what MEH does while you browse?</p></div>
        <div className="prompt-actions"><button type="button" className="prompt-accept" onClick={accept}>Accept <Play size={13} fill="currentColor" /></button><button type="button" className="prompt-decline" onClick={decline}>No thanks</button></div>
        <button type="button" className="prompt-close" aria-label="Dismiss audio invitation" onClick={decline}><X size={17} strokeWidth={1.3} /></button>
      </aside>}

      {playerOpen && <div className="meh-audio-player" role="region" aria-label="MEH audio introduction">
        <button type="button" className="player-toggle" onClick={togglePlayback} disabled={playback === "loading"} aria-label={playback === "playing" ? "Pause MEH introduction" : playback === "ended" ? "Replay MEH introduction" : "Play MEH introduction"}>{playback === "playing" ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}</button>
        <div className="player-copy"><span>Meet MEH</span><small role="status">{playback === "loading" ? "Loading…" : playback === "error" ? "Try again" : playback === "ended" ? "Complete" : playback === "paused" ? "Paused" : "Listening"}</small><div className="player-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div></div>
        <button type="button" className="player-volume" aria-label={muted ? "Unmute introduction" : "Mute introduction"} aria-pressed={muted} onClick={() => { const value = !muted; setMuted(value); if (audioRef.current) audioRef.current.muted = value; }}><Volume2 size={15} strokeWidth={1.3} style={{ opacity: muted ? 0.4 : 1 }} /></button>
        <button type="button" className="player-close" aria-label="Stop and close introduction" onClick={stop}><X size={16} strokeWidth={1.3} /></button>
      </div>}

      <style jsx>{`
        .meh-audio-prompt { position: fixed; z-index: 10000; left: 20px; bottom: 20px; display: grid; grid-template-columns: 30px 1fr; align-items: center; gap: 8px 10px; width: min(360px, calc(100vw - 40px)); padding: 12px 16px; border: 1px solid #d8d1c4; border-radius: 10px; background: #f8f6f1; color: #20291f; box-shadow: 0 8px 30px #0002; animation: audio-arrive .35s ease-out both; }
        .prompt-symbol { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; flex-shrink: 0; color: #87734e; }
        .prompt-copy { flex: 1; }
        .prompt-copy h2 { margin: 0; font-family: var(--font-fraunces), Georgia, serif; font-weight: 400; font-size: 17px; line-height: 1.2; }
        .prompt-copy p { margin-top: 4px; padding-right: 8px; font-size: 11px; line-height: 1.5; color: #686c60; }
        .prompt-actions { display: flex; grid-column: 2; flex-direction: row; align-items: center; gap: 12px; }
        .prompt-accept { display: inline-flex; align-items: center; justify-content: center; gap: 12px; min-width: 94px; min-height: 32px; padding: 8px 14px; border-radius: 999px; background: #233326; color: #f8f6f1; font-size: 9px; letter-spacing: .1em; text-transform: uppercase; }
        .prompt-accept:hover { background: #354738; }
        .prompt-decline { min-height: 32px; padding: 6px 8px; font-size: 10px; color: #777b6d; }
        .prompt-close { position: absolute; right: 3px; top: 3px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; color: #73786a; }
        .meh-audio-player { position: fixed; z-index: 10000; left: 20px; bottom: 20px; display: flex; align-items: center; gap: 8px; width: 230px; max-width: calc(100vw - 40px); padding: 8px 6px 8px 10px; border: 1px solid #ffffff40; border-radius: 10px; background: #233326; color: #f8f6f1; box-shadow: 0 8px 32px #0003; animation: audio-arrive .25s ease-out both; }
        .player-toggle { display: flex; align-items: center; justify-content: center; min-width: 34px; height: 34px; border: 1px solid #ffffff60; border-radius: 50%; }
        .player-toggle:disabled { opacity: .5; }
        .player-copy { flex: 1; min-width: 0; }
        .player-copy > span { font-size: 11px; letter-spacing: .06em; }
        .player-copy small { display: block; margin-top: 2px; font-size: 9px; line-height: 1.3; color: #d0d7c7; }
        .player-progress { height: 2px; background: #ffffff30; margin-top: 4px; }
        .player-progress > span { display: block; height: 100%; background: #d4be94; }
        .player-volume, .player-close { display: flex; align-items: center; justify-content: center; width: 28px; height: 34px; flex-shrink: 0; }
        button:focus-visible { outline: 2px solid #b69d70; outline-offset: 3px; }
        @keyframes audio-arrive { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 639px) {
          .meh-audio-prompt { left: 16px; bottom: calc(84px + env(safe-area-inset-bottom)); width: min(340px, calc(100vw - 32px)); }
          .prompt-accept, .prompt-decline { min-height: 40px; }
          .meh-audio-player { left: 16px; bottom: calc(84px + env(safe-area-inset-bottom)); }
        }
        @media (prefers-reduced-motion: reduce) { .meh-audio-prompt, .meh-audio-player { animation: none; } }
      `}</style>
    </>
  );
}
