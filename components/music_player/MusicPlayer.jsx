// src/components/MusicPlayer.js
'use client'

import React, { useState, useEffect, useRef } from 'react';

const MusicPlayer = ({ songs }) => {

    const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(new Audio(songs[currentSongIndex].url));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [canPlay, setCanPlay] = useState(true); // Changed initial value to false
  const [hasSubscription, setHasSubscription] = useState(false); // Changed initial value to false


  useEffect(() => {
    audioRef.current.src = songs[currentSongIndex].url;
  }, [currentSongIndex, songs]);

  useEffect(() => {
    if (isPlaying && canPlay) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, canPlay]);

  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    const updateDuration = () => {
      setDuration(audioRef.current.duration);
    };

    audioRef.current.addEventListener('timeupdate', updateCurrentTime);
    audioRef.current.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audioRef.current.removeEventListener('timeupdate', updateCurrentTime);
      audioRef.current.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  useEffect(() => {
    const endedHandler = () => {
      if (isRepeat) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else if (isShuffle) {
        setCurrentSongIndex(Math.floor(Math.random() * songs.length));
      } else {
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
      }
    };

    audioRef.current.addEventListener('ended', endedHandler);

    return () => {
      audioRef.current.removeEventListener('ended', endedHandler);
    };
  }, [currentSongIndex, isShuffle, isRepeat, songs]);

  const playPauseHandler = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSongHandler = () => {
    if (isShuffle) {
      setCurrentSongIndex(Math.floor(Math.random() * songs.length));
    } else {
      setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
    }
  };

  const prevSongHandler = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
  };

  const shuffleHandler = () => {
    setIsShuffle(!isShuffle);
  };

  const repeatHandler = () => {
    setIsRepeat(!isRepeat);
  };

  const volumeChangeHandler = (e) => {
    setVolume(e.target.value);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const changeTime = (e) => {
    audioRef.current.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  useEffect(() => {
    const timer = setInterval(() => {
        console.log({isPlaying, currentTime, hasSubscription, canPlay})
    

      if (isPlaying && currentTime > 60 && !hasSubscription) {
        audioRef.current.pause();
        setCanPlay(false);
        isPlaying(false)
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying,currentTime, canPlay]);

  return (

    //     <button onClick={prevSongHandler}>Previous</button>
    //     <button onClick={playPauseHandler}>{isPlaying ? 'Pause' : 'Play'}</button>
    //     <button onClick={nextSongHandler}>Next</button>
    //     <button onClick={shuffleHandler}>{isShuffle ? 'Shuffle Off' : 'Shuffle On'}</button>
    //     <button onClick={repeatHandler}>{isRepeat ? 'Repeat Off' : 'Repeat On'}</button>
    //   </div>
    //   <div>
    //     <input
    //       type="range"
    //       value={currentTime}
    //       max={duration || 0}
    //       onChange={changeTime}
    //     />
    //     <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
    //   </div>
    //   <div>
    //     <input
    //       type="range"
    //       value={volume}
    //       max={100}
    //       onChange={volumeChangeHandler}
    //     />
    //   </div>
    // </div>
    <section>
        <div className='fixed h-[105px] backdrop-blur-lg  space-x-16 bottom-[24px] bg-yellow-500/30  w-full  z-[999999]'>
            <div className='container '>
                <div className='flex justify-center content-center '>

                    <div className='w-1/5'>
                        <p>{songs[currentSongIndex].title}</p>
                    </div>

                    <div className='w-2/5 text-center'>
                        <div className='flex flex-col'>
                            <div className='flex flex-row space-x-5'>
                                <button onClick={shuffleHandler}>{isShuffle ? 'Shuffle Off' : 'Shuffle On'}</button>
                                <button onClick={prevSongHandler}>Previous</button>
                                <button onClick={playPauseHandler}>{isPlaying ? 'Pause' : 'Play'}</button>
                                <button onClick={nextSongHandler}>Next</button>
                                <button onClick={repeatHandler}>{isRepeat ? 'Repeat Off' : 'Repeat On'}</button>
                            </div>
                            <div className='flex flex-row'>
                                <div>
                                    <span>{formatTime(currentTime)}</span>
                                </div>
                                <div>
                                    <input
                                    type="range"
                                    value={currentTime}
                                    max={duration || 0}
                                    onChange={changeTime}
                                    />

                                </div>
                                <div>
                                    <span>{formatTime(duration)}</span>
                                </div>

                            </div>

                        </div>
                    </div>

                    <div className='w-1/5'>
                        <p>{songs[currentSongIndex].title}</p>
                    </div>

                </div>
            </div>
        </div>
    </section>
  );
};

export default MusicPlayer;
