import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signIn } from '../../Redux/userSlice';
import SEO from "../../lib/SEOHelper";
import { getPageMetadata } from "../../data/pageMetadata";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const metadata = getPageMetadata('login');

  const handleSignIn = () => {
    // Simulating a login - normally this would be an API call
    const userData = {
      name: 'Guest User',
      email: 'guest@example.com',
      isOnboarded: false // New users start as not onboarded
    };
    dispatch(signIn(userData));

    // Redirect based on onboarding status
    if (userData.isOnboarded) {
      navigate('/cart');
    } else {
      navigate('/onboarding');
    }
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
        <img src="/assets/icons/parts.png" alt="Sign In Icon" className="mx-auto h-24 w-auto mb-6" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Sign In</h2>
        <p className="mb-8 text-gray-600">Sign in to continue to your cart and enjoy a seamless shopping experience.</p>
        <button
          onClick={handleSignIn}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
