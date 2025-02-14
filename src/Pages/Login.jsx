import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="auth-container">
      <SignIn afterSignUpUrl="/"/>
    </div>
  );
};

export default Login;
