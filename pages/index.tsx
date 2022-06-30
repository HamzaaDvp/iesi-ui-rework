function Home() {
  return null;
}

export const getServerSideProps = () => ({
  redirect: {
    permanent: false,
    destination: '/scripts',
  },
});

export default Home;
