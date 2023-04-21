import '../styles/globals.css'
import Layout from '../components/layouts.js'
import Head from 'next/head'
import Image from 'next/image'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

export default function myApp({ Component, pageProps }) {
  return(
    <Layout>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </Layout>
  );
}

