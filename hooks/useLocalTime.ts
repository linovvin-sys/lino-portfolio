'use client';
import { useState, useEffect } from 'react';

export function useLocalTime(timeZone: string = 'UTC') {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setTime(formatter.format(new Date()));
      } catch (e) {
        setTime('');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [timeZone]);

  return time;
}
