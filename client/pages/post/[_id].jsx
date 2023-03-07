import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import Post from '../../components/cards/Post';
import Link from 'next/link';
import { RollbackOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import CommentForm from '../../components/forms/CommentForm';

const PostComments = () => {
  const [post, setPost] = useState({});

  // comments
  const [comment, setComment] = useState('');
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});

  const router = useRouter();
  const _id = router.query._id;

  useEffect(() => {
    if (_id) fetchPost();
  }, [_id]);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);
      setPost(data);
    } catch (error) {
      console.log(error);
    }
  };

  const removeComment = async (postId, comment) => {
    let answer = window.confirm('Delete comment?');
    if (!answer) return;
    try {
      const { data } = await axios.put('/remove-comment', {
        postId,
        comment,
      });
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (post) => {
    try {
      const answer = window.confirm('Delete post?');
      if (!answer) return;
      const { data } = await axios.delete(`/delete-post/${post._id}`);
      toast.error('Post deleted.');
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (_id) => {
    try {
      const { data } = await axios.put('/like-post', { _id });
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnlike = async (_id) => {
    try {
      const { data } = await axios.put('/unlike-post', { _id });
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (post) => {
    setCurrentPost(post);
    setVisible(true);
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put('/add-comment', {
        postId: currentPost._id,
        comment,
      });
      // console.log('add comment', data);
      setComment('');
      setVisible(false);
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row py-10 text-light bg-default-image'>
        <div className='col'>
          <h1 className='display-1 fw-bold text-center'>Comments</h1>
        </div>
      </div>

      <Link
        href='/user/dashboard'
        className='d-flex justify-content-center mt-5'
      >
        <RollbackOutlined />
      </Link>

      <div className='container col-md-8 offset-md-2 pt-5'>
        <Post
          post={post}
          commentsCount={100}
          handleDelete={handleDelete}
          handleLike={handleLike}
          handleUnlike={handleUnlike}
          handleComment={handleComment}
          removeComment={removeComment}
        />
      </div>
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        title='Comment'
        footer={null}
      >
        <CommentForm
          comment={comment}
          setComment={setComment}
          addComment={addComment}
        />
      </Modal>
    </div>
  );
};

export default PostComments;
