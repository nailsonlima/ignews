import Head from 'next/head';
import styles from './styles.module.scss';
import Link from 'next/link';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

import { GetStaticProps } from 'next';
import { getPrismicClient } from '@/services/prismic';

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.getAllByType('publication');

  const posts = response.map(post => {
    return {
      slug: post.uid,
      title: post.data.title,
      excerpt: post.data.content.find(
        (content: any) => content.type === 'paragraph'
      )?.text || '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    };
  });

  return {
    props: { posts },
    revalidate: 60 * 60 * 2, // 2 horas
  };
};
