import React, { useEffect, useState } from "react";
import {
  Auth,
  getAuth,
  onAuthStateChanged,
  signOut,
  User,
  updateEmail,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [updateStatus, setUpdateStatus] = useState<
    "IDLE" | "PENDING" | "SUCCESS" | "ERROR"
  >("IDLE");
  const navigate = useNavigate();
  const authInstance: Auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate, authInstance]);

  const handleSignOut = () => {
    signOut(authInstance)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion: ", error);
      });
  };

  const handleSendEmailVerification = () => {
    if (user) {
      sendEmailVerification(user)
        .then(() => {
          alert("E-mail de vérification envoyé!");
        })
        .catch((error) => {
          console.error(
            "Erreur lors de l'envoi de l'e-mail de vérification: ",
            error
          );
          alert("Erreur lors de l'envoi de l'e-mail de vérification.");
        });
    }
  };

  const handleEmailUpdate = () => {
    if (user && newEmail) {
      setUpdateStatus("PENDING");
      updateEmail(user, newEmail)
        .then(() => {
          setUpdateStatus("SUCCESS");
          alert("Email mis à jour avec succès!");
          setUser(authInstance.currentUser);
        })
        .catch((error) => {
          setUpdateStatus("ERROR");
          console.error("Erreur lors de la mise à jour de l'e-mail: ", error);
          alert("Erreur lors de la mise à jour de l'e-mail.");
        });
    }
  };

  const handleSendPasswordResetEmail = () => {
    if (user && user.email) {
      sendPasswordResetEmail(authInstance, user.email)
        .then(() => {
          alert("Lien de réinitialisation du mot de passe envoyé à votre e-mail!");
        })
        .catch((error) => {
          console.error("Erreur lors de l'envoi du lien de réinitialisation: ", error);
          alert("Erreur lors de l'envoi du lien de réinitialisation.");
        });
    }
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="Profile">
      <h1>Profil</h1>
      <p>Email actuel: {user.email}</p>

      <div>
        <input
          type="email"
          placeholder="Nouvel e-mail"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button onClick={handleEmailUpdate}>
          {updateStatus === "PENDING" ? "Mise à jour..." : "Mettre à jour l'e-mail"}
        </button>
      </div>
      
      {!user.emailVerified && (
        <>
          <button onClick={handleSendEmailVerification}>
            Envoyer l'e-mail de vérification
          </button>
          <p>Si vous n'avez pas reçu l'e-mail, veuillez vérifier votre dossier de spam.</p>
        </>
      )}

      {user.emailVerified && (
        <button onClick={handleSendPasswordResetEmail}>
          Réinitialiser le mot de passe
        </button>
      )}

      {updateStatus === "SUCCESS" && <p>Email mis à jour avec succès!</p>}
      {updateStatus === "ERROR" && (
        <p>Erreur lors de la mise à jour de l'e-mail.</p>
      )}
      <button onClick={handleSignOut}>Déconnexion</button>
    </div>
  );
};

export default Profile;
