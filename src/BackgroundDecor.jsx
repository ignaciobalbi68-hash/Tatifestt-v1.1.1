import React from 'react';

const BackgroundDecor = () => {
  const icons = ['fa-bolt', 'fa-ghost', 'fa-scissors', 'fa-birthday-cake', 'fa-butterfly', 'fa-rainbow'];
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <i
          key={i}
          className={`fa-solid ${icons[i % icons.length]} absolute text-sky-300 opacity-30`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: '1.5rem'
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundDecor;
