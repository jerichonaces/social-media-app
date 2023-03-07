import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context';
import AdminRoute from '../../components/routes/AdminRoute';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import renderHTML from 'react-render-html';

const Admin = () => {
  const [state, setState] = useContext(UserContext);

  // posts
  const [posts, setPosts] = useState([]);

  // router
  const router = useRouter();
  const _id = router.query._id;

  useEffect(() => {
    if (state && state.token) {
      newsFeed();
    }
  }, [state && state.token]);

  const newsFeed = async () => {
    try {
      const { data } = await axios.get('/posts');
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (post) => {
    try {
      const answer = window.confirm('Delete post?');
      if (!answer) return;
      const { data } = await axios.delete(`/admin/delete-post/${post._id}`);
      toast.error('Post deleted.');
      newsFeed();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminRoute>
      <div className='container-fluid'>
        <div className='row py-10 text-light bg-default-image'>
          <div className='col'>
            <h1 className='display-1 fw-bold text-center'>Admin</h1>
          </div>
        </div>

        <div className='row py-4'>
          <div className='col-md-8 offset-md-2'>
            {posts.map((post) => (
              <div key={post._id} className='d-flex justify-content-between'>
                <div>{renderHTML(post.content)}</div>
                <div onClick={() => handleDelete(post)} className='text-danger'>
                  Delete
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default Admin;
