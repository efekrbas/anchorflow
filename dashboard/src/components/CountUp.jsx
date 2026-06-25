import React, { useState, useEffect } from 'react';

const CountUp = ({ 
  end, 
  start = 0, 
  duration = 1500, 
  decimals = 0,
  prefix = '',
  suffix = ''
}) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const parseValue = (val) => {
      if (typeof val === 'string') {
        return parseFloat(val.replace(/,/g, ''));
      }
      return val;
    };

    const targetValue = parseValue(end);
    
    // If it's not a valid number, just render it immediately
    if (isNaN(targetValue)) {
      setCount(end);
      return;
    }

    const startValue = parseValue(start);
    const range = targetValue - startValue;

    const easeOutExpo = (t) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;
      const percent = Math.min(progress / duration, 1);
      
      const easedProgress = easeOutExpo(percent);
      const currentVal = startValue + range * easedProgress;

      setCount(currentVal);

      if (percent < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, start, duration]);

  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    }
    return val;
  };

  return (
    <span>
      {prefix}{formatValue(count)}{suffix}
    </span>
  );
};

export default CountUp;
