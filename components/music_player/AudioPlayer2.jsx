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
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./styles.css";

const songs = [
  {
    id: 1,
    title: "Song 1",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    writer: 'Writer 1',
    image: '/images/demopic/demopic.png'
  },
  {
    id: 2,
    title: "Song 2",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    writer: 'Writer 2',
    image: '/images/demopic/demopic.png'
  },
  {
    id: 3,
    title: "Song 3",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    writer: 'Writer 3',
    image: '/images/demopic/demopic.png'
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
  const [isMute, setIsMute] = useState(false);

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    setDuration(audioPlayer.current.duration);
  }, [currentSong]);

  useEffect(() => {
    if (isPlaying) {
      audioPlayer.current?.play();
    } else {
      audioPlayer.current?.pause();
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
    setCurrentTime(audioPlayer.current?.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioPlayer.current?.duration);
  };

  const handleEnded = () => {
    if (isRepeat) {
      audioPlayer.current?.play();
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

  const handleProgressClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (x / width) * duration;
    audioPlayer.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeClick = (e) => {
    if(!isMute){
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const newVolume = x / width;
      audioPlayer.current.volume = newVolume;
      setVolume(newVolume);
    }
   
  };

  return (
       <>
    <div className=" fixed  backdrop-blur-lg  place-content-center text-center justify-center bottom-[24px] bg-yellow-500/30  w-full h-[140px]">
    <div className="container flex flex-row justify-center content-center space-x-16">
      <div className="items-center content-center justify-center z-[200] w-[300px]">
        {/* song info */}
        <div className="flex flex-row w-[380px] space-x-2">
                <div className="">
                    <img 
                        src={currentSong.image}
                        alt={currentSong.title}
                        width={70}
                        height={70}
                        className="h-[70px] w-[70px] rounded-full"
                    ></img>
                </div>
                <div className="flex flex-col text-gray-600 space-y-2">
                    <div className="">
                        <div className="text-xl  font-bold">{currentSong.title}</div>
                    </div>
                    <div>
                        <div>{currentSong.writer}</div>
                    </div>
                </div>

            </div>

      </div>

      <div className="flex flex-col text-center items-center content-center justify-center space-y-3  w-full">
       {/* audio player */}
       <div>
            <audio
                src={currentSong.src}
                ref={audioPlayer}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />
            <div className="flex flex-row  space-x-6">
                
            <button onClick={toggleShuffle} className={isShuffle ? "active" : ""}>
                    <MdShuffle />
                </button>

                <button onClick={handlePreviousSong}>
                    <MdSkipPrevious />
                </button>

                <button className="text-3xl" onClick={togglePlay}>
                        {isPlaying ? <MdPause /> : <MdPlayArrow />}
                </button>

                <button onClick={handleNextSong}>
                        <MdSkipNext />
                </button>

                <button onClick={toggleRepeat} className={isRepeat ? "active" : ""}>
                    <MdRepeat />
                </button>

                </div>
            
        </div>
        <div className="flex flex-row text-center place-content-center justify-center space-x-5 pb-[15px]">

        <span className="text-xs">{formatTime(currentTime)}</span>

        <ProgressBar
            now={(currentTime / duration) * 100}
            style={{ width: "300px", height:"6px" , backgroundColor:'white'}}
            onClick={handleProgressClick}
        />

        <span className="text-xs">{formatTime(duration)}</span>

        </div>
      </div>

      <div className="w-full text-center items-center content-center justify-center">
         {/* left part */}

            <div className="flex flex-row  space-x-5 ">
            {/* fav icon */}
            <button className="">
                <img src="/images/icons/ic_fav.svg"></img>
            </button>

            {/* volume icon */}
            
               {!isMute && <img onClick={()=>{setIsMute(true); audioPlayer.current.volume = 0;}} width={30} height={30} src="/images/icons/ic_volumeon.svg"></img>}
               {isMute && <img onClick={()=>{setIsMute(false); audioPlayer.current.volume = volume}} width={30} height={30} src="/images/icons/ic_volumeoff.svg"></img>}
                
            {/* volume bar */}
            <div className="text-center items-center content-center justify-center">

                <ProgressBar
                    // variant="customBarColor"
                    now={volume * 100}
                    style={{ width: "100px", height: "6px", backgroundColor:'white'}}
                    onClick={handleVolumeClick}
                />

            </div>
            {/*   notes */}
            <button>
                <img src="/images/icons/ic_songlist.svg"></img>
            </button>
        </div>
      </div>
      </div>
    </div>
  </>
  );
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
