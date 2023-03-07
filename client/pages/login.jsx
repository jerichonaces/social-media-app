import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthForm from '../components/forms/AuthForm';
import { UserContext } from '../context';

const Login = () => {
  const [email, setEmail] = useState('jericho@gmail.com');
  const [password, setPassword] = useState('jerichoPassword');
  const [loading, setLoading] = useState(false);

  const [state, setState] = useContext(UserContext);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/login`, {
        email,
        password,
      });

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        // update context
        setState({
          token: data.token,
          user: data.user,
        });
        // save in local storage
        window.localStorage.setItem('auth', JSON.stringify(data));
        router.push('/user/dashboard');
      }
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  if (state && state.token) router.push('/user/dashboard');

  return (
    <div className='container-fluid'>
      <div className='row py-10 text-light bg-default-image'>
        <div className='col'>
          <h1 className='display-1 fw-bold text-center'>Login</h1>
        </div>
      </div>

      <div className='row py-5'>
        <div className='col-md-6 offset-md-3'>
          <AuthForm
            handleSubmit={handleSubmit}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            loading={loading}
            page='login'
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <p className='text-center'>
            Not yet registered? <Link href='/register'>Register</Link>
          </p>
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <p className='text-center'>
            <Link href='/forgot-password' className='text-danger'>
              Forgot password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
