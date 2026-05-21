"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BIRTHDAY_DATE = new Date("2026-06-14T00:00:00");

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const difference = BIRTHDAY_DATE - now;

      if (difference <= 0) {
        setIsUnlocked(true);
        setTimeLeft(null);
        setShowFireworks(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const audio = document.getElementById("countdown-music");

    if (!audio) return;

    audio.volume = 0.35;

    const playMusic = () => {
      audio.play().catch(() => {});
    };

    window.addEventListener("click", playMusic, { once: true });
    window.addEventListener("touchstart", playMusic, { once: true });

    return () => {
      window.removeEventListener("click", playMusic);
      window.removeEventListener("touchstart", playMusic);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
      <audio id="countdown-music" autoPlay loop>
        <source src="/countdown.mp3" type="audio/mpeg" />
      </audio>

      <div className="absolute inset-0 bg-gradient-to-b from-[#21002f] via-black to-black" />

      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {[...Array(60)].map((_, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 1,
                scale: 0,
                x: "50vw",
                y: "50vh",
              }}
              animate={{
                opacity: [1, 1, 0],
                scale: [0, 1.5, 0.2],
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
              }}
              transition={{
                duration: 1.8,
                delay: Math.random() * 0.8,
                ease: "easeOut",
              }}
              className="absolute text-3xl"
            >
              {["✨", "🎆", "🎇", "💖", "🦋", "🎉"][
                Math.floor(Math.random() * 6)
              ]}
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl w-full text-center bg-white/10 border border-white/10 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-2xl"
      >
        <p className="uppercase tracking-[0.4em] text-pink-400 text-sm mb-6">
          L’Univers de Nounours
        </p>

        {!isUnlocked ? (
          <>
            <h1 className="text-4xl md:text-6xl font-serif mb-6">
              Une surprise t’attend bientôt 🎁
            </h1>

            <p className="text-zinc-300 mb-10 whitespace-pre-line">
              {`Tout un univers 🪐 a été créé pour toi, jolie Nounours 🧸🫂❤️

Ces portes s’ouvriront le jour J…

Et ce jour-là, tu comprendras que chaque étoile, chaque lumière et chaque battement y portaient déjà ton nom ✨❤️`}
            </p>

            {timeLeft && (
              <div className="grid grid-cols-4 gap-3 mb-10">
                <div className="bg-black/40 rounded-2xl p-4">
                  <p className="text-3xl font-bold">{timeLeft.days}</p>
                  <p className="text-xs text-zinc-400">jours</p>
                </div>

                <div className="bg-black/40 rounded-2xl p-4">
                  <p className="text-3xl font-bold">{timeLeft.hours}</p>
                  <p className="text-xs text-zinc-400">heures</p>
                </div>

                <div className="bg-black/40 rounded-2xl p-4">
                  <p className="text-3xl font-bold">{timeLeft.minutes}</p>
                  <p className="text-xs text-zinc-400">minutes</p>
                </div>

                <div className="bg-black/40 rounded-2xl p-4">
                  <p className="text-3xl font-bold">{timeLeft.seconds}</p>
                  <p className="text-xs text-zinc-400">secondes</p>
                </div>
              </div>
            )}

            <p className="text-pink-200">Reviens le jour J, Elvira ❤️</p>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-serif mb-6">
              Joyeux anniversaire Elvira 🎂
            </h1>

            <p className="text-zinc-300 mb-10">
              Ton univers est maintenant ouvert.
            </p>

            <div className="grid gap-4">
              <a
                href="/mon-univers"
                className="bg-white text-black rounded-full py-4 text-lg hover:scale-105 transition"
              >
                Entrer dans mon univers 🦋
              </a>
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}