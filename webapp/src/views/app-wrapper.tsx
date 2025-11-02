import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Browse from './browse';
import View from './view';

export default function AppWrapper() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('genui_user');
    if (!userStr) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userStr));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('genui_user');
    navigate('/');
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#050505]">
        {/* Header */}
        <div className="max-w-8xl mx-auto text-base py-3 px-12 xl:px-4 flex justify-between items-center dark:bg-[#050505] dark:text-white border-b border-gray-200 dark:border-gray-800">
          {/* Logo and User Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                GenUI
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Welcome, {user.name}!
            </span>
          </div>

          {/* Right side icons */}
          <div className="text-right flex justify-end items-center space-x-2 dark:invert">
            <button
              onClick={handleLogout}
              className="opacity-50 hover:opacity-100 duration-200 px-3 py-1 text-xs rounded bg-red-500 text-white"
              title="Logout"
            >
              Logout
            </button>
            
            <a
              className="duration-200 opacity-30 hover:opacity-100 duration-200 p-1 text-center text-xs rounded rounded-full w-6 h-6 font-mono bg-black text-white"
              href="https://openv0.com"
              target="_blank"
            >
              0v
            </a>
            
            <a
              className="opacity-30 hover:opacity-100 duration-200"
              href="https://github.com/raidendotai/openv0"
              target="_blank"
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
                <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
              </svg>
            </a>
            
            <a
              className="opacity-30 hover:opacity-100 duration-200"
              href="https://twitter.com/n_raidenai"
              target="_blank"
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 25 25">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="opacity-30 hover:opacity-100 duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 25 25">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/view/:name" element={<View />} />
        </Routes>
      </div>
    </div>
  );
}
