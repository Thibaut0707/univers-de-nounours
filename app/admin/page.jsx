"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const ADMIN_PASSWORD = "nounours-admin";

export default function  AdminPage() {
  const [password, setPassword] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);

  const [count, setCount] = useState(0);
  const [familyCount, setFamilyCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  const [parentsCount, setParentsCount] = useState(0);
  const [otherCount, setOtherCount] = useState(0);

  async function loadStats() {
    const snapshot = await getDocs(collection(db, "messages"));
    const uniqueNames = [...new Set(docs.map((item) => item.nom))];
setCount(uniqueNames.length);

    setCount(docs.length);
    setFamilyCount(docs.filter((item) => item.relation === "Famille").length);
    setFriendsCount(docs.filter((item) => item.relation === "Ami(e)").length);
    setParentsCount(docs.filter((item) => item.relation === "Parent").length);
    setOtherCount(docs.filter((item) => item.relation === "Autre").length);
  }

  useEffect(() => {
    if (isAllowed) {
      loadStats();
    }
  }, [isAllowed]);

  if (!isAllowed) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center">
          <p className="uppercase tracking-[0.4em] text-pink-400 text-sm mb-5">
            L’Univers de Nounours
          </p>

          <h1 className="text-4xl font-serif mb-5">Admin privé</h1>

          <p className="text-zinc-300 mb-8">
            Cette page affiche seulement les statistiques. Aucun message n’est visible ici.
          </p>

          <input
            type="password"
            placeholder="Mot de passe admin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-400 mb-5"
          />

          <button
            onClick={() => {
              if (password === ADMIN_PASSWORD) {
                setIsAllowed(true);
              } else {
                alert("Mot de passe incorrect");
              }
            }}
            className="w-full bg-white text-black rounded-full py-4 font-medium"
          >
            Entrer
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <section className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="uppercase tracking-[0.4em] text-pink-400 text-sm mb-5">
            Dashboard
          </p>

          <h1 className="text-5xl font-serif mb-4">
            L’Univers de Nounours
          </h1>

          <p className="text-zinc-400">
            Les messages restent secrets. Tu vois seulement le nombre d’étoiles déposées.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <p className="text-zinc-400 mb-3">Total</p>
            <h2 className="text-5xl font-bold">{count}</h2>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <p className="text-zinc-400 mb-3">Famille</p>
            <h2 className="text-5xl font-bold">{familyCount}</h2>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <p className="text-zinc-400 mb-3">Ami(e)s</p>
            <h2 className="text-5xl font-bold">{friendsCount}</h2>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <p className="text-zinc-400 mb-3">Parents</p>
            <h2 className="text-5xl font-bold">{parentsCount}</h2>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <p className="text-zinc-400 mb-3">Autres</p>
            <h2 className="text-5xl font-bold">{otherCount}</h2>
          </div>
        </div>

        <div className="mt-10 bg-pink-500/10 border border-pink-300/20 rounded-3xl p-8">
          <h3 className="text-2xl font-serif mb-4">
            Secret respecté ❤️
          </h3>

          <p className="text-zinc-300 leading-relaxed">
            Aucun texte, aucune photo et aucune vidéo ne sont affichés ici.
            Cette page sert seulement à vérifier que les proches participent.
          </p>
        </div>
      </section>
    </main>
  );
}