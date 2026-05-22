"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import HTMLFlipBook from "react-pageflip";

const TEMP_SECRET_CODE = "nounours2026";

const nounoursMessage = {
  relation: "Eternal Flame ❤️",
  name: "🥰Mon coin dans ton Univers🥰",
  message: `Nounours❤️,


Si tu lis ces mots aujourd’hui, c’est parce qu’il existe quelque part dans ce monde des personnes qui pensent à toi avec tendresse, qui portent ton sourire dans leur cœur et qui gardent des souvenirs précieux de toi.

J’ai voulu réunir tout cet amour dans un seul endroit.

Chaque papillon que tu découvriras contient une émotion, un souvenir, un éclat de rire, une pensée sincère ou un morceau d’affection laissé spécialement pour toi.

Mais celui-ci est différent.

Parce qu’avant tous les autres… il vient de moi.

Je voulais te créer quelque chose qui survive au temps.
Un endroit où tu pourrais revenir les jours heureux comme les jours difficiles.
Un endroit capable de te rappeler à quel point tu es aimée, importante et précieuse.

Tu mérites un amour doux.
Tu mérites des regards sincères.
Tu mérites des gens qui choisissent de rester.
Et surtout… tu mérites de ne jamais oublier la lumière que tu apportes dans la vie des autres.

Alors bienvenue dans ton jardin secret.
Bienvenue dans cet univers créé uniquement pour toi.

Avec tout mon cœur,

Eternal Flame ❤️❤️`,
};

function getButterflyStyle(relation = "") {
  const value = relation.toLowerCase();

  if (value.includes("maman") || value.includes("papa") || value.includes("parent")) {
    return {
      emoji: "🦋🥰",
      title: "Papillon des parents",
      color: "from-pink-400/30 to-rose-500/20",
      border: "border-pink-300/50",
    };
  }

  if (value.includes("frère") || value.includes("frere") || value.includes("soeur") || value.includes("sœur")) {
    return {
      emoji: "💙",
      title: "Papillon frère/sœur",
      color: "from-blue-400/30 to-cyan-500/20",
      border: "border-blue-300/50",
    };
  }

  if (value.includes("cousin") || value.includes("cousine")) {
    return {
      emoji: "💜",
      title: "Papillon cousin/cousine",
      color: "from-purple-400/30 to-violet-500/20",
      border: "border-purple-300/50",
    };
  }

  if (value.includes("tante") || value.includes("tonton") || value.includes("oncle")) {
    return {
      emoji: "🧡",
      title: "Papillon tante/oncle",
      color: "from-orange-400/30 to-amber-500/20",
      border: "border-orange-300/50",
    };
  }

  if (value.includes("meilleur") || value.includes("meilleure")) {
    return {
      emoji: "💖",
      title: "Papillon meilleure amie",
      color: "from-fuchsia-400/30 to-pink-500/20",
      border: "border-fuchsia-300/50",
    };
  }

  if (value.includes("ami") || value.includes("amie")) {
    return {
      emoji: "🦋",
      title: "Papillon ami(e)",
      color: "from-indigo-400/30 to-blue-500/20",
      border: "border-indigo-300/50",
    };
  }

  if (
    value.includes("collègue") ||
    value.includes("collegue") ||
    value.includes("camarade") ||
    value.includes("connaissance")
  ) {
    return {
      emoji: "🤍",
      title: "Papillon connaissance",
      color: "from-zinc-300/20 to-white/10",
      border: "border-white/30",
    };
  }

  return {
    emoji: "🦋",
    title: "Papillon souvenir",
    color: "from-pink-400/20 to-purple-500/20",
    border: "border-white/10",
  };
}

