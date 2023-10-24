import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { useUser } from '../types/usertypes';

const LoginPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser({ uid: user.uid, email: user.email! });
      navigate('/');
    } catch (error) {
      console.error('Erreur de connexion avec Google :', error);
      setError('Une erreur s\'est produite lors de la connexion.');
    }
  };

  const handleSignInWithEmail = async () => {
    setAuthing(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUser({ uid: auth.currentUser!.uid, email: email });
      navigate('/');
    } catch (error: any) {
      console.error('Erreur de connexion avec e-mail :', error);
      if (error && error.code === 'auth/invalid-login-credentials') {
        setError('Les informations de connexion sont invalides. Vérifiez votre e-mail et votre mot de passe.');
      } else if (error && error.code === 'auth/user-not-found') {
        setError('Aucun utilisateur avec cet e-mail n\'a été trouvé.');
      } else if (error && error.code === 'auth/wrong-password') {
        setError('Le mot de passe est incorrect.');
      } else {
        setError('Une erreur s\'est produite lors de la connexion.');
      }
      setAuthing(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Page de connexion</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="login-form">
        <label>Email :</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="login-form">
        <label>Mot de passe :</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleSignInWithEmail} disabled={authing}>Se connecter par e-mail</button>
      <button className="login-google-button" onClick={handleSignInWithGoogle}>Se connecter avec Google</button>
      <p className="login-signup">Vous n'avez pas de compte ? <Link to="/signup" className="login-signup-link">Inscrivez-vous</Link></p>
    </div>
  );
};

export default LoginPage;
