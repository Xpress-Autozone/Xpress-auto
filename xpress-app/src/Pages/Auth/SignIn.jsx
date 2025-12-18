import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signIn } from '../../Redux/userSlice';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignIn = () => {
    // In a real app, you'd have Google Auth logic here.
    // For now, we'll simulate a login.
    dispatch(signIn({ name: 'Guest User' }));
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center pt-20">
      <div className="max-w-md w-full text-center p-8">
        <img src="/assets/icons/parts.png" alt="Sign In Icon" className="mx-auto h-24 w-auto mb-6" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Sign In</h2>
        <p className="mb-8 text-gray-600">Sign in to continue to your cart and enjoy a seamless shopping experience.</p>
        <button
          onClick={handleSignIn}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
