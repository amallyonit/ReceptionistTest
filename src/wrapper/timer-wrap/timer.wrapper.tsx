import React, { useState, useEffect, useRef } from 'react';

const useGlobalTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef:any = useRef(null);

  const startTimer = () => {
    setIsRunning(true);
    console.log("log")
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const resumeTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  return {
    time,
    isRunning,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
  };
};

export default useGlobalTimer;
