import React from 'react';
import useSWR from 'swr';
import Head from 'next/head';
import withAuth from '@app/lib/withAuth';

export default function ScriptsOverview() {
  const data = useSWR('/scripts');

  if (!data) {
    return <p>Loading ...</p>;
  }

  return (
    <>
      <Head>
        <title>Scripts overview</title>
      </Head>
      <p>Script overview</p>
    </>
  );
}

export const getServerSideProps = withAuth(() => ({
  props: {},
}));
