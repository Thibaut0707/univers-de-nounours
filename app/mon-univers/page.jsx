"use client";

import { useEffect, useMemo, useState, useRef  } from "react";
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

function TypewriterText({ text, speed = 45, scrollRef }) {
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

      setTimeout(() => {
        if (scrollRef?.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 20);

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
  }, [text, speed, scrollRef]);

  return (
    <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap text-lg">
      {displayedText}
    </p>
  );
}

function MessageModal({ openedMessage, onClose, audioRef }) {
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

  function autoScrollText(element) {
  if (!element) return;

  const interval = setInterval(() => {
    element.scrollTop = element.scrollHeight;
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
  }, 12000);
}
const messageScrollRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-3 overflow-hidden bg-black/70 backdrop-blur-sm"
    >
      <div className="relative w-[calc(100vw-24px)] max-w-[430px] h-[78vh] max-h-[720px] bg-[#12051c]/95 border border-pink-300/15 backdrop-blur-xl rounded-[2.5rem] px-5 py-6 shadow-[0_0_60px_rgba(255,105,180,0.18)] flex flex-col overflow-hidden mx-auto">
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

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 min-h-[260px] overflow-hidden">
              <h3 className="text-2xl font-serif mb-5">
                {currentSection.title}
              </h3>

              {!currentSection.isMedia && (
  <div
    ref={messageScrollRef}
    className="max-h-[45vh] overflow-y-auto pr-3 overscroll-contain scroll-smooth"
  >
    <TypewriterText
      text={currentSection.content}
      scrollRef={messageScrollRef}
    />
  </div>
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
  onPlay={() => {
    audioRef?.current?.pause();
  }}
  onPause={() => {
    audioRef?.current?.play().catch(() => {});
  }}
  onEnded={() => {
    audioRef?.current?.play().catch(() => {});
  }}
                          className="rounded-2xl w-full max-w-2xl mx-auto max-h-[45vh] object-contain mb-4"
                        />
                      )}
                      {media.type === "audio" && (
 <div className="mb-4">
  <audio
    src={media.url}
    controls
    className="w-full"
    onPlay={() => {
      if (audioRef?.current) {
        audioRef.current.volume = 0.08;
      }
    }}
    onPause={() => {
      if (audioRef?.current) {
        audioRef.current.volume = 0.45;
      }
    }}
    onEnded={() => {
      if (audioRef?.current) {
        audioRef.current.volume = 0.45;
      }
    }}
  />
</div>
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
      className="fixed inset-0 z-[60] flex items-center justify-center px-6 overflow-hidden bg-gradient-to-br from-[#35004d] via-[#14001f] to-[#050505]"
    >
     <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,182,193,0.15),transparent_35%)]" />
<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,215,0,0.10),transparent_30%)]" />
<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,105,180,0.10),transparent_30%)]" />
  <video
    autoPlay
    muted
    loop
    playsInline
    className="w-full h-full object-contain object-center"
  >
    <source src="/final-background.mp4" type="video/mp4" />
  </video>

  <div className="absolute inset-0 bg-black/15" />
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
        className="relative z-10 w-full max-w-5xl max-h-[82vh] overflow-y-auto text-center bg-black/10 border border-white/15 backdrop-blur-[2px] rounded-[2rem] px-5 py-6 md:p-12 shadow-[0_0_35px_rgba(255,255,255,0.08)]"
      >
        <p className="uppercase tracking-[0.5em] text-pink-400 text-sm mb-8">
          Surprise finale
        </p>

        <h1 className="text-5xl md:text-7xl font-serif mb-8">
          Joyeux anniversaire Elvira 🎂
        </h1>

        <p className="text-zinc-200 text-lg leading-relaxed whitespace-pre-wrap mb-10">
{`Tous ces papillons existent parce que tu es aimée.

Derrière chaque mot, chaque souvenir, chaque photo et chaque vidéo se cache une personne qui a pensé à toi, qui a souri en se rappelant un moment partagé, et qui a voulu laisser une trace de son affection dans cet univers.

Cette app n'est pas seulement un cadeau.
C'est la preuve que tu occupes une place unique dans le cœur de nombreuses personnes.

Les jours où le doute viendra frapper à ta porte, reviens ici.
Tourne ces pages.
Relis ces souvenirs.
Écoute les voix de ceux qui tiennent à toi.

Tu découvriras alors quelque chose que le temps ne pourra jamais effacer :
tu es importante,
tu es précieuse,
et tu es profondément aimée.

Aujourd'hui, ce jardin est le tien.
Prends-en soin comme d'un refuge rempli de lumière, de rires et d'amour.

Et n'oublie jamais une chose, Nounours...

Tu laisses dans la vie des autres une empreinte bien plus grande que tu ne l'imagines. ❤️🦋

Nous t'aimons très fort.

Joyeux anniversaire Moon. 🎂✨`}
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



