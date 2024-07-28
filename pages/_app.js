import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";

import "../styles/globals.css";

//INTERNAL IMPORT
import { StateContextProvider } from "../Context/index";
export default function App({ Component, pageProps }) {
  return (
    <>
      <StateContextProvider>
        <Component {...pageProps} />
        {/*The Toaster will help use make use of the toast and display the error when ever it is called in our page component  */}
        <Toaster />
      </StateContextProvider>
    </>
  );
}
