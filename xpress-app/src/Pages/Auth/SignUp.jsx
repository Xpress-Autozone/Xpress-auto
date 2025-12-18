import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signIn } from '../../Redux/userSlice';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = () => {
    // In a real app, you'd have Google Auth logic here.
    // For now, we'll simulate a login.
    dispatch(signIn({ name: 'New User' }));
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center pt-20">
      <div className="max-w-md w-full text-center p-8">
        <img src="/assets/icons/parts.png" alt="Sign Up Icon" className="mx-auto h-24 w-auto mb-6" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Get Started</h2>
        <p className="mb-8 text-gray-600">Create an account to start shopping and manage your orders.</p>
        <button
          onClick={handleSignUp}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Sign Up with Google
        </button>
      </div>
    </div>
  );
};

export default SignUp;
