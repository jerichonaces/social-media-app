import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import PostForm from '../../../components/forms/PostForm';
import UserRoute from '../../../components/routes/UserRoute';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { RollbackOutlined } from '@ant-design/icons';

const EditPost = () => {
  const [post, setPost] = useState({});
  const [content, setContent] = useState('');
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  //   console.log('router', router);
  const _id = router.query._id;

  useEffect(() => {
    if (_id) fetchPost();
  }, [_id]);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);
      setPost(data);
      setContent(data.content);
      setImage(data.image);
    } catch (err) {
      console.log(err);
    }
  };

  const postSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/update-post/${_id}`, {
        content,
        image,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success('Post updated.');
        router.push('/user/dashboard');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append('image', file);
    // console.log([...formData]);
    setUploading(true);
    try {
      const { data } = await axios.post('/upload-image', formData);
      // console.log('uploaded image => ', data);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  return (
    <UserRoute>
      <div className='container-fluid'>
        <div className='row py-10 text-light bg-default-image'>
          <div className='col'>
            <h1 className='display-1 fw-bold text-center'>Edit Post</h1>
          </div>
        </div>

        <Link
          href='javascript:history.back()'
          className='d-flex justify-content-center mt-5'
        >
          <RollbackOutlined />
        </Link>

        <div className='row py-5'>
          <div className='col-md-8 offset-md-2'>
            <PostForm
              content={content}
              setContent={setContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default EditPost;
