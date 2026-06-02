"use client";

import { useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const CLOUD_NAME = "dkrt3gv6z";
const UPLOAD_PRESET = "univers-nounours";
const SUBMISSION_DEADLINE = new Date("2026-06-17T23:59:59");

export default function ProchesPage() {
  const isSubmissionClosed = new Date() > SUBMISSION_DEADLINE;

  const [hasStarted, setHasStarted] = useState(false);
  const [introStep, setIntroStep] = useState(0);

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");

  const [wish, setWish] = useState("");
  const [funnyMoment, setFunnyMoment] = useState("");
  const [heartMessage, setHeartMessage] = useState("");
  const [advice, setAdvice] = useState("");
  const [bestMemory, setBestMemory] = useState("");
  const [nickname, setNickname] = useState("");
  const [learnedFromYou, setLearnedFromYou] = useState("");
  const [becauseOfYou, setBecauseOfYou] = useState("");

  const [mediaItems, setMediaItems] = useState([{ file: null, caption: "" }]);
  const [coverImageFile, setCoverImageFile] = useState(null);

  const [voiceFile, setVoiceFile] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const procheIntroSteps = [
    {
      title: "Bienvenue dans l’univers d’Elvira",
      text: " À l’occasion de son anniversaire, nous t’invitons à lui laisser un morceau de ton cœur.Un souvenir qui te fait sourire.Une photo oubliée. Une vidéo qui compte pour toi.Quelques mots qu’elle mérite d’entendre.Chaque papillon deviendra une petite lumière dans son univers et lui rappellera à quel point elle est aimée. 🦋❤️ 🦋",
      emoji: "🦋",
    },
    {
      title: "Laisse une trace de ton cœur",
      text: "Pour son son anniversaire, offre-lui quelque chose qui ne s’achète pas : un souvenir, une émotion,un mot sincère, ou un message qu’elle pourra conserver pour toujours. Les plus beaux cadeaux sont souvent ceux qui viennent du cœur. 🎂❤️ 💌",
      emoji: "💌",
    },
    {
      title: "Ajoute tes souvenirs",
      text: "Tu peux joindre des photos, vidéos avec chant, danse ou un vocal. Ce n’est pas obligatoire, mais cela rendra ton papillon encore plus spécial. 📸",
      emoji: "📸",
    },
    {
      title: "Dépose ton papillon",
      text: "Remplis seulement les parties qui t’inspirent. L’important est que ce soit personnel, sincère et rempli d’amour. ❤️",
      emoji: "❤️",
    },
  ];

  function addMediaItem() {
    setMediaItems([...mediaItems, { file: null, caption: "" }]);
  }

  function removeMediaItem(index) {
    setMediaItems(mediaItems.filter((_, i) => i !== index));
  }

  function updateMediaItem(index, field, value) {
    const updatedItems = [...mediaItems];
    updatedItems[index][field] = value;
    setMediaItems(updatedItems);
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const file = new File([audioBlob], `vocal-${Date.now()}.webm`, {
          type: "audio/webm",
        });

        setVoiceFile(file);
        setVoiceUrl(URL.createObjectURL(audioBlob));

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error(error);
      alert("Impossible d’accéder au micro. Autorise le micro puis réessaie.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  function removeVoice() {
    setVoiceFile(null);
    setVoiceUrl("");
  }

  async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const resourceType =
      file.type.startsWith("video") || file.type.startsWith("audio")
        ? "video"
        : "image";

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Erreur Cloudinary :", result);
      throw new Error(result.error?.message || "Erreur Cloudinary.");
    }

    return result;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (new Date() > SUBMISSION_DEADLINE) {
      alert("Les dépôts de papillons sont maintenant fermés 🦋");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      let uploadedCoverImageUrl = "";
      const uploadedMediaItems = [];

      if (coverImageFile) {
        const uploadedCoverImage = await uploadToCloudinary(coverImageFile);
        uploadedCoverImageUrl = uploadedCoverImage.secure_url;
      }

      for (const item of mediaItems) {
        if (item.file) {
          const uploadedMedia = await uploadToCloudinary(item.file);

          uploadedMediaItems.push({
            url: uploadedMedia.secure_url,
            type: uploadedMedia.resource_type,
            publicId: uploadedMedia.public_id,
            caption: item.caption,
          });
        }
      }

      if (voiceFile) {
        const uploadedVoice = await uploadToCloudinary(voiceFile);

        uploadedMediaItems.push({
          url: uploadedVoice.secure_url,
          type: "audio",
          publicId: uploadedVoice.public_id,
          caption: "Vocal laissé pour Elvira 🎙️",
        });
      }

      await addDoc(collection(db, "messages"), {
        name,
        relation,
        wish,
        funnyMoment,
        heartMessage,
        advice,
        bestMemory,
        nickname,
        learnedFromYou,
        becauseOfYou,
        coverImage: uploadedCoverImageUrl,
        mediaItems: uploadedMediaItems,
        createdAt: serverTimestamp(),
      });

      setName("");
      setRelation("");
      setWish("");
      setFunnyMoment("");
      setHeartMessage("");
      setAdvice("");
      setBestMemory("");
      setNickname("");
      setLearnedFromYou("");
      setBecauseOfYou("");
      setMediaItems([{ file: null, caption: "" }]);
      setCoverImageFile(null);
      setVoiceFile(null);
      setVoiceUrl("");
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue. Vérifie la taille des fichiers ou réessaie.");
    }

    setLoading(false);
  }

    if (!hasStarted) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#160020] via-black to-black" />

        <AnimatePresence mode="wait">
          <motion.div
            key={introStep}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-2xl text-center bg-white/10 border border-white/10 backdrop-blur-md rounded-[2rem] p-8 md:p-10 shadow-2xl"
          >
            <div className="text-7xl mb-8">
              {procheIntroSteps[introStep].emoji}
            </div>

            <p className="uppercase tracking-[0.4em] text-pink-400 text-xs mb-5">
              L’univers d’Elvira
            </p>

            <h1 className="text-4xl md:text-5xl font-serif mb-6">
              {procheIntroSteps[introStep].title}
            </h1>

            <p className="text-zinc-300 leading-relaxed text-lg mb-10">
              {procheIntroSteps[introStep].text}
            </p>

            {introStep < procheIntroSteps.length - 1 ? (
              <button
                onClick={() => setIntroStep(introStep + 1)}
                className="bg-white text-black px-8 py-4 rounded-full text-lg hover:scale-105 transition"
              >
                Continuer ✨
              </button>
            ) : (
              <button
                onClick={() => setHasStarted(true)}
                className="bg-white text-black px-8 py-4 rounded-full text-lg hover:scale-105 transition"
              >
                Créer mon papillon 🦋
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden px-6 py-12">
      <div className="absolute inset-0 bg-gradient-to-b from-[#160020] via-black to-black" />
      {[...Array(12)].map((_, i) => (
  <motion.div
    key={i}
    className="absolute text-3xl pointer-events-none"
    initial={{
      x: Math.random() * 1200,
      y: 900,
      opacity: 0,
    }}
    animate={{
      y: -200,
      x: Math.random() * 1200,
      opacity: [0, 1, 1, 0],
      rotate: [0, 15, -15, 0],
    }}
    transition={{
      duration: 15 + Math.random() * 10,
      repeat: Infinity,
      ease: "linear",
      delay: Math.random() * 8,
    }}
  >
    🦋
  </motion.div>
))}

      <section className="relative z-10 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.4em] text-pink-400 text-sm mb-5">
            L’Univers d’Elvira
          </p>

          <motion.h1
  animate={{
    scale: [1, 1.02, 1],
  }}
  transition={{
    duration: 4,
    repeat: Infinity,
  }}
  className="text-5xl md:text-6xl font-serif mb-6"
>
  Laisse ton papillon 🦋
</motion.h1>
          <p className="text-zinc-300 leading-relaxed">
            Partage un souvenir, un message, une photo, une vidéo ou un vocal.
            Chaque détail pourra devenir un moment précieux qu’Elvira redécouvrira plus tard. ✨
          </p>
        </div>

        <div className="bg-pink-500/10 border border-pink-300/20 rounded-3xl p-6 mb-8">
          <h2 className="text-2xl font-serif mb-3">
            Comment rendre ton papillon magique ?
          </h2>

          <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
            {`Pense à un moment que vous avez partagé ensemble.

Un fou rire.
Une phrase qu’elle t’a dite.
Une photo oubliée.
Un souvenir qui te fait sourire.

Ce sont souvent les petites choses qui deviennent les plus beaux souvenirs. 🦋`}
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(236,72,153,0.15)]">
          {isSubmissionClosed ? (
            <div className="bg-black/30 border border-white/10 rounded-3xl p-10 text-center">
              <h2 className="text-4xl font-serif mb-6">
                Le jardin est maintenant fermé 🦋
              </h2>

              <p className="text-zinc-300 leading-relaxed text-lg">
                Merci à tous ceux qui ont laissé un souvenir pour Elvira.
                <br />
                <br />
                Les papillons déposés resteront maintenant dans son univers pour toujours ✨
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

<motion.div
  animate={{
    y: [0, -10, 0],
    rotate: [0, 5, -5, 0],
  }}
  transition={{
    duration: 4,
    repeat: Infinity,
  }}
  className="text-center text-7xl mb-8 drop-shadow-[0_0_25px_rgba(255,215,120,0.8)]"
>
  ✨🦋✨
</motion.div>
              {success && (
                <div className="mb-6 rounded-2xl bg-green-500/10 border border-green-400/20 text-green-300 p-4 text-center whitespace-pre-line">
                  {`🦋 🦋✨🦋✨🦋

Ton papillon a pris son envol.

Il vole maintenant vers le jardin secret d’Elvira. ❤️`}
                </div>
              )}

              <input
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400"
                placeholder="Ton nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <select
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                required
              >
                <option value="">Ton lien avec Elvira</option>
                <option value="Maman">Maman</option>
                <option value="Papa">Papa</option>
                <option value="Frère">Frère</option>
                <option value="Sœur">Sœur</option>
                <option value="Cousin">Cousin</option>
                <option value="Cousine">Cousine</option>
                <option value="Tante">Tante</option>
                <option value="Oncle">Oncle</option>
                 <option value="Neveux">Neveux</option>
                  <option value="Nièce">Nièce</option>

                <option value="Meilleure ami(e)">Meilleure ami(e)</option>
                <option value="Ami(e)">Ami(e)</option>
                <option value="Collègue">Collègue</option>
                <option value="Connaissance">Connaissance</option>
                <option value="Camarade">Camarade</option>
                <option value="Autre">Autre</option>
              </select>

              <textarea className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400 min-h-28" placeholder="✨ Ton souhait pour Elvira" value={wish} onChange={(e) => setWish(e.target.value)} />
              <textarea className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400 min-h-28" placeholder="😂 Un moment drôle" value={funnyMoment} onChange={(e) => setFunnyMoment(e.target.value)} />
              <textarea className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400 min-h-28" placeholder="❤️ Message du cœur" value={heartMessage} onChange={(e) => setHeartMessage(e.target.value)} />
              <textarea className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400 min-h-28" placeholder="🧠 Un conseil" value={advice} onChange={(e) => setAdvice(e.target.value)} />
              <textarea className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400 min-h-28" placeholder="📸 Meilleur souvenir" value={bestMemory} onChange={(e) => setBestMemory(e.target.value)} />

              <input className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400" placeholder="🏷️ Le surnom que tu lui donnes et pourquoi" value={nickname} onChange={(e) => setNickname(e.target.value)} />

              <textarea className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400 min-h-28" placeholder="🌱 Ce que tu as appris grâce à Elvira" value={learnedFromYou} onChange={(e) => setLearnedFromYou(e.target.value)} />
              <textarea className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400 min-h-28" placeholder="🙏 Grâce à Elvira, je suis... / j’ai..." value={becauseOfYou} onChange={(e) => setBecauseOfYou(e.target.value)} />

              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
                <div>
  <p className="text-pink-300 font-medium text-lg">
    🖼️ Photo de couverture du chapitre
  </p>

  <motion.div
    animate={{
      rotate: [0, 2, -2, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
    }}
    className="text-5xl text-center mt-4"
  >
    📖✨🦋✨📖
  </motion.div>
</div>

                <p className="text-zinc-400 text-sm">
                  Choisis une photo qui représentera ton chapitre dans le livre des souvenirs.
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImageFile(e.target.files[0])}
                  className="w-full text-sm text-zinc-300 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-5 file:py-3 file:text-black"
                />

                {coverImageFile && (
                  <p className="text-sm text-zinc-400">
                    Photo sélectionnée : {coverImageFile.name}
                  </p>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-5">
                <div>
                  <p className="text-pink-300 font-medium text-lg">
                    📸 Galerie de souvenirs
                  </p>

                  <p className="text-zinc-400 text-sm mt-1">
                    Photos et vidéos que tu aimerais lui faire redécouvrir.
                  </p>
                </div>

                {mediaItems.map((item, index) => (
                  <div key={index} className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-4">
                    <p className="text-zinc-300 font-medium">
                      Souvenir média #{index + 1}
                    </p>

                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) =>
                        updateMediaItem(index, "file", e.target.files[0])
                      }
                      className="w-full text-sm text-zinc-300 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-5 file:py-3 file:text-black"
                    />

                    {item.file && (
                      <p className="text-sm text-zinc-400">
                        Fichier sélectionné : {item.file.name}
                      </p>
                    )}

                    <textarea
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400 min-h-24"
                      placeholder="📝 Ajoute un petit commentaire..."
                      value={item.caption}
                      onChange={(e) =>
                        updateMediaItem(index, "caption", e.target.value)
                      }
                    />

                    {mediaItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMediaItem(index)}
                        className="text-red-300 text-sm hover:text-red-200"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addMediaItem}
                  className="w-full border border-pink-300/40 text-pink-200 rounded-full py-3 hover:bg-pink-500/10 transition"
                >
                  + Ajouter une autre photo ou vidéo
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-5">
                <div>
                  <p className="text-pink-300 font-medium text-lg">
                    🎙️ Laisse un message vocal
                  </p>

                  <p className="text-zinc-400 text-sm mt-1">
                    Quelques secondes suffisent parfois pour créer un souvenir inoubliable.
                  </p>
                </div>

                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="w-full bg-pink-500/20 border border-pink-300/40 text-pink-100 rounded-full py-3 hover:bg-pink-500/30 transition"
                  >
                    🎙️ Commencer l’enregistrement
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="w-full bg-red-500/20 border border-red-300/40 text-red-100 rounded-full py-3 hover:bg-red-500/30 transition"
                  >
                    ⏹️ Arrêter l’enregistrement
                  </button>
                )}

                {voiceUrl && (
                  <div className="space-y-3">
                    <audio src={voiceUrl} controls className="w-full" />

                    <button
                      type="button"
                      onClick={removeVoice}
                      className="w-full border border-red-300/40 text-red-200 rounded-full py-3 hover:bg-red-500/10 transition"
                    >
                      Supprimer le vocal
                    </button>
                  </div>
                )}
              </div>

              <button
                disabled={loading}
                className="w-full bg-white text-black rounded-full py-4 text-lg font-medium hover:scale-[1.02] transition disabled:opacity-50"
              >
                {loading ? "Dépôt du papillon..." : "Faire s'envoler mon papillon 🦋"}
              </button>

              <div className="mb-8 text-center bg-pink-500/10 border border-pink-300/20 rounded-3xl p-6">
                <p className="text-zinc-200 leading-relaxed text-lg">
                  Chaque souvenir partagé aujourd’hui
                  <br />
                  deviendra une lumière dans l’univers d’Elvira. ✨
                </p>

                <p className="text-pink-300 mt-4 font-medium">
                  Tu peux déposer tes souvenirs jusqu’au 17 Juin 🦋
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}