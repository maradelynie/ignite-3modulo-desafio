import Prismic from '@prismicio/client';
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse';
import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { useState } from 'react';
import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';

import { Header } from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<PostPagination>(postsPagination);

  function updatePostList(data: ApiSearchResponse): void {
    const newPostsData: Post[] = data.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          { locale: ptBR }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts({
      next_page: data.next_page,
      results: [...posts.results, ...newPostsData],
    });
  }
  function getMorePosts(): void {
    fetch(posts.next_page)
      .then(response => {
        response.json().then(data => {
          updatePostList(data);
        });
      })
      .catch(err => {
        console.error('Failed retrieving information', err);
      });
  }

  return (
    <>
      <Header />
      <main className={styles.postsContainer}>
        <ul>
          {posts?.results?.map(post => {
            return (
              <li key={post.uid}>
                <h1>{post.data.title}</h1>
                <h3>{post.data.subtitle}</h3>
                <div className={styles.postInfo}>
                  <div>
                    <FiCalendar /> <time>{post.first_publication_date}</time>
                  </div>
                  <div>
                    <FiUser /> <span>{post.data.author}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {posts?.next_page ? (
          <button onClick={getMorePosts} type="button">
            Load More...
          </button>
        ) : (
          <></>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    {
      fetch: [
        'post.title',
        'post.subtitle',
        'post.author',
        'post.banner',
        'post.content',
      ],
      pageSize: 4,
    }
  );

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        { locale: ptBR }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results: posts,
      },
    },
  };
};