function MemoryBookModal({ messages, onClose, audioRef }) {
  const bookRef = useRef(null);

  const [openedChapters, setOpenedChapters] = useState({});
  const [bookVersion, setBookVersion] = useState(0);
  const [pendingPageIndex, setPendingPageIndex] = useState(null);

  const interludeMessages = [
    {
      title: "Tu n’es pas seule ✨",
      text: "Il arrive parfois que la vie nous fasse croire que nous sommes seuls, surtout lorsque les distances grandissent, que les habitudes changent ou que les chemins se séparent. Pourtant, l’amour laissé dans le cœur des autres ne disparaît jamais. Ce livre existe pour te le rappeler. Chaque page que tu vas découvrir contient un souvenir, un sourire, une pensée, un mot ou une émotion qu’une personne a voulu préserver pour toi. Aujourd’hui, laisse-toi porter par ces souvenirs. Et n’oublie jamais ceci : Tu as compté pour beaucoup de personnes. Tu comptes encore. Et tu compteras toujours. ❤️🦋",
      emoji: "🤍",
    },
    {
      title: "Ta lumière compte 🦋",
      text: "Il y aura peut-être des jours où tu te demanderas si tes efforts valent la peine. Des jours où les rêves sembleront lointains, où la fatigue prendra plus de place que l’espoir. Pourtant, même dans ces moments-là, ta lumière continue de briller. Tu as déjà traversé des épreuves que beaucoup n’auraient pas eu le courage d’affronter. N’oublie jamais que ta valeur ne dépend ni de tes réussites, ni de tes erreurs, ni du regard des autres. Tu es précieuse simplement parce que tu es toi. ✨",
      emoji: "✨",
    },
    {
      title: "La solitude n’est pas la fin 🌙",
      text: "Il arrive parfois que les journées paraissent plus longues lorsque l’on est loin de ceux qu’on aime. Les habitudes changent, les repères disparaissent et certains moments peuvent donner l’impression d’avancer seul. Pourtant, la distance ne mesure jamais la force des liens qui nous unissent. Chaque appel, chaque souvenir, chaque pensée et chaque personne présente dans ce livre sont la preuve que ton histoire continue de vivre dans le cœur de ceux qui t’aiment. Cette période n’est pas une fin. C’est simplement un chapitre entre ce que tu as quitté et tout ce qui t’attend encore. Continue d’avancer avec confiance. Les plus beaux horizons se révèlent souvent à ceux qui ont eu le courage de traverser l’inconnu. 🦋✨",
      emoji: "🌍",
    },
    {
      title: "Dieu a toujours un regard sur toi  🙏",
      text: "Il est facile de croire que nous sommes seuls lorsque les réponses tardent à venir ou lorsque les épreuves semblent s’accumuler. Pourtant, même dans les moments où tu as l’impression que personne ne voit ce que tu traverses, Dieu continue de veiller sur toi. Il connaît les batailles que tu mènes en silence. Il voit les efforts que personne ne remarque. Il entend les prières que tu n’as confiées à personne. Rien de ce qui concerne ta vie n’échappe à Son regard. Si certaines routes semblent longues aujourd’hui, c’est peut-être parce que Dieu est encore en train de préparer quelque chose de plus beau que ce que tu imagines. N’oublie jamais que tu es précieuse à Ses yeux. Tu n’es pas oubliée. Tu n’es pas abandonnée. Et même lorsque tu ne vois pas Sa main, Son regard continue de reposer sur toi avec amour. 🦋❤️📖 Ésaïe 43:1-5 « Ne crains rien, car je te rachète, Je t’appelle par ton nom : tu es à moi. Si tu traverses les eaux, je serai avec toi ; et les fleuves, ils ne te submergeront point; Si tu marches dans le feu, tu ne te brûleras pas, Et la flamme ne t'embrasera pas. Car je suis l'Eternel, ton Dieu, Le Saint d'Israël, ton sauveur; Je donne l'Egypte pour ta rançon, L'Ethiopie et Saba a ta place. Parce que tu as du prix à mes yeux, Parce que tu es honoré et que je t'aime, Je donne des hommes à ta place, Et des peuples pour ta vie. Ne crains rien, car je suis avec toi.»✨",
      emoji: "🕊️",
    },
    {
      title: "Tu es entourée d’amour ❤️",
      text: "Si un jour le doute vient frapper à ta porte, ouvre simplement ce livre. Regarde toutes ces personnes qui ont pris le temps de t’écrire. Toutes ces personnes qui ont gardé un souvenir de toi. Toutes ces personnes qui ont voulu laisser une trace de leur affection dans cet univers. Tu n’es peut-être pas toujours consciente de l’impact que tu as sur les autres. Mais ces pages en sont la preuve. Tu es aimée. Tu es importante. Et ta lumière compte plus que tu ne l’imagines. ❤️🦋",
      emoji: "❤️",
    },
  ];

  const getMessageKey = (message, index) => {
    return message.id || `${message.name || "chapitre"}-${index}`;
  };

  const getChapterCover = (message) => {
    if (message.coverImage) return message.coverImage;

    const firstImage = message.mediaItems?.find(
      (media) => media.type === "image"
    );

    return firstImage?.url || "/nounours-profile.jpg";
  };

  function openChapter(messageKey, pageIndex) {
    setOpenedChapters((prev) => ({
      ...prev,
      [messageKey]: true,
    }));

    setPendingPageIndex(pageIndex);
    setBookVersion((prev) => prev + 1);
  }

  function closeChapter(messageKey, pageIndex) {
    setOpenedChapters((prev) => ({
      ...prev,
      [messageKey]: false,
    }));

    setPendingPageIndex(pageIndex);
    setBookVersion((prev) => prev + 1);
  }

  useEffect(() => {
    if (pendingPageIndex !== null) {
      setTimeout(() => {
        const pageFlip = bookRef.current?.pageFlip?.();

        if (!pageFlip) return;

        if (typeof pageFlip.turnToPage === "function") {
          pageFlip.turnToPage(pendingPageIndex);
        } else if (typeof pageFlip.flip === "function") {
          pageFlip.flip(pendingPageIndex);
        }
      }, 150);
    }
  }, [bookVersion, pendingPageIndex]);

  const chapterPages = useMemo(() => {
    const result = [];

    result.push({
      type: "book-cover",
    });

    result.push({
      type: "intro",
      title: "Chaque page porte une présence",
      text:
        "À Nounours,Si tu lis ces mots aujourd’hui, c’est que tu es arrivée jusqu’à un nouveau chapitre de ton livre. Derrière chaque page se cache une personne qui a croisé ton chemin, partagé des moments avec toi et gardé dans son cœur des souvenirs que le temps n’a jamais effacés. Certaines personnes sont proches, d’autres un peu plus loin aujourd’hui, mais toutes ont laissé une trace dans ton histoire. Ce chapitre n’est pas seulement une collection de messages. C’est une preuve que ton passage dans la vie des autres compte, que tu as fait rire, sourire, réfléchir, aimer et grandir des personnes autour de toi. Prends ton temps. Tourne les pages doucement. Derrière chacune d’elles se trouve un petit morceau d’amour qui t’est destiné. 🦋✨",
    });

    messages.forEach((message, messageIndex) => {
      const messageKey = getMessageKey(message, messageIndex);

      const isOpened = openedChapters[messageKey];

      const gateIndex = result.length;

      result.push({
        type: "chapter-gate",
        message,
        messageKey,
      });

      if (isOpened) {
        if (message.wish) {
          result.push({
            title: "✨ Mon souhait pour Nounours",
            text: message.wish,
            message,
          });
        }

        if (message.funnyMoment) {
          result.push({
            title: "😂 Notre moment drôle",
            text: message.funnyMoment,
            message,
          });
        }

        if (message.heartMessage) {
          result.push({
            title: "❤️ Message du cœur",
            text: message.heartMessage,
            message,
          });
        }

        if (message.advice) {
          result.push({
            title: "🧠 Le conseil que je te donne",
            text: message.advice,
            message,
          });
        }

        if (message.bestMemory) {
          result.push({
            title: "📸 Notre meilleur souvenir",
            text: message.bestMemory,
            message,
          });
        }

        if (message.nickname) {
          result.push({
            title: "🏷️ Le surnom que je t’ai donné",
            text: message.nickname,
            message,
          });
        }

        if (message.learnedFromYou) {
          result.push({
            title: "🌱 Ce que j’ai appris grâce à toi",
            text: message.learnedFromYou,
            message,
          });
        }

        if (message.becauseOfYou) {
          result.push({
            title: "🙏 Grâce à Elvira",
            text: message.becauseOfYou,
            message,
          });
        }

        if (message.mediaItems?.length > 0) {
          message.mediaItems.forEach((media) => {
            result.push({
              type: "media",
              media,
              message,
            });
          });
        }

        result.push({
          type: "chapter-end",
          message,
          messageKey,
          nextPageIndex: gateIndex + 1,
        });
      }

      result.push({
        type: "interlude",
        ...interludeMessages[
          messageIndex % interludeMessages.length
        ],
      });
    });

    return result;
  }, [messages, openedChapters]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black/95 overflow-hidden px-3 py-3"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#3b0057] via-[#1b0028] to-black" />

<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,182,193,0.18),transparent_40%)]" />

