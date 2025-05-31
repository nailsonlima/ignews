import { GetServerSideProps } from "next";
import Head from "next/head";
import { asHTML } from "@prismicio/helpers";
import { getPrismicClient } from "../../services/prismic";
import { getServerSession } from "next-auth"; // ou onde estiver o getServerSession no seu setup
import { authOptions } from "../api/auth/[...nextauth]";
import styles from './post.module.scss';

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function Post({ post }: PostProps) {

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div 
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
  const session = await getServerSession(req, res, authOptions);
  console.log(session)
  const { slug } = params as { slug: string };

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false,
      },
    };
  }

  const prismic = getPrismicClient(req);
  const response = await prismic.getByUID('publication', slug, {});

  const post = {
    slug,
    title: response.data.title,
    content: asHTML(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  };

  return {
    props: { post },
  };
};
