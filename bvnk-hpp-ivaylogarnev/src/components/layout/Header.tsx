import { useNavigate } from 'react-router-dom';

import bvnkLogo from '@assets/bvnk-logo.svg';

export const Header = () => {
  const navigate = useNavigate();

  const handleHomeBack = () => navigate('/');

  return (
    <header className="sticky top-0 left-0 w-full bg-white shadow-sm z-10 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <button
          onClick={handleHomeBack}
          className="focus:outline-none cursor-pointer"
          aria-label="Go to home page"
        >
          <img src={bvnkLogo} alt="BVNK Logo" width="120" height="32" />
        </button>
        <div className="flex-1 mx-4">
          <h1 className="text-xl font-semibold text-center">Payment Page</h1>
        </div>
      </div>
    </header>
  );
};
