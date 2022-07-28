import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export const numberOfResults = 10;

export default function Home() {
  return (
    <div className={styles.container}>

      <main className={styles.main}>
        <h1 className={styles.title}>
          FungalBase- A Databse for Fungi.
        </h1>

        <p className={styles.description}>
          description here
        </p>

        
      </main>
    </div>
  )
}

