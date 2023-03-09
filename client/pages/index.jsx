import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context';
import ParallaxBG from '../components/cards/ParallaxBG';
import axios from 'axios';
import PostPublic from '../components/cards/PostPublic';
import Head from 'next/head';
import Link from 'next/link';
import io from 'socket.io-client';

const socket = io(
  process.env.NEXT_PUBLIC_SOCKETIO,
  { path: '/socket.io' },
  {
    reconnection: true,
  }
);

const Home = ({ posts }) => {
  const [state, setState] = useContext(UserContext);

  const [newsFeed, setNewsFeed] = useState([]);

  // useEffect(() => {
  //   // console.log('SOCKETIO ON JOIN', socket);
  //   socket.on('received-message', (newMessage) => {
  //     alert(newMessage);
  //   });
  // }, []);

  useEffect(() => {
    socket.on('new-post', (newPost) => {
      setNewsFeed([newPost, ...posts]);
    });

    socket.on('delete-post', (deletePost) => {
      setNewsFeed([deletePost, ...posts]);
    });
  }, []);

  const head = () => (
    <Head>
      <title>PJConnect - A social network by devs for devs</title>
      <meta
        name='description'
        content='A social network by developers for other web developers'
      />
      <meta
        property='og:description'
        content='A social network by developers for other web developers'
      />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content='PJConnect' />
      <meta property='og:url' content='http://pjconnect.com' />
      <meta
        property='og:image:secure_url'
        content='http://pjconnect.com/images/logo.jpg'
      />
    </Head>
  );

  const collection = newsFeed.length > 0 ? newsFeed : posts;

  return (
    <>
      {head()}

      <ParallaxBG url='/images/default.png' />

      <div className='container'>
        {/* <button
          onClick={() => {
            socket.emit('send-message', 'This is jericho!!!');
          }}
        >
          Send message
        </button> */}
        <div className='row pt-5'>
          {collection.map((post) => (
            <div className='col-md-4' key={post._id}>
              <Link
                href={`/post/view/${post._id}`}
                className='text-decoration-none text-dark'
              >
                <PostPublic key={post._id} post={post} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get('/posts');
  return {
    props: {
      posts: data,
    },
  };
}

export default Home;
