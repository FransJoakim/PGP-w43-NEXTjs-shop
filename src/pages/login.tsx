import { signIn, signOut, useSession } from 'next-auth/react';

const Login = () => {
  // const { data: session } = useSession();
  return (
    <div>
      <button onClick={() => signIn()}>Sign In</button>
    </div>
  );
};

export default Login;
