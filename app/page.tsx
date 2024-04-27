import Image from "next/image";
import AudioPlayer1 from '@/components/music_player/AudioPlayer2'

export default function Home() {
  const songs = [
    {
      title: 'Song 1',
      url: '/audio/music1.mp3',
    },
    {
      title: 'Song 2',
      url: '/audio/music2.mp3',
    },
    
    {
      title: 'Song 3',
      url: '/audio/music3.mp3',
    },
    
    // Add more songs as needed
  ];
  return (
    <main className="pb-24"> 
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
       <p>My music player</p>
       <h1>My music player </h1>

      </div>
      </div>
      {/* <MusicPlayer songs={songs}/> */}

      <AudioPlayer1/>


    </main>
  );
}
