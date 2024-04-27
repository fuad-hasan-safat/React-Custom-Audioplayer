'use client'
import React, { useState, useRef, useEffect } from "react";
import {
  MdPlayArrow,
  MdPause,
  MdSkipNext,
  MdSkipPrevious,
  MdShuffle,
  MdRepeat
} from "react-icons/md";
import "./styles.css";

const songs = [
  {
    id: 1,
    title: "Song 1",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Song 2",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Song 3",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function AudioPlayer1() {
  const audioPlayer = useRef(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    setDuration(audioPlayer.current.duration);
  }, [currentSong]);

  useEffect(() => {
    if (isPlaying) {
      audioPlayer.current.play();
    } else {
      audioPlayer.current.pause();
    }
  }, [isPlaying, currentSong]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNextSong = () => {
    setCurrentSongIndex((prevIndex) =>
      isShuffle
        ? Math.floor(Math.random() * songs.length)
        : prevIndex === songs.length - 1
        ? 0
        : prevIndex + 1
    );
    // if(isPlaying){

    // }
  };

  const playPreviousSong = () => {
    setCurrentSongIndex((prevIndex) =>
      isShuffle
        ? Math.floor(Math.random() * songs.length)
        : prevIndex === 0
        ? songs.length - 1
        : prevIndex - 1
    );
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioPlayer.current.currentTime);
  };

 
  const handleLoadedMetadata = () => {
    setDuration(audioPlayer.current.duration);
  };

  const handleEnded = () => {
    if (isRepeat) {
      audioPlayer.current.play();
    } else {
      playNextSong();
    }
  };

  const handleNextSong = () => {
    if (isPlaying) {
      playNextSong();
    } else {
      setCurrentSongIndex((prevIndex) =>
        prevIndex === songs.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePreviousSong = () => {
    if (isPlaying) {
      playPreviousSong();
    } else {
      setCurrentSongIndex((prevIndex) =>
        prevIndex === 0 ? songs.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="App">
      <h1>Custom Music Player</h1>
      <audio
        src={currentSong.src}
        ref={audioPlayer}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <div>
        <h2>{currentSong.title}</h2>
        <button onClick={handlePreviousSong}>
          <MdSkipPrevious />
        </button>
        <button onClick={togglePlay}>
          {isPlaying ? <MdPause /> : <MdPlayArrow />}
        </button>
        <button onClick={handleNextSong}>
          <MdSkipNext />
        </button>
        <button onClick={toggleShuffle} className={isShuffle ? "active" : ""}>
          <MdShuffle />
        </button>
        <button onClick={toggleRepeat} className={isRepeat ? "active" : ""}>
          <MdRepeat />
        </button>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => {
            audioPlayer.current.currentTime = e.target.value;
            setCurrentTime(e.target.value);
          }}
        />
        <span>{formatTime(currentTime)}</span> /{" "}
        <span>{formatTime(duration)}</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => {
            audioPlayer.current.volume = e.target.value;
            setVolume(e.target.value)
          }}
        />
      </div>
    </div>
  );
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
