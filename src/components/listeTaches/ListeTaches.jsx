import { useState, useEffect } from "react";
import axios from "axios";

export default function ListeTaches() {
  const [taches, setTaches] = useState([]);
  const [nouvelleTache, setNouvelleTache] = useState("");

  // Charger les tâches au chargement du composant
  useEffect(() => {
    axios
      .get("https://backendtodolist-048y.onrender.com/taches")
      .then((reponse) => setTaches(reponse.data))
      .catch((erreur) => console.error(erreur));
  }, []);

  const ajouterTache = () => {
    if (!nouvelleTache.trim()) return;

    axios
      .post("https://backendtodolist-048y.onrender.com/taches", {
        texte: nouvelleTache,
      })
      .then((reponse) => setTaches([...taches, reponse.data]))
      .catch((erreur) => console.error(erreur));
    setNouvelleTache("");
  };

  const supprimerTache = (id) => {
    axios
      .delete(`https://backendtodolist-048y.onrender.com/taches/${id}`)
      .then(() => setTaches(taches.filter((tache) => tache._id !== id)))
      .catch((erreur) => console.error(erreur));
  };

  const basculerEtat = (id, terminee) => {
    axios
      .put(`https://backendtodolist-048y.onrender.com/taches/${id}`, {
        terminee: !terminee,
      })
      .then((reponse) => {
        setTaches(
          taches.map((tache) =>
            tache._id === id ? reponse.data : tache
          )
        );
      })
      .catch((erreur) => console.error(erreur));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Liste de Tâches</h1>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={nouvelleTache}
            onChange={(e) => setNouvelleTache(e.target.value)}
            placeholder="Ajouter une nouvelle tâche..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={ajouterTache}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Ajouter
          </button>
        </div>

        <ul className="space-y-2">
          {taches.map((tache) => (
            <li
              key={tache._id}
              className="flex justify-between items-center p-2 border rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <span
                className={`flex-1 cursor-pointer ${
                  tache.terminee ? "line-through text-gray-400" : "text-gray-700"
                }`}
                onClick={() => basculerEtat(tache._id, tache.terminee)}
              >
                {tache.texte}
              </span>
              <button
                onClick={() => supprimerTache(tache._id)}
                className="ml-4 px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
