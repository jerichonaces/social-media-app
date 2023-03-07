import { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal } from 'antd';
import Link from 'next/link';
import { UserContext } from '../context';
import { useRouter } from 'next/router';

import AuthForm from '../components/forms/AuthForm';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secret, setSecret] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const [state] = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/register`, {
        name,
        email,
        password,
        confirmPassword,
        secret,
      });

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setSecret('');
        setOk(data.ok);
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  if (state && state.token) router.push('/');

  return (
    <div className='container-fluid'>
      <div className='row py-10 text-light bg-default-image'>
        <div className='col'>
          <h1 className='display-1 fw-bold text-center'>Register</h1>
        </div>
      </div>

      <div className='row py-5'>
        <div className='col-md-6 offset-md-3'>
          <AuthForm
            handleSubmit={handleSubmit}
            name={name}
            email={email}
            password={password}
            secret={secret}
            setName={setName}
            setEmail={setEmail}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            setSecret={setSecret}
            loading={loading}
          />
        </div>

        <div className='row'>
          <div className='col'>
            <Modal
              title='Congratulations!'
              open={ok}
              onCancel={() => setOk(false)}
              footer={null}
            >
              <p>You have successfully registered.</p>
              <Link href='/login' className='btn btn-primary btn-sm'>
                Login
              </Link>
            </Modal>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          <p className='text-center'>
            Already registered? <Link href='/login'>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
