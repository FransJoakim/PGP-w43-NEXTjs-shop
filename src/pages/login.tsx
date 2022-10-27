import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Login />
    </div>
  );
};

const Login = () => {
  const { data: session, status } = useSession();
  if (status === 'authenticated') {
    return (
      <div className="flex flex-col items-center">
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>
          <b>Sign out</b>
        </button>
        <Link href="/quotes">
          <div className="chuck">
            <Image src="/chuck.webp" alt="Chuck" height="250px" width="210px" />
          </div>
        </Link>
      </div>
    );
  }

  return (
    <button onClick={() => signIn()}>
      <b>Sign in</b>
    </button>
  );
};

export default LoginPage;