function FloatingButterflies() {
  const emojis = [
    "🦋",
    "🦋",
    "🧸",
    "🦋",
    "💖",
    "🧸",
    "💜",
    "💙",
    "🥳",
    "🤍",
    "😻",
    "😇",
    "🧡",
    "🌸",
    "🌻",
    "🎉",
    "🥳",
    "✨",
    "🌟",
    "💫",
    "🧸",
    "💛",
    "🥰",
    "🌚",
  ];

  const items = useMemo(() => {
    return Array.from({ length: 28 }).map((_, index) => ({
      id: index,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      startX: Math.random() * 100,
      midX: Math.random() * 100,
      endX: Math.random() * 100,
      startY: 100 + Math.random() * 20,
      endY: -(20 + Math.random() * 30),
      rotate: Math.random() * 360,
      duration: 18 + Math.random() * 18,
      delay: Math.random() * 10,
      size: Math.random() > 0.5 ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl",
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className={`absolute ${item.size} opacity-40`}
          initial={{
            x: `${item.startX}vw`,
            y: `${item.startY}vh`,
            rotate: item.rotate,
          }}
          animate={{
            y: `${item.endY}vh`,
            x: [`${item.startX}vw`, `${item.midX}vw`, `${item.endX}vw`],
            rotate: [0, 20, -20, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "linear",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}

function MagicalStars() {
  const stars = useMemo(() => {
    return Array.from({ length: 90 }).map((_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[0] overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}vw`,
            top: `${star.y}vh`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
}

function MagicCursorTrail() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    function handleMove(e) {
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        emoji: ["✨", "💖", "🌸", "💫", "🦋"][Math.floor(Math.random() * 5)],
      };

      setParticles((prev) => [...prev.slice(-20), newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((particle) => particle.id !== newParticle.id));
      }, 1000);
    }

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[40]">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            opacity: 1,
            scale: 1,
            x: particle.x,
            y: particle.y,
          }}
          animate={{
            opacity: 0,
            scale: 2,
            y: particle.y - 80,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          className="absolute text-xl"
        >
          {particle.emoji}
        </motion.div>
      ))}
    </div>
  );
}

function TypewriterText({ text, speed = 45 }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    let interval;

    setDisplayedText("");

    const audio = new Audio("/typing.mp3");
    audio.volume = 0.4;
    audio.loop = true;

    audio.play().catch(() => {});

    interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;

      if (index >= text.length) {
        clearInterval(interval);
        audio.pause();
        audio.currentTime = 0;
      }
    }, speed);

    return () => {
      clearInterval(interval);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [text, speed]);

  return (
    <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap text-lg">
      {displayedText}
    </p>
  );
}

function MessageModal({ openedMessage, onClose }) {
  const sections = [
    { key: "wish", title: "✨ Mon souhait pour Nounours 🧸", content: openedMessage.wish },
    { key: "funnyMoment", title: "😂 Nos moments drôles", content: openedMessage.funnyMoment },
    { key: "heartMessage", title: "❤️ Mon message de cœur pour toi", content: openedMessage.heartMessage },
    { key: "advice", title: "🧠 Mon conseil pour toi", content: openedMessage.advice },
    { key: "bestMemory", title: "📸 Meilleur souvenir", content: openedMessage.bestMemory },
    { key: "nickname", title: "🏷️ Mon surnom pour toi", content: openedMessage.nickname },
    { key: "learnedFromYou", title: "🌱 Ce que j’ai appris grâce à toi", content: openedMessage.learnedFromYou },
    { key: "becauseOfYou", title: "🙏 Grâce à toi", content: openedMessage.becauseOfYou },
    { key: "message", title: "💌 Message", content: openedMessage.message },
  ].filter((section) => section.content);

  if (openedMessage.mediaItems && openedMessage.mediaItems.length > 0) {
    sections.push({
      key: "mediaItems",
      title: "📸 Souvenirs en images",
      content: openedMessage.mediaItems,
      isMedia: true,
    });
  }

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const currentSection = sections[currentSectionIndex];

  function goNext() {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  }

  function goPrevious() {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 md:px-6 overflow-hidden bg-black/70 backdrop-blur-sm"
    >
      <div className="relative max-h-[92vh] overflow-y-auto bg-[#12051c]/95 border border-pink-300/15 backdrop-blur-xl rounded-[2.5rem] px-5 md:px-8 py-6 shadow-[0_0_60px_rgba(255,105,180,0.18)] w-full max-w-5xl">
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-[9999] bg-black/80 border border-white/30 w-12 h-12 rounded-full text-white text-2xl flex items-center justify-center hover:scale-110 transition"
          aria-label="Fermer le souvenir"
        >
          ✕
        </button>

        <p className="text-pink-400 uppercase tracking-[0.3em] text-xs mb-4">
          {openedMessage.relation}
        </p>

        <h2 className="text-3xl font-serif mb-4">
          {openedMessage.name}
        </h2>

        {sections.length === 0 ? (
          <p className="text-zinc-300">
            Ce papillon ne contient pas encore de message.
          </p>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-zinc-400 mb-3 gap-4">
                <span>
                  Partie {currentSectionIndex + 1} sur {sections.length}
                </span>

                <span className="text-right">
                  {currentSection.title}
                </span>
              </div>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-400 rounded-full"
                  style={{
                    width: `${((currentSectionIndex + 1) / sections.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 min-h-[260px]">
              <h3 className="text-2xl font-serif mb-5">
                {currentSection.title}
              </h3>

              {!currentSection.isMedia && (
                <TypewriterText text={currentSection.content} />
              )}

              {currentSection.isMedia && (
                <div className="grid gap-6">
                  {currentSection.content.map((media, index) => (
                    <div
                      key={index}
                      className="bg-black/20 border border-white/10 rounded-2xl p-4"
                    >
                      {media.type === "image" && (
                        <img
                          src={media.url}
                          alt="Souvenir"
                          className="rounded-2xl w-full max-h-[55vh] object-contain mb-4"
                        />
                      )}

                      {media.type === "video" && (
                        <video
                          src={media.url}
                          controls
                          className="rounded-2xl w-full max-w-2xl mx-auto max-h-[45vh] object-contain mb-4"
                        />
                      )}

                      {media.caption && (
                        <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                          {media.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 mt-8">
              <button
                onClick={goPrevious}
                disabled={currentSectionIndex === 0}
                className="px-5 py-3 rounded-full border border-white/10 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition"
              >
                Précédent
              </button>

              <div className="flex gap-2">
                {sections.map((section, index) => (
                  <button
                    key={section.key}
                    onClick={() => setCurrentSectionIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition ${
                      index === currentSectionIndex ? "bg-pink-400 scale-125" : "bg-white/20"
                    }`}
                    aria-label={`Aller à ${section.title}`}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                disabled={currentSectionIndex === sections.length - 1}
                className="px-5 py-3 rounded-full bg-white text-black disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition"
              >
                Suivant
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function FinalMessageModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[60] flex items-center justify-center px-6 overflow-hidden"
    >
     <div className="absolute inset-0 overflow-hidden">
  <video
    autoPlay
    muted
    loop
    playsInline
    className="w-full h-full object-contain object-center"
  >
    <source src="/final-background.mp4" type="video/mp4" />
  </video>

  <div className="absolute inset-0 bg-black/45" />
</div>
      {[...Array(80)].map((_, index) => (
  <motion.div
    key={index}
    initial={{
      opacity: 0,
      x: "50vw",
      y: "50vh",
      scale: 0,
    }}
    animate={{
      opacity: [0, 1, 1, 0],
      x: `${Math.random() * 100}vw`,
      y: `${Math.random() * 100}vh`,
      scale: [0, 1.6, 0.4],
      rotate: 360,
    }}
    transition={{
      duration: 2.5 + Math.random() * 2,
      repeat: Infinity,
      delay: Math.random() * 4,
      ease: "easeOut",
    }}
    className="absolute text-2xl md:text-4xl pointer-events-none"
  >
    {["✨", "🎆", "🎇", "💖", "🦋", "🎉", "🌟", "💫"][
      Math.floor(Math.random() * 8)
    ]}
  </motion.div>
))}

      {[...Array(40)].map((_, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0,
            x: `${Math.random() * 100}vw`,
            y: "-10vh",
            rotate: 0,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: "110vh",
            rotate: 360,
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "linear",
          }}
          className="absolute text-2xl"
        >
          {["🎂", "✨", "🦋", "💖", "🎉"][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-3xl text-center bg-white/10 border border-pink-300/20 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-[0_0_80px_rgba(255,105,180,0.25)]"
      >
        <p className="uppercase tracking-[0.5em] text-pink-400 text-sm mb-8">
          Surprise finale
        </p>

        <h1 className="text-5xl md:text-7xl font-serif mb-8">
          Joyeux anniversaire Elvira 🎂
        </h1>

        <p className="text-zinc-200 text-lg leading-relaxed whitespace-pre-wrap mb-10">
{`Tous ces papillons existent parce que tu es aimée.

Chaque message, chaque souvenir, chaque photo et chaque vidéo est une preuve que tu comptes pour les personnes autour de toi.

Aujourd’hui, ce jardin est à toi.

Garde-le comme un endroit où revenir quand tu veux te rappeler à quel point tu es précieuse.

Les personnes pour qui tu compte,

Nous T'AIMONS trés trés fort Nounours ❤️`}
        </p>

        <button
          onClick={onClose}
          className="bg-white text-black px-8 py-4 rounded-full hover:scale-105 transition"
        >
          Revoir mon univers 🦋
        </button>
      </motion.div>
    </motion.div>
  );
}

function playPageSound() {
  if (typeof window === "undefined") return;

  const audio = new Audio("/page-flip.mp3");
  audio.volume = 0.2;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function MemoryBookModal({ messages, onClose }) {
  const pages = useMemo(() => {
    const result = [];

    messages.forEach((message) => {
      result.push({
        type: "intro",
        message,
      });

      if (message.wish) result.push({ title: "✨ Souhait", text: message.wish, message });
      if (message.funnyMoment) result.push({ title: "😂 Moment drôle", text: message.funnyMoment, message });
      if (message.heartMessage) result.push({ title: "❤️ Message du cœur", text: message.heartMessage, message });
      if (message.advice) result.push({ title: "🧠 Conseil", text: message.advice, message });
      if (message.bestMemory) result.push({ title: "📸 Meilleur souvenir", text: message.bestMemory, message });
      if (message.nickname) result.push({ title: "🏷️ Surnom", text: message.nickname, message });
      if (message.learnedFromYou) result.push({ title: "🌱 Ce que j’ai appris", text: message.learnedFromYou, message });
      if (message.becauseOfYou) result.push({ title: "🙏 Grâce à toi", text: message.becauseOfYou, message });
      if (message.message) result.push({ title: "💌 Message", text: message.message, message });

      if (message.mediaItems && message.mediaItems.length > 0) {
        message.mediaItems.forEach((media) => {
          result.push({
            type: "media",
            media,
            message,
          });
        });
      }
    });

    return result;
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black/95 overflow-y-auto px-4 py-10"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#250033] via-black to-black" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="uppercase tracking-[0.4em] text-pink-400 text-sm mb-3">
              Un jardin remplie d'amour uniquement pour Nounours
            </p>

            <h1 className="text-4xl md:text-6xl font-serif text-white">
              Livre des souvenirs 📖
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-3xl"
            aria-label="Fermer le livre des souvenirs"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-center">
          <HTMLFlipBook
            width={420}
            height={600}
            size="stretch"
            minWidth={300}
            maxWidth={460}
            minHeight={480}
            maxHeight={650}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={playPageSound}
            className="shadow-[0_0_80px_rgba(255,105,180,0.2)]"
          >
            <div className="bg-[#fff7ee] text-zinc-900 p-10 rounded-l-xl flex flex-col justify-center items-center text-center relative h-auto">
              <div className="absolute inset-0 bg-gradient-to-b from-pink-100 to-white opacity-70" />

              <div className="relative z-10">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-pink-300 shadow-2xl mb-8 mx-auto">
                  <img
                    src="/nounours-profile.jpg"
                    alt="Nounours"
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="uppercase tracking-[0.4em] text-pink-500 text-xs mb-4">
                  Univers émotionnel
                </p>

                <h2 className="text-5xl font-serif mb-6 leading-tight">
                  Livre des souvenirs
                </h2>

                <p className="text-zinc-600 leading-relaxed max-w-sm mx-auto">
                  Tous les papillons, tous les souvenirs, tous les mots d’amour réunis dans un seul livre.
                </p>

                <div className="mt-10 text-5xl">🦋</div>
              </div>
            </div>

            {pages.map((page, index) => (
              <div
                key={`${page.type || page.title}-${index}`}
                className="bg-[#fff7ee] text-zinc-900 p-8 h-auto"
              >
                {page.type === "intro" && (
                  <div className="h-full flex flex-col justify-center text-center">
                    <div className="text-6xl mb-6">
                      {getButterflyStyle(page.message.relation).emoji}
                    </div>

                    <p className="uppercase tracking-[0.3em] text-pink-500 text-xs mb-4">
                      {page.message.relation}
                    </p>

                    <h2 className="text-4xl font-serif mb-6">
                      {page.message.name}
                    </h2>

                    <p className="text-zinc-600">
                      Un papillon rempli de souvenirs.
                    </p>
                  </div>
                )}

                {!page.type && (
                  <div className="h-full flex flex-col">
                    <p className="text-sm text-pink-500 mb-4">
                      {page.message.name}
                    </p>

                    <h3 className="text-3xl font-serif mb-6">
                      {page.title}
                    </h3>

                    <div className="overflow-y-auto max-h-[420px] pr-3">
  <p className="text-zinc-700 leading-relaxed whitespace-pre-line text-lg">
    {page.text}
  </p>
</div>

                    <div className="mt-auto text-right text-zinc-400 text-sm">
                      Page {index + 1}
                    </div>
                  </div>
                )}

                {page.type === "media" && (
                  <div className="h-full flex flex-col overflow-hidden">
                    <p className="text-sm text-pink-500 mb-4">
                      {page.message.name}
                    </p>

                    <h3 className="text-3xl font-serif mb-6">
                      📸 Souvenir
                    </h3>

                    {page.media.type === "image" && (
                      <img
                        src={page.media.url}
                        alt="Souvenir"
                        className="rounded-2xl w-full max-h-[360px] object-cover mb-4"
                      />
                    )}

                    {page.media.type === "video" && (
                      <video
                        src={page.media.url}
                        controls
                        className="rounded-2xl w-full max-h-[360px] mb-4"
                      />
                    )}

                    {page.media.caption && (
                      <p className="text-zinc-700 whitespace-pre-wrap">
                        {page.media.caption}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="bg-[#fff7ee] text-zinc-900 p-10 rounded-r-xl flex flex-col justify-center items-center text-center">
              <div className="text-6xl mb-6">❤️</div>

              <h2 className="text-4xl font-serif mb-5">
                Fin du livre
              </h2>

              <p className="text-zinc-600 leading-relaxed">
                Ce livre restera comme une trace de tous ceux qui t’aiment.
              </p>
            </div>
          </HTMLFlipBook>
        </div>

        <p className="text-center text-zinc-400 mt-8">
          Glisse ou clique sur les coins des pages pour tourner le livre.
        </p>
      </div>
    </motion.div>
  );
}

function MemoryGlobe({ messages, onOpenMessage }) {
  if (!messages || messages.length === 0) {
    return null;
  }

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
      <p className="uppercase tracking-[0.4em] text-pink-400 text-sm mb-5">
        Globe des souvenirs
      </p>

      <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif mb-6">
        Toutes les personnes qui t’aiment 🌍
      </h2>

      <p className="text-zinc-300 max-w-2xl mx-auto mb-14">
        Chaque papillon lumineux représente une personne qui a laissé un souvenir dans ton univers.
      </p>

      <div className="relative mx-auto w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] md:w-[520px] md:h-[520px] rounded-full border border-pink-300/30 bg-white/5 backdrop-blur-md shadow-[0_0_80px_rgba(255,105,180,0.15)] overflow-visible">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-8 rounded-full border border-white/10"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 55,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-16 rounded-full border border-pink-300/10"
        />

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {messages.map((message, index) => {
            const nextIndex = (index + 1) % messages.length;

            const angle1 = (index / messages.length) * Math.PI * 2;
            const angle2 = (nextIndex / messages.length) * Math.PI * 2;

            const radius = 38;

            const x1 = 50 + Math.cos(angle1) * radius;
            const y1 = 50 + Math.sin(angle1) * radius;

            const x2 = 50 + Math.cos(angle2) * radius;
            const y2 = 50 + Math.sin(angle2) * radius;

            return (
              <motion.line
                key={index}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="rgba(255,192,203,0.3)"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.1,
                }}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-6xl md:text-7xl drop-shadow-[0_0_25px_rgba(255,255,255,0.35)]"
          >
            🌍
          </motion.div>
        </div>

        {messages.map((message, index) => {
          const angle = (index / messages.length) * Math.PI * 2;
          const radius = 42;
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;
          const butterfly = getButterflyStyle(message.relation);

          return (
            <motion.button
              key={message.id}
              onClick={() => onOpenMessage(message)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: [1, 1.08, 1],
              }}
              transition={{
                opacity: {
                  delay: index * 0.08,
                  duration: 0.4,
                },
                scale: {
                  duration: 3 + index * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              whileHover={{ scale: 1.25 }}
              className="group absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/75 border border-pink-300/50 flex items-center justify-center text-2xl md:text-3xl shadow-[0_0_25px_rgba(255,105,180,0.45)] z-20"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              title={message.name}
            >
              <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">
                {butterfly.emoji}
              </span>

              <div className="absolute top-14 md:top-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 border border-pink-300/30 px-3 py-1 rounded-full text-xs text-white opacity-0 group-hover:opacity-100 transition pointer-events-none">
                {message.name}
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="text-zinc-500 text-sm mt-8">
        Clique sur un papillon autour du globe pour ouvrir son souvenir.
      </p>
    </div>
  );
}
function EternalMemoryGate({ onClose }) {
  const [gateOpened, setGateOpened] = useState(false);
  const [currentMemory, setCurrentMemory] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isChangingMemory, setIsChangingMemory] = useState(false);

  const memories = [
    { type: "image", src: "/ella.jpg" },
    { type: "video", src: "/ella1.mp4" },
    { type: "image", src: "/ella1.jpg" },
    { type: "video", src: "/ella2.mp4" },
    { type: "image", src: "/ella2.jpg" },
    { type: "video", src: "/ella3.mp4" },
    { type: "image", src: "/ella3.jpg" },
    { type: "video", src: "/ella4.mp4" },
    { type: "video", src: "/ella5.mp4" },
    { type: "video", src: "/ella6.mp4" },
  ];

  const isLastMemory = currentMemory === memories.length - 1;
  const activeMemory = memories[currentMemory];

  useEffect(() => {
    const timer = setTimeout(() => {
      setGateOpened(true);
    }, 9000);

    return () => clearTimeout(timer);
  }, []);

  function goNextMemory() {
    if (isChangingMemory) return;

    setIsChangingMemory(true);

    setTimeout(() => {
      if (isLastMemory) {
        setShowFinalMessage(true);
      } else {
        setCurrentMemory((prev) => prev + 1);
      }

      setTimeout(() => {
        setIsChangingMemory(false);
      }, 400);
    }, 1500);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] bg-black overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src={gateOpened ? "/ella-heaven.jpg" : "/ella-gate.jpg"}
          alt="Souvenir éternel"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-yellow-100/10 to-black/40" />
      </div>

      <motion.div
        initial={{ opacity: 0.45, scale: 0.8 }}
        animate={{ opacity: [0.5, 1, 0.65], scale: [0.9, 1.35, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-white/50 blur-[140px]"
      />

      {[...Array(10)].map((_, index) => (
        <motion.div
          key={index}
          initial={{
            x: "-15vw",
            y: `${18 + Math.random() * 45}vh`,
            opacity: 0,
            scale: 0.7 + Math.random() * 0.6,
          }}
          animate={{
            x: "115vw",
            y: `${12 + Math.random() * 45}vh`,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 32 + Math.random() * 14,
            repeat: Infinity,
            delay: index * 2,
            ease: "linear",
          }}
          className="absolute z-30 text-4xl md:text-6xl"
        >
          🕊️
        </motion.div>
      ))}

      {!gateOpened && (
        <>
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-60vw" }}
            transition={{ duration: 7.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 z-40 h-full w-1/2 bg-gradient-to-r from-[#3b2507]/95 via-[#b8862b]/90 to-[#ffe39a]/90 border-r-4 border-yellow-100 shadow-[0_0_120px_rgba(255,215,120,0.9)]"
          >
            <div className="absolute inset-8 border-4 border-yellow-100/80 rounded-t-full" />
            <div className="absolute inset-16 border-2 border-yellow-200/70 rounded-t-full" />

            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="absolute top-20 bottom-20 w-[4px] bg-yellow-100/80 rounded-full"
                style={{ left: `${12 + i * 10}%` }}
              />
            ))}

            <div className="absolute left-1/2 top-[42%] w-52 h-52 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-100/80" />
            <div className="absolute left-1/2 top-[42%] w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-yellow-100/70" />
          </motion.div>

          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "60vw" }}
            transition={{ duration: 7.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 z-40 h-full w-1/2 bg-gradient-to-l from-[#3b2507]/95 via-[#b8862b]/90 to-[#ffe39a]/90 border-l-4 border-yellow-100 shadow-[0_0_120px_rgba(255,215,120,0.9)]"
          >
            <div className="absolute inset-8 border-4 border-yellow-100/80 rounded-t-full" />
            <div className="absolute inset-16 border-2 border-yellow-200/70 rounded-t-full" />

            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="absolute top-20 bottom-20 w-[4px] bg-yellow-100/80 rounded-full"
                style={{ left: `${12 + i * 10}%` }}
              />
            ))}

            <div className="absolute left-1/2 top-[42%] w-52 h-52 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-100/80" />
            <div className="absolute left-1/2 top-[42%] w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-yellow-100/70" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 2 }}
            className="absolute inset-0 z-50 flex items-center justify-center text-center px-6"
          >
            <div>
              <h1 className="text-7xl md:text-9xl font-serif text-white mb-6 drop-shadow-[0_0_45px_rgba(255,255,255,1)]">
                Ella 🕊️
              </h1>

              <p className="uppercase tracking-[0.5em] text-[#fff4b8] text-sm font-bold drop-shadow-[0_0_20px_rgba(255,240,180,1)]">
                Lumière Éternelle
              </p>
            </div>
          </motion.div>
        </>
      )}

      {gateOpened && !showFinalMessage && !isChangingMemory && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-center px-5 py-8"
        >
          <div className="w-full max-w-5xl text-center">
            <p className="uppercase tracking-[0.5em] text-[#fff4b8] text-xs md:text-sm font-bold mb-4 drop-shadow-[0_0_15px_rgba(255,240,180,1)]">
              Souvenir {currentMemory + 1} sur {memories.length}
            </p>

            <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 drop-shadow-[0_0_45px_rgba(255,255,255,1)]">
              Ella 🕊️
            </h1>

            <AnimatePresence mode="wait">
              {!isChangingMemory && (
                <motion.div
                  key={currentMemory}
                  initial={{ opacity: 0, scale: 0.55, y: 80 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.45, y: -80 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="bg-black/20 border border-yellow-100/40 backdrop-blur-[2px] rounded-[2rem] p-4 md:p-6 shadow-[0_0_80px_rgba(255,255,255,0.25)]"
                >
                  {activeMemory.type === "image" ? (
                    <img
                      src={activeMemory.src}
                      alt="Souvenir Ella"
                      className="w-full max-h-[62vh] object-contain rounded-[1.5rem]"
                    />
                  ) : (
                    <video
                      src={activeMemory.src}
                      controls
                      autoPlay
                      className="w-full max-h-[62vh] object-contain rounded-[1.5rem]"
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={goNextMemory}
              className="mt-8 bg-white text-black px-8 py-4 rounded-full hover:scale-105 transition shadow-[0_0_30px_rgba(255,255,255,0.6)]"
            >
              {isLastMemory
                ? "Découvrir le message d’Ella 🕊️"
                : "Souvenir suivant →"}
            </button>
          </div>
        </motion.div>
      )}

      {showFinalMessage && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 z-60 flex items-center justify-center px-6"
        >
          <div className="max-w-3xl text-center bg-black/15 border border-yellow-100/40 backdrop-blur-[2px] rounded-[2rem] p-8 md:p-12 shadow-[0_0_100px_rgba(255,255,255,0.35)]">
            <p className="uppercase tracking-[0.5em] text-[#fff4b8] text-sm font-bold mb-6 drop-shadow-[0_0_18px_rgba(255,240,180,1)]">
              Lumière Éternelle
            </p>

            <h1 className="text-7xl md:text-9xl font-serif text-white mb-10 drop-shadow-[0_0_45px_rgba(255,255,255,1)]">
              Ella 🕊️
            </h1>

            <p className="text-white text-lg md:text-xl font-medium leading-relaxed whitespace-pre-line drop-shadow-[0_0_12px_rgba(0,0,0,1)]">
{`Elvira…

Même si certaines personnes quittent ce monde,
leur amour, leurs rires
et les souvenirs qu’elles ont laissés
continuent de vivre en nous.

Certaines âmes deviennent éternelles.

Et tant qu’on se souvient d’elles,
elles ne disparaissent jamais vraiment ✨

Ella 🕊️`}
            </p>

            <button
              onClick={onClose}
              className="mt-10 bg-white text-black px-8 py-4 rounded-full hover:scale-105 transition shadow-[0_0_30px_rgba(255,255,255,0.6)]"
            >
              Revenir au jardin 🦋
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
export default function MonUniversPage() {
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showMemoryBook, setShowMemoryBook] = useState(false);
  const [messages, setMessages] = useState([]);
  const [openedMessage, setOpenedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [secretCode, setSecretCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  const [newCode, setNewCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [hasEntered, setHasEntered] = useState(false);

  const [introStep, setIntroStep] = useState(0);
  const [showEllaGate, setShowEllaGate] = useState(false);

  const introSteps = [
    {
      title: "Avant d’entrer...",
      text: "Prends une seconde. Respire. Ce que tu vas découvrir a été créé uniquement pour toi Nounours🥰.",
      emoji: "✨",
    },
    {
      title: "Quelque chose t’attend",
      text: "Des personnes qui t’aiment ont laissé des fragments de souvenirs, de souhaits, de mots et d’amour uniquement pour toi.",
      emoji: "🦋",
    },
    {
      title: "Un jardin secret",
      text: "Chaque butterfly  que tu verras porte une histoire, une pensée ou une émotion...appuie dessus pour découvrir ce qu'il cache.",
      emoji: "🌙",
    },
    {
      title: "Es-tu prête ?",
      text: "Quand tu appuieras sur le bouton, ton univers s’ouvrira.",
      emoji: "❤️",
    },
  ];

  async function prepareSecretCode() {
    const secretRef = doc(db, "settings", "secret");
    const secretSnap = await getDoc(secretRef);

    if (!secretSnap.exists()) {
      const hash = await bcrypt.hash(TEMP_SECRET_CODE, 10);

      await setDoc(secretRef, {
        passwordHash: hash,
        mustChangePassword: true,
      });
    }
  }

  async function verifySecretCode(e) {
    e.preventDefault();

    const secretSnap = await getDoc(doc(db, "settings", "secret"));

    if (!secretSnap.exists()) {
      alert("Code secret non configuré.");
      return;
    }

    const data = secretSnap.data();
    const isValid = await bcrypt.compare(secretCode, data.passwordHash);

    if (!isValid) {
      alert("Code secret incorrect.");
      return;
    }

    setIsUnlocked(true);
    setMustChangePassword(data.mustChangePassword);
  }

  async function changeSecretCode(e) {
    e.preventDefault();

    if (newCode.length < 4) {
      alert("Le code doit contenir au moins 4 caractères.");
      return;
    }

    if (newCode !== confirmCode) {
      alert("Les deux codes ne sont pas identiques.");
      return;
    }

    const hash = await bcrypt.hash(newCode, 10);

    await updateDoc(doc(db, "settings", "secret"), {
      passwordHash: hash,
      mustChangePassword: false,
    });

    setMustChangePassword(false);
    alert("Ton code secret a été changé ❤️");
  }

  useEffect(() => {
    prepareSecretCode();
  }, []);

  useEffect(() => {
    async function loadMessages() {
      if (!isUnlocked || mustChangePassword) return;

      try {
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        setMessages(data);
      } catch (error) {
        console.error("Erreur :", error);
      }

      setLoading(false);
    }

    loadMessages();
  }, [isUnlocked, mustChangePassword]);

  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#180026] via-black to-black" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 bg-white/10 border border-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center"
        >
          <p className="uppercase tracking-[0.4em] text-pink-400 text-sm mb-5">
            L’Univers de Nounours 🧸
          </p>

          <h1 className="text-4xl font-serif mb-5">
            Code secret ❤️
          </h1>

          <p className="text-zinc-300 mb-8">
            Pour entrer dans ton jardin secret, entre le code inscrit en bas du QR code que tu as reçu...
          </p>

          <form onSubmit={verifySecretCode} className="space-y-5">
            <input
              type="password"
              placeholder="Ton code secret"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400"
              required
            />

            <button className="w-full bg-white text-black rounded-full py-4 font-medium">
              Entrer
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  if (mustChangePassword) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#180026] via-black to-black" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 bg-white/10 border border-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center"
        >
          <h1 className="text-4xl font-serif mb-5">
            Crée ton propre code ❤️
          </h1>

          <p className="text-zinc-300 mb-8">
            Ce code sera ton jardin secret. Une fois changé, Atilio ne pourra plus le connaître.
            Ce changement de code activera automatiquement ton Univers... 
          </p>

          <form onSubmit={changeSecretCode} className="space-y-5">
            <input
              type="password"
              placeholder="Nouveau code secret"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400"
              required
            />

            <input
              type="password"
              placeholder="Confirmer le code"
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400"
              required
            />

            <button className="w-full bg-white text-black rounded-full py-4 font-medium">
              Sauvegarder mon code
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  if (!hasEntered) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/nounours-bg.jpg"
            alt="Nounours"
            className="w-full h-full object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>

        <FloatingButterflies />
        <MagicalStars />

        <AnimatePresence mode="wait">
          <motion.div
            key={introStep}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 max-w-2xl text-center bg-white/10 border border-white/10 backdrop-blur-md rounded-[2rem] p-8 md:p-10 shadow-2xl"
          >
            <div className="text-7xl mb-8">
              {introSteps[introStep].emoji}
            </div>

            <p className="uppercase tracking-[0.4em] text-pink-400 text-xs mb-5">
              L’univers de Nounours
            </p>

            <h1 className="text-4xl md:text-5xl font-serif mb-6">
              {introSteps[introStep].title}
            </h1>

            <p className="text-zinc-300 leading-relaxed text-lg mb-10">
              {introSteps[introStep].text}
            </p>

            {introStep < introSteps.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIntroStep(introStep + 1)}
                className="bg-white text-black px-8 py-4 rounded-full text-lg"
              >
                Continuer ✨
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setHasEntered(true)}
                className="bg-white text-black px-8 py-4 rounded-full text-lg"
              >
                Entrer dans mon univers ❤️
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <img
          src="/nounours-bg.jpg"
          alt="Nounours"
          className="w-full h-full object-cover opacity-55 scale-105"
        />

        <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />
      </div>

      <FloatingButterflies />
      <MagicalStars />
      <MagicCursorTrail />

      <audio autoPlay loop>
        <source src="/piano2.mp3" type="audio/mpeg" />
      </audio>

      <section className="relative z-10 px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <p className="uppercase tracking-[0.5em] text-pink-400 text-sm mb-6">
            L’Univers de Nounours
          </p>

          <motion.h1
            animate={{ x: [0, 6, -6, 0], y: [0, -4, 4, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="text-4xl sm:text-5xl md:text-7xl font-serif mb-8"
          >
            Ton jardin de butterfly  🦋
          </motion.h1>

          <p className="text-zinc-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Chaque butterfly  contient un message venant d’une personne qui t’aime.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <button
            onClick={() => setOpenedMessage(nounoursMessage)}
            className="w-full bg-pink-500/20 border border-pink-300/40 hover:border-pink-300 rounded-3xl p-10 text-center backdrop-blur-md hover:scale-[1.02] transition shadow-2xl"
          >
            <div className="text-6xl mb-5">❤️</div>

            <h2 className="text-3xl font-serif mb-3">
              Le cœur de Nounours
            </h2>

            <p className="text-pink-100">
              Un butterfly  spécial déposé pour Nounours.
            </p>
          </button>

          <motion.div
  initial={{ opacity: 0, scale: 0.92 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.3 }}
  className="max-w-3xl mx-auto mb-16"
>
  <button
    onClick={() => setShowEllaGate(true)}
    className="w-full bg-white/10 border border-yellow-200/40 hover:border-yellow-200 rounded-3xl p-10 text-center backdrop-blur-md hover:scale-[1.02] transition shadow-[0_0_50px_rgba(255,215,120,0.15)]"
  >
    <div className="text-6xl mb-5">🕊️</div>

    <h2 className="text-3xl font-serif mb-3 text-yellow-100">
      Éternelle lumière 🤍🕊️
    </h2>

    <p className="text-yellow-50/80">
      Une présence éternel qui continue de briller ✨🌟.
    </p>
  </button>
</motion.div>

        </motion.div>

        {loading && (
          <div className="text-center text-zinc-400">
            Chargement des butterfly...
          </div>
        )}

        {!loading && (
          <>
            <div className="text-center mb-14">
              <p className="text-zinc-400">
                Tu as reçu
              </p>

              <h2 className="text-5xl font-bold mt-3">
                {messages.length} butterfly  🦋
              </h2>
            </div>

            {messages.length === 0 ? (
              <div className="max-w-xl mx-auto text-center bg-white/5 border border-white/10 rounded-3xl p-8">
                <p className="text-zinc-300">
                  Aucun butterfly  n’a encore été déposé dans ton jardin.
                </p>
              </div>
            ) : (
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
              >
                {messages.map((item, index) => {
                  const butterfly = getButterflyStyle(item.relation);

                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{
                        scale: 1.12,
                        y: -10,
                        rotate: [0, -2, 2, 0],
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setOpenedMessage(item)}
                      className={`group bg-gradient-to-br ${butterfly.color} ${butterfly.border} border hover:shadow-[0_0_40px_rgba(255,105,180,0.35)] transition rounded-3xl h-44 flex flex-col items-center justify-center backdrop-blur-md`}
                    >
                      <motion.div
                        animate={{ y: [0, -8, 0], rotate: [0, 6, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="text-5xl mb-4"
                      >
                        {butterfly.emoji}
                      </motion.div>

                      <p className="text-zinc-100 text-sm font-medium">
                        {butterfly.title}
                      </p>

                      <p className="text-zinc-400 text-xs mt-2">
                        butterfly  #{index + 1}
                      </p>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </>
        )}
      </section>

      <MemoryGlobe
        messages={messages}
        onOpenMessage={(message) => setOpenedMessage(message)}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-12 text-center">
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowMemoryBook(true)}
          className="w-full bg-white/10 border border-white/10 hover:border-pink-300 rounded-3xl p-10 backdrop-blur-md shadow-2xl"
        >
          <div className="text-6xl mb-5">📖</div>

          <h2 className="text-3xl font-serif mb-3">
            Livre des souvenirs
          </h2>

          <p className="text-zinc-300">
            Tous les butterfly réunis dans un seul livre.
          </p>
        </motion.button>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowFinalMessage(true)}
          className="w-full bg-pink-500/20 border border-pink-300/40 hover:border-pink-300 rounded-3xl p-10 backdrop-blur-md shadow-2xl"
        >
          <div className="text-6xl mb-5">🎬</div>

          <h2 className="text-3xl font-serif mb-3">
            Message final
          </h2>

          <p className="text-pink-100">
            Une dernière surprise de Nounours.
          </p>
        </motion.button>
      </div>

      <AnimatePresence>
        {openedMessage && (
          <MessageModal
            openedMessage={openedMessage}
            onClose={() => setOpenedMessage(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFinalMessage && (
          <FinalMessageModal onClose={() => setShowFinalMessage(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMemoryBook && (
          <MemoryBookModal
            messages={messages}
            onClose={() => setShowMemoryBook(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
  {showEllaGate && (
    <EternalMemoryGate
      onClose={() => setShowEllaGate(false)}
    />
  )}
</AnimatePresence>

    </main>
  );
}