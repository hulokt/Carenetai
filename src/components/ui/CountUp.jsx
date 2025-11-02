import React, { useEffect, useState } from 'react';

const CountUp = ({ from = 0, to, duration = 1, delay = 0 }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    // Wait for delay before starting
    const delayTimeout = setTimeout(() => {
      const startTime = Date.now();
      const endTime = startTime + duration * 1000;
      const totalChange = to - from;

      const timer = setInterval(() => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (duration * 1000), 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.round(from + totalChange * easeOutQuart);
        
        setCount(currentCount);

        if (now >= endTime) {
          setCount(to);
          clearInterval(timer);
        }
      }, 16); // ~60fps

      return () => clearInterval(timer);
    }, delay * 1000);

    return () => clearTimeout(delayTimeout);
  }, [from, to, duration, delay]);

  return <span>{count}</span>;
};

export default CountUp;

