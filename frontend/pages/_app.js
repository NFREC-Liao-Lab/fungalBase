import '../styles/globals.css'
import Layout from '../components/layouts.js'
import Head from 'next/head'
import Image from 'next/image'


export default function myApp({ Component, pageProps }) {
  return(
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

