import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { UserContext } from '../context';
import { useRouter } from 'next/router';
import { Avatar } from 'antd';

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
    <nav
      className='nav d-flex justify-content-between'
      style={{ backgroundColor: 'blue' }}
    >
      <Link href='/' legacyBehavior>
        <a
          className={`nav-link text-light logo ${current === '/' && 'active'}`}
        >
          <Avatar src='/images/logo.png' /> PJ & CONNECT
        </a>
      </Link>

      {state === null ? (
        <>
          <Link href='/login' legacyBehavior>
            <a
              className={`nav-link text-light ${
                current === '/login' && 'active'
              }`}
            >
              Login
            </a>
          </Link>

          <Link href='/register' legacyBehavior>
            <a
              className={`nav-link text-light ${
                current === '/register' && 'active'
              }`}
            >
              Register
            </a>
          </Link>
        </>
      ) : (
        <>
          <div className='dropdown'>
            <a
              className='btn dropdown-toggle text-light'
              style={{ borderColor: 'blue' }}
              role='button'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            >
              {state && state.user && state.user.name}
            </a>
            <ul className='dropdown-menu'>
              <li>
                <Link href='/user/dashboard' legacyBehavior>
                  <a
                    className={`nav-link dropdown-item ${
                      current === '/user/dashboard' && 'active'
                    }`}
                  >
                    Newsfeed
                  </a>
                </Link>
              </li>

              <li>
                <Link href='/user/profile/update' legacyBehavior>
                  <a
                    className={`nav-link dropdown-item ${
                      current === '/user/profile/update' && 'active'
                    }`}
                  >
                    Profile
                  </a>
                </Link>
              </li>

              <li>
                <a href='#' onClick={logout} className='nav-link dropdown-item'>
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
