import useDarkMode from 'use-dark-mode';
// eslint-disable-next-line no-unused-vars
import React from 'react';
const DarkModeToggle = () => {
  const darkMode = useDarkMode(false);

  return (
    <div>
      <button onClick={darkMode.toggle}>
        {darkMode.value ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  );
};

export default DarkModeToggle;
