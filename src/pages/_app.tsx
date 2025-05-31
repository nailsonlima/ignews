import { SessionProvider } from "next-auth/react"
import { Header } from '@/components/Header';
import '../styles/global.scss'

import { AppProps } from "next/app";

function MyApp({Component, pageProps} : AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
)}

export default MyApp;