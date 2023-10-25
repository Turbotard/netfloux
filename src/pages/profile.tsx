import React, { useEffect, useState } from "react";
import { Auth, getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const authInstance: Auth = getAuth();

  useEffect(() => {
    // Écoute les changements d'état d'authentification
    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate("/"); // Redirige vers la page de connexion si déconnecté
      }
    });

    // Nettoie l'écouteur lors de la désinscription du composant
    return () => unsubscribe();
  }, [navigate, authInstance]);

  const handleSignOut = () => {
    signOut(authInstance)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion: ", error);
      });
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="Profile">
      <h1>Profil</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleSignOut}>Déconnexion</button>
    </div>
  );
}

export default Profile;