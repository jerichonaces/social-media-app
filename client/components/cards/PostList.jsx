import { useContext } from 'react';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { Avatar } from 'antd';
import PostImage from '../images/PostImage';
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { UserContext } from '../../context';
import { useRouter } from 'next/router';
import { imageSource } from '../../functions';

const PostList = ({ posts, handleDelete, handleLike, handleUnlike }) => {
  const [state] = useContext(UserContext);

  const router = useRouter();

  return (
    <>
      {posts &&
        posts.map((post) => (
          <div key={post._id} className='card mb-5'>
            <div className='card-header'>
              {/* <Avatar size={40}>{post.postedBy.name[0]}</Avatar>{' '} */}
              <Avatar size={40} src={imageSource(post.postedBy)} />
              <span className='pt-2 ml-3' style={{ marginLeft: '1rem' }}>
                {post.postedBy.name}{' '}
              </span>
              <span className='pt-2 ml-3' style={{ marginLeft: '1rem' }}>
                {moment(post.createdAt).fromNow()}
              </span>
            </div>
            <div className='card-body'>{renderHTML(post.content)}</div>

            <div className='card-footer'>
              {post.image && <PostImage url={post.image.url} />}
              <div className='d-flex pt-2 align-items-center'>
                {post.likes.includes(state.user._id) ? (
                  <HeartFilled
                    className='text-danger h5 pt-1'
                    onClick={() => handleUnlike(post._id)}
                  />
                ) : (
                  <HeartOutlined
                    className='text-danger h5 pt-1'
                    onClick={() => handleLike(post._id)}
                  />
                )}
                <div className='px-2' style={{ marginRight: '1rem' }}>
                  {post.likes.length} likes
                </div>
                <CommentOutlined className='text-danger h5 pt-1' />
                <div className='px-2'> 3 comments</div>

                {state &&
                  state.user &&
                  state.user._id === post.postedBy._id && (
                    <>
                      <EditOutlined
                        onClick={() => router.push(`/user/post/${post._id}`)}
                        className='text-danger h5 pt-1 mx-auto'
                      />
                      <DeleteOutlined
                        onClick={() => handleDelete(post)}
                        className='text-danger h5 pt-1 '
                      />
                    </>
                  )}
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default PostList;