<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,215,0,0.12),transparent_35%)]" />

<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,105,180,0.12),transparent_35%)]" />
{[...Array(25)].map((_, i) => (
  <motion.div
    key={i}
    className="absolute text-yellow-200 pointer-events-none"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      opacity: [0.2, 1, 0.2],
      scale: [1, 1.5, 1],
    }}
    transition={{
      duration: 2 + Math.random() * 4,
      repeat: Infinity,
    }}
  >
    ✨
  </motion.div>
))}

      <div className="relative z-10 w-full max-w-6xl mx-auto h-full flex flex-col items-center">
        <div className="w-full flex items-start justify-between mb-3 px-3">
          <div>
            <p className="uppercase tracking-[0.45em] text-yellow-300 text-sm mb-3 drop-shadow-[0_0_12px_rgba(255,215,120,0.8)]">
              Un jardin rempli d’amour uniquement pour Nounours
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-white leading-tight">
              Livre des souvenirs 📖
            </h1>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-3xl"
          >
            ✕
          </button>
        </div>

        <div className="w-full flex justify-center overflow-hidden">
          <HTMLFlipBook
            key={`book-${bookVersion}`}
           width={280}
height={400}
size="stretch"
minWidth={260}
maxWidth={760}
minHeight={380}
maxHeight={520}
            showCover={true}
            useMouseEvents={false}
            clickEventForward={false}
            ref={bookRef}
          >
            {chapterPages.map((page, index) => (
              <div
                key={`${page.type || page.title}-${index}`}
                className="bg-gradient-to-br from-[#fffaf2] via-[#fff4e6] to-[#f8e8c9] text-zinc-900 p-8 h-full border-[8px] border-yellow-200 shadow-[0_0_40px_rgba(255,215,100,0.35)]"
              >
                {page.type === "book-cover" && (
  <div className="h-full relative overflow-hidden rounded-xl flex flex-col justify-center items-center text-center p-8 border-[3px] border-yellow-300 shadow-[inset_0_0_45px_rgba(255,215,120,0.35),0_0_35px_rgba(255,215,120,0.25)] bg-gradient-to-b from-pink-50 via-[#fff7ee] to-yellow-50">

    <div className="absolute inset-4 rounded-xl border border-yellow-500 pointer-events-none" />
    <div className="absolute inset-7 rounded-xl border border-pink-200 pointer-events-none" />

    <div className="absolute top-8 left-8 text-3xl opacity-70">✨</div>
    <div className="absolute top-10 right-10 text-3xl opacity-70">🦋</div>
    <div className="absolute bottom-12 left-10 text-3xl opacity-70">🤍</div>
    <div className="absolute bottom-10 right-10 text-3xl opacity-70">✨</div>

    <motion.div
  animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }}
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="relative z-10 w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-pink-300 shadow-[0_0_35px_rgba(255,105,180,0.45)] mb-5 md:mb-8 mx-auto shrink-0"
>
  <img
    src="/nounours-profile.jpg"
    alt="Nounours"
     className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
  
</motion.div>

    <div className="relative z-10">
      <p className="uppercase tracking-[0.55em] text-pink-500 text-xs mb-5 font-bold">
        Univers émotionnel
      </p>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 md:mb-6 leading-tight text-zinc-900 drop-shadow-[0_0_15px_rgba(255,215,120,0.45)]">
        Livre des souvenirs
      </h2>

      <p className="text-zinc-600 leading-relaxed max-w-sm mx-auto">
        Tous les papillons, tous les souvenirs, tous les mots d’amour réunis dans un seul livre.
      </p>

      <motion.div
        animate={{ scale: [1, 1.15, 1], y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mt-10 text-5xl drop-shadow-[0_0_18px_rgba(255,180,80,0.65)]"
      >
        🦋
      </motion.div>
    </div>
  </div>
)}

                {page.type === "intro" && (
  <div className="h-full flex flex-col text-center px-3 overflow-hidden">
    <div className="text-5xl md:text-6xl mb-4 shrink-0">📖</div>

    <p className="uppercase tracking-[0.35em] text-pink-400 text-xs mb-3 shrink-0">
      Avant de commencer
    </p>

    <h2 className="text-3xl md:text-4xl font-serif mb-4 text-zinc-900 shrink-0">
      {page.title}
    </h2>

    <div className="overflow-y-auto flex-1 pr-2">
      <p className="text-zinc-600 leading-relaxed text-base md:text-lg whitespace-pre-line">
        {page.text}
      </p>
    </div>
  </div>
)}

                {page.type === "chapter-gate" && (
                  <div className="h-full relative rounded-xl overflow-hidden flex items-center justify-center text-center">
                    <img
                      src={getChapterCover(page.message)}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/60" />

                    <div className="relative z-10 text-white p-6">
                     

   <h2
  className="
    text-3xl
    md:text-5xl
    italic
    font-light
    text-white
    leading-tight
    mb-6
    drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]
  "
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
  Mon chapitre avec {page.message.name}
</h2>

                      <p className="mb-8 text-white/80">
                        {page.message.relation}
                      </p>

                      <button
                        onClick={() =>
                          openChapter(
                            page.messageKey,
                            index + 1
                          )
                        }
                        className="bg-white text-black px-8 py-3 rounded-full hover:scale-105 transition"
                      >
                        Ouvrir le chapitre ✨
                      </button>

                      <p className="mt-6 text-white/70 text-sm">
                        Ou tourne simplement la page pour le passer.
                      </p>
                    </div>
                  </div>
                )}

                {!page.type && (
                  <div className="h-full flex flex-col">
                    <p className="text-pink-500 text-sm mb-3">
                      {page.message.name}
                    </p>

                    <h3 className="text-3xl font-serif mb-6">
                      {page.title}
                    </h3>

                    <div className="flex-1 overflow-y-auto pr-3 max-h-[260px] md:max-h-[360px]">
  <p className="text-zinc-700 whitespace-pre-line leading-relaxed text-base md:text-lg">
    {page.text}
  </p>
</div>
                  </div>
                )}

                {page.type === "media" && (
                  <div className="h-full flex flex-col">
                    <h3 className="text-3xl font-serif mb-6">
                      📸 Souvenir
                    </h3>

                    {page.media.type === "image" && (
                      <img
                        src={page.media.url}
                        alt=""
                        className="rounded-2xl w-full max-h-[350px] object-cover mb-4"
                      />
                    )}

                    {page.media.type === "video" && (
                      <video
  src={page.media.url}
  controls
  onPlay={() => {
    audioRef?.current?.pause();
  }}
  onPause={() => {
    audioRef?.current?.play().catch(() => {});
  }}
  onEnded={() => {
    audioRef?.current?.play().catch(() => {});
  }}
  className="rounded-2xl w-full max-h-[350px] mb-4 shadow-xl"
/>
                    )}

                    {page.media.type === "audio" && (
                      <audio
                        src={page.media.url}
                        controls
                        className="w-full mb-4"
                      />
                    )}

                    {page.media.caption && (
                      <p>{page.media.caption}</p>
                    )}
                  </div>
                )}

                {page.type === "chapter-end" && (
                  <div className="h-full flex flex-col justify-center items-center text-center">
                    <div className="text-4xl mb-6">🦋</div>

                    <h2 className="text-4xl font-serif mb-5">
                      Fin du chapitre
                    </h2>

                    <p className="text-zinc-600 mb-8">
                      Le chapitre avec {page.message.name}
                      restera gravé dans ce livre.
                    </p>

                    <button
                      onClick={() =>
                        closeChapter(
                          page.messageKey,
                          page.nextPageIndex
                        )
                      }
                      className="bg-pink-500 text-white px-6 py-3 rounded-full hover:scale-105 transition"
                    >
                      Fermer le chapitre →
                    </button>
                  </div>
                )}

                                {page.type === "interlude" && (
                  <div className="h-full flex flex-col text-center px-3 overflow-hidden">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-5xl md:text-6xl mb-4 shrink-0"
                    >
                      {page.emoji}
                    </motion.div>

                    <h2 className="text-3xl md:text-4xl font-serif mb-4 text-zinc-900 shrink-0">
                      {page.title}
                    </h2>

                    <div className="overflow-y-auto flex-1 pr-2">
                      <p className="text-zinc-600 leading-relaxed text-base md:text-lg whitespace-pre-line">
                        {page.text}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </HTMLFlipBook>
        </div>

        <div className="flex justify-center gap-4 mt-2 shrink-0">
          <button
            onClick={() =>
              bookRef.current?.pageFlip().flipPrev()
            }
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full"
          >
            ← Page précédente
          </button>

          <button
            onClick={() =>
              bookRef.current?.pageFlip().flipNext()
            }
            className="bg-gradient-to-r from-yellow-300 to-pink-500 text-black px-6 py-3 rounded-full"
          >
            Page suivante →
          </button>
        </div>
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

function EternalMemoryGate({ onClose, audioRef }) {
  const [gateOpened, setGateOpened] = useState(false);
  const [showEllaIntro, setShowEllaIntro] = useState(false);
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
    { type: "image", src: "/ella4.jpg" },
  ];

  const isLastMemory = currentMemory === memories.length - 1;
  const activeMemory = memories[currentMemory];

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, []);

  useEffect(() => {
    const gateTimer = setTimeout(() => {
      setGateOpened(true);
      setShowEllaIntro(true);
    }, 14000);

    const introTimer = setTimeout(() => {
      setShowEllaIntro(false);
    }, 18500);

    return () => {
      clearTimeout(gateTimer);
      clearTimeout(introTimer);
    };
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
      className="fixed inset-0 z-[9999] bg-black overflow-hidden overscroll-contain"
    >

      <button
  type="button"
  onClick={onClose}
  className="fixed top-5 right-5 z-[99999] w-12 h-12 rounded-full bg-black/60 border border-white/30 text-white text-2xl hover:bg-white hover:text-black transition"
  aria-label="Quitter la Lumière Éternelle"
>
  ✕
</button>

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
            transition={{ duration: 14, ease: "linear" }}
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
            transition={{ duration: 14, ease: "linear" }}
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
        </>
      )}

      {gateOpened && showEllaIntro && (
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute inset-0 z-50 flex items-center justify-center text-center px-6"
        >
          <div>
            <motion.div
              animate={{ y: [0, -14, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-7xl md:text-8xl mb-8 drop-shadow-[0_0_35px_rgba(255,255,255,1)]"
            >
              🕊️
            </motion.div>

            <h1 className="text-8xl md:text-[10rem] font-serif text-white mb-6 drop-shadow-[0_0_60px_rgba(255,255,255,1)]">
              ELLA
            </h1>

            <div className="text-6xl md:text-7xl mb-8 drop-shadow-[0_0_35px_rgba(255,255,255,1)]">
              🤍
            </div>

            <p className="uppercase tracking-[0.5em] text-[#fff4b8] text-sm md:text-base font-bold drop-shadow-[0_0_20px_rgba(255,240,180,1)]">
              Lumière Éternelle
            </p>
          </div>
        </motion.div>
      )}

      {gateOpened && !showEllaIntro && !showFinalMessage && !isChangingMemory && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-center px-5 py-8 overflow-hidden overscroll-contain"
        >
          <div className="w-full max-w-5xl text-center">
            <p className="uppercase tracking-[0.5em] text-[#fff4b8] text-xs md:text-sm font-bold mb-4 drop-shadow-[0_0_15px_rgba(255,240,180,1)]">
              Souvenir {currentMemory + 1} sur {memories.length}
            </p>

            <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 drop-shadow-[0_0_45px_rgba(255,255,255,1)]">
              Ella 🕊️
            </h1>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentMemory}
                initial={{ opacity: 0, scale: 0.55, y: 80 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.45, y: -80 }}
                transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
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
  className="w-full max-h-[62vh] object-contain rounded-[1.5rem]"
  onPlay={() => {
    if (audioRef?.current) {
      audioRef.current.pause();
    }
  }}
  onPause={() => {
    if (audioRef?.current) {
      audioRef.current.play().catch(() => {});
    }
  }}
  onEnded={() => {
    if (audioRef?.current) {
      audioRef.current.play().catch(() => {});
    }
  }}
/>
                )}
              </motion.div>
            </AnimatePresence>

            <button
              onClick={goNextMemory}
              className="mt-8 bg-white text-black px-8 py-4 rounded-full hover:scale-105 transition shadow-[0_0_30px_rgba(255,255,255,0.6)]"
            >
              {isLastMemory ? "Lumière Éternelle ✨" : "Souvenir suivant →"}
            </button>
          </div>
        </motion.div>
      )}

      {showFinalMessage && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 z-60 flex justify-center px-4 py-6 overflow-y-auto"
        >
          <div className="w-full max-w-6xl text-center bg-black/10 border border-yellow-100/30 backdrop-blur-[2px] rounded-[2rem] p-8 md:p-12 shadow-[0_0_100px_rgba(255,255,255,0.35)]">
            <p className="uppercase tracking-[0.5em] text-[#fff4b8] text-sm font-bold mb-6 drop-shadow-[0_0_18px_rgba(255,240,180,1)]">
              Lumière Éternelle
            </p>

            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 drop-shadow-[0_0_45px_rgba(255,255,255,1)]">
              Ella 🕊️
            </h1>

            <p className="text-white text-base md:text-lg font-medium leading-relaxed whitespace-pre-wrap max-w-5xl mx-auto">
{`Elvira…

Certaines personnes deviennent
bien plus que des souvenirs.

Elles deviennent une lumière
qui continue de nous accompagner,
même quand nos yeux ne peuvent plus les voir.

Ella fait partie de ces âmes rares…
de celles qu’on n’oublie jamais.

À travers chaque rire,
chaque moment partagé,
chaque photo et chaque souvenir,
elle continue d’exister un peu avec nous. ✨

Et tant que son nom sera prononcé avec amour,
sa lumière ne s’éteindra jamais.

Ella 🕊️🤍`}
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
  const audioRef = useRef(null);

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
      text: "Prends une seconde. Respire. Ferme les yeux un instant et ouvre ton cœur. Derrière cette porte se cachent des souvenirs, des sourires et quelques morceaux de cœur. Tout ce que tu vas découvrir ici a été imaginé et créé uniquement pour toi, Nounours 🥰🥰.",
      emoji: "✨",
    },
    {
      title: "Quelque chose t’attend",
      text: "Une porte. Quelques souvenirs. Beaucoup d'amour. Et une histoire qui ne peut être racontée qu’à une seule personne. Continuer ?",
      emoji: "🦋",
    },
    {
      title: "Un jardin secret",
      text: "Chaque butterfly  que tu verras porte une histoire, Chacun d'eux veille sur un souvenir, un éclat de rire, une pensée, ou quelques mots laissés spécialement pour toi. Touche-les et laisse la magie opérer 🦋✨.",
      emoji: "🌙",
    },
    {
      title: "Es-tu prête ?",
      text: "Ton jardin secret t’attend. Les souvenirs sont en place. Les papillons sont réveillés.🦋 Il ne manque plus que toi. 🦋✨❤️.",
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
  src="/elvira.jpg"
  alt="elvira"
  className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"
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
    <>
  <audio
    ref={audioRef}
    src="/piano2.mp3"
    autoPlay
    loop
  />
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 z-0">
   <img
  src="/Marie.jpg"
  alt="Nounours"
 className="w-full h-full object-cover object-top opacity-45 scale-100"
/>

        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
      </div>

      <FloatingButterflies />
      <MagicalStars />
      <MagicCursorTrail />

      
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
              Un morceau de mon cœur ❤️
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
        
          <button
    onClick={() => setShowEllaGate(true)}
    className="mt-15 w-full bg-white/10 border border-yellow-200/40 hover:border-yellow-200 rounded-3xl p-10 text-center backdrop-blur-md hover:scale-[1.02] transition shadow-[0_0_50px_rgba(255,215,120,0.15)]"
  >
    <div className="text-6xl mb-5">🕊️</div>

    <h2 className="text-3xl font-serif mb-3 text-yellow-100">
      Éternelle lumière 🤍🕊️
    </h2>

    <p className="text-yellow-50/80">
      Une présence éternel qui continue de briller ✨🌟.
    </p>
  </button>

      </div>

      <AnimatePresence>
        {openedMessage && (
          <MessageModal
  openedMessage={openedMessage}
  onClose={() => setOpenedMessage(null)}
  audioRef={audioRef}
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
  audioRef={audioRef}
  onClose={() => {
    audioRef?.current?.play().catch(() => {});
    setShowMemoryBook(false);
  }}
/>
        )}
      </AnimatePresence>

      <AnimatePresence>
  {showEllaGate && (
  <EternalMemoryGate
    onClose={() => setShowEllaGate(false)}
    audioRef={audioRef}
  />
)}
</AnimatePresence>

    </main>
        </>
  );
}