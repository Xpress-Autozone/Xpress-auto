export const pageMetadata = {
    home: {
        title: 'Home',
        description: 'Welcome to Xpress Auto, your one-stop shop for automotive parts.',
        keywords: 'auto parts, car repair, automotive',
        url: 'https://xpress-auto.com/',
    },
    login: {
        title: 'Sign In',
        description: 'Sign in to your Xpress Auto account.',
        keywords: 'login, sign in, auth',
        url: 'https://xpress-auto.com/login',
    },
    signup: {
        title: 'Get Started',
        description: 'Create an account at Xpress Auto.',
        keywords: 'signup, register, auth',
        url: 'https://xpress-auto.com/signup',
    },
    onboarding: {
        title: 'Complete Your Profile',
        description: 'Tell us more about your vehicle.',
        keywords: 'onboarding, profile, car info',
        url: 'https://xpress-auto.com/onboarding',
    },
};

export const getPageMetadata = (page) => {
    return pageMetadata[page] || pageMetadata.home;
};
