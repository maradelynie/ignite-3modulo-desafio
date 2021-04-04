import Prismic from '@prismicio/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';
import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import React from 'react';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
      alt: string;
    };
    author: string;
    content: {
      heading: string;
      body: [];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const postContent = post.data.content.map(group => {
    return {
      heading: group.heading,
      body: RichText.asText(group.body),
    };
  });

  const wordCount = postContent
    .reduce((acc, item) => {
      const text = item.heading + ' ' + item.body;
      return text + ' ' + acc;
    }, '')
    .split(' ').length;
  const minutesToRead = Math.ceil(wordCount / 200);
  return (
    <>
      <Head>
        <title>Post | spacetraveling</title>
      </Head>
      <Header />
      <main className={styles.postContent}>
        {post ? (
          <>
            <img src={post.data.banner.url} alt={post.data.banner.alt} />
            <article className={commonStyles.pageContainer}>
              <header>
                <h1> {post.data.title} </h1>
                <section className={commonStyles.postInfo}>
                  <div>
                    <FiCalendar />
                    <time>
                      {format(
                        new Date(post.first_publication_date),
                        'dd MMM yyyy',
                        { locale: ptBR }
                      )}
                    </time>
                  </div>
                  <div>
                    <FiUser /> <span>{post.data.author}</span>
                  </div>
                  <div>
                    <FiClock /> <span>{minutesToRead} min</span>
                  </div>
                </section>
              </header>
              {post.data.content.map(group => {
                return (
                  <React.Fragment key={group.heading}>
                    <h2>{group.heading}</h2>
                    <div
                      dangerouslySetInnerHTML={{ 
                        __html: RichText.asText(group.body) 
                      }}
                    />
                  </React.Fragment>
                );
              })}
            </article>
          </>
        ) : (
          <span>Carregando ...</span>
        )}
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    {
      fetch: ['post.uid'],
      pageSize: 100,
    }
  );
  const staticPages = response.results.map(post => {
    return { params: { slug: post.uid } };
  });

  return {
    paths: staticPages,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
      subtitle: response.data.subtitle,
    },
  };
  return {
    props: {
      post,
    },
    revalidate: 60 * 60,
  };
};
