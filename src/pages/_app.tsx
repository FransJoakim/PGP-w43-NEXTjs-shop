import { Session } from 'next-auth';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '@/styles/index.css';

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{
  session: Session;
}>) {
  <SessionProvider session={session}>
    <Component {...pageProps} />
  </SessionProvider>;
}
