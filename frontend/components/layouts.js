import Header from './header'
import Footer from './footer'
import Head from 'next/head'
import styles from "../styles/Home.module.css";

export default function Layout({ children }) {
    return(
        <>
            <div id={styles.pageWrapper}>
                <Head>
                    <title>FungiDB</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
            <Header/>
                <div id={styles.contentWrapper}>
                    <main>{children}</main>
                </div> 
                <Footer/>
            </div>
        </>

    )
}

