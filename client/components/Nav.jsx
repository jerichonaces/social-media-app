import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { UserContext } from '../context';
import { useRouter } from 'next/router';
import { Avatar } from 'antd';
import { HomeFilled, HomeOutlined } from '@ant-design/icons';
import { imageSource } from '../functions';

const Nav = () => {
  const [current, setCurrent] = useState('');
  const [state, setState] = useContext(UserContext);

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const router = useRouter();

  const logout = () => {
    window.localStorage.removeItem('auth');
    setState(null);
    router.push('/login');
  };

  return (
    <nav className='nav d-flex justify-content-between align-items-center'>
      <Link href='/' className='nav-link'>
        <Avatar src='/images/logo.jpg' />
      </Link>

      {state === null ? (
        <>
          <Link
            href='/login'
            className={`nav-link ${
              current === '/login' ? 'text-primary' : 'text-dark'
            }`}
          >
            Login
          </Link>

          <Link
            href='/register'
            className={`nav-link ${
              current === '/register' ? 'text-primary' : 'text-dark'
            }`}
          >
            Register
          </Link>
        </>
      ) : (
        <>
          <div>
            <Link
              href='/user/dashboard'
              className={`nav-link dropdown-item ${
                current === '/user/dashboard' ? 'text-primary' : 'text-dark'
              }`}
            >
              {current === '/user/dashboard' ? (
                <HomeFilled className='h5' />
              ) : (
                <HomeOutlined className='h5' />
              )}
            </Link>
          </div>

          <div className='dropdown'>
            <a
              className='btn dropdown-toggle'
              role='button'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            >
              {state && state.user && (
                <Avatar size={30} src={imageSource(state.user)} />
              )}
            </a>
            <ul className='dropdown-menu'>
              {state.user.role === 'Admin' && (
                <li>
                  <Link
                    href='/admin'
                    className={`nav-link dropdown-item ${
                      current === '/admin' ? 'text-primary' : 'text-dark'
                    }`}
                  >
                    Admin
                  </Link>
                </li>
              )}

              <li>
                <Link
                  href='/user/profile/update'
                  className={`nav-link dropdown-item ${
                    current === '/user/profile/update'
                      ? 'text-primary'
                      : 'text-dark'
                  }`}
                >
                  Profile
                </Link>
              </li>

              <li>
                <a
                  href='#'
                  onClick={logout}
                  className='nav-link dropdown-item text-danger'
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </>
      )}
    </nav>
  );
};

export default Nav;
