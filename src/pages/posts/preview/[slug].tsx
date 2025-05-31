import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { asHTML, asText } from "@prismicio/helpers";
import { getPrismicClient } from "../../../services/prismic";
import styles from '../post.module.scss';
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function PostPreview({ post }: PostPreviewProps) {

  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if(session?.status === 'authenticated') {
      router.push(`/posts/${post.slug}`)
    }
  }, [session])

  return (
    <>
      <Head>
        <title>{post.title} | Preview</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            <p>Quer continuar lendo?🤗</p>
            <Link href="/">
              <span>🚀 Assine agora</span>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.getByType('publication', {
    pageSize: 100, // ou mais, se tiver muitos posts
  });

  const paths = response.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};


export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('publication', slug);

  if (!response) {
    return {
      notFound: true
    }
  }

  const content = asHTML(response.data.content.splice(0, 2)); // Apenas os 3 primeiros blocos

  const post = {
    slug,
    title: response.data.title,
    content,
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 2, // 2 horas
  };
};
