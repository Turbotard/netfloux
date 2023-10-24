import { Auth, UserCredential } from "firebase/auth";
import { auth } from "../db/db";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const history = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;

    createUserWithEmailAndPassword(auth as Auth, email, password)
      .then((data: UserCredential) => {
        console.log(data, "authData");
        history("/");
      })
      .catch((err) => {
        alert(err.code);
      });
  };

  return (
    <div className="SignUp">
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" />
        <br />
        <input name="password" type="password" placeholder="Password" />
        <br />
        <button type="submit">Inscription</button>
      </form>
      <button onClick={() => history("/")}>Retour à la connexion</button>
    </div>
  );
};

export default SignUp;
