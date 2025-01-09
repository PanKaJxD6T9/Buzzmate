import "@/styles/globals.css";
import { StateProvider } from "@/context/StateContext";
import Head from "next/head";
import reducer, { initialState } from "@/context/StateReducers";

export default function App({ Component, pageProps }) {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <title>Buzzmate</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Component {...pageProps} />
    </StateProvider>
  );
}
