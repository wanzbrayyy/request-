import React from 'react';

const animatedEmojiMap = {
  '😏': 'animate-smirk',
  '😂': 'animate-laugh',
  '👍': 'animate-thumb',
  '❤️': 'animate-heart',
};

const AnimatedEmojiMessage = ({ text }) => {
  const parts = text.split(new RegExp(`(${Object.keys(animatedEmojiMap).join('|')})`));

  return (
    <p>
      {parts.map((part, index) => {
        if (animatedEmojiMap[part]) {
          return <span key={index} className={`${animatedEmojiMap[part]} inline-block`}>{part}</span>;
        }
        return part;
      })}
    </p>
  );
};

export default AnimatedEmojiMessage;
