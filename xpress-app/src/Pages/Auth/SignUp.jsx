import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signIn } from '../../Redux/userSlice';
import SEO from "../../lib/SEOHelper";
import { getPageMetadata } from "../../data/pageMetadata";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const metadata = getPageMetadata('signup');

  const handleSignUp = () => {
    // Simulating account creation
    const userData = {
      name: 'New User',
      email: 'newuser@example.com',
      isOnboarded: false
    };
    dispatch(signIn(userData));
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center pt-20">
      <SEO
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        ogUrl={metadata.url}
        ogImage={metadata.ogImage}
        ogType={metadata.ogType}
        canonicalUrl={metadata.url}
      />
      <div className="max-w-md w-full text-center p-8">
        <img src="/assets/icons/parts.png" alt="Sign Up Icon" className="mx-auto h-24 w-auto mb-6" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Get Started</h2>
        <p className="mb-8 text-gray-600">Create an account to start shopping and manage your orders.</p>
        <button
          onClick={handleSignUp}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          Sign Up with Google
        </button>
      </div>
    </div>
  );
};

export default SignUp;
