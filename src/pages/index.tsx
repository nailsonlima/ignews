import { SubscribeButton } from '@/components/SubscribeButton';
import { GetStaticProps } from 'next'

import { stripe } from '@/services/stripe';

import Head from 'next/head';


import styles from './home.module.scss'

interface HomeProps {
  product: {
    priceId: string;
    amount: number
  }
}

export default function Home({product}: HomeProps) {

  return (
  <>
    <Head>
    <title>Home | ig.news</title>
    </Head>
    
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>🤲 Hey, welcome</span>
        <h1>News about the <span>React</span> world.</h1>
        <p>
          Get acess to all the publications <br />
          <span>for {product.amount} month</span>
        </p>
      <SubscribeButton priceId={product.priceId}/>
      </section>

      <img src="/images/avatar.svg" alt="girl coding" />
    </main>

  </>
  );
}


export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1PEtW3EwQJByZ5tFQFcRUqvG')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount! / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  }
}