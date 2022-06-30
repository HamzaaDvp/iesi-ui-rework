import React from 'react';
import withAuth from '@app/lib/withAuth';
import { Typography } from '@mui/material';
import axios, { AxiosResponse } from 'axios';

type TProps = {
  posts: { title: string }[],
  currentUrl: string,
};

export default function ScriptDetail({ posts, currentUrl }: TProps) {
  return (
    <>
      <Typography>Script detail</Typography>
      <Typography>{currentUrl}</Typography>
      {
        posts.map((post) => (
          <Typography>{post.title}</Typography>
        ))
      }
    </>
  );
}

export const getServerSideProps = withAuth(async (context) => {
  const response: AxiosResponse<TProps> = await axios.get('https://jsonplaceholder.typicode.com/posts?size=5');
  return {
    props: {
      posts: response.data,
      currentUrl: context.resolvedUrl,
    },
  };
});
