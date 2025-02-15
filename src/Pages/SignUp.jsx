import { SignUp } from "@clerk/clerk-react";
import "./Auth.scss";

const SignUpPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-logo">Code<span>Connect</span></h1>
        <SignUp redirectUrl="/" />
      </div>
    </div>
  );
};

export default SignUpPage;
