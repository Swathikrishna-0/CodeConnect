import { SignIn } from "@clerk/clerk-react";
import "./Auth.scss";

const Login = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-logo">Code<span>Connect</span></h1>
        <SignIn afterSignUpUrl="/" />
      </div>
    </div>
  );
};

export default Login;