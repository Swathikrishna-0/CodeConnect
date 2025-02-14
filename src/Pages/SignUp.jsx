import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="auth-container">
      <SignUp redirectUrl="/" />
    </div>
  );
};

export default SignUpPage;
