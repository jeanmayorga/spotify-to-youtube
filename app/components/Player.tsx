import { Pause, Play } from "lucide-react";
import { Track } from "~/libs/spotifyApi";
import { AudioSnapshot, useAudio } from "react-use-audio";
import { useEffect } from "react";
import { useActionData } from "@remix-run/react";


interface Props {
  track: Track;
  audio: AudioSnapshot;
}
export function Player ({ track, audio }: Props) {
  return (
    <div className="absolute bottom-0 left-0 w-full bg-black p-2 flex overflow-hidden">
      <div className="relative w-full h-full">
        <div className="absolute w-full -top-1/3 blur-3xl z-0 scale-x-150">
          <img src={track.album.images[2].url} className="w-full" />
        </div>
        <div className="relative z-10 flex justify-between">
          <div className="flex items-center">
            <img src={track.album.images[2].url} className="w-11 h-11 rounded-lg mr-3" />
            <div>
              <p className="text-base overflow-hidden truncate w-52 text-white">{track.name}</p>
              <div className="text-xs font-extralight overflow-hidden text-white truncate w-52">
                {track.artists.map(artist => <span className="mr-2" key={artist.id}>{artist.name}</span>)}
              </div>
            </div>
          </div>
          {audio.data.isPlaying ? 
            <div className="text-white flex items-center hover:scale-95 active:scale-90 cursor-pointer" onClick={() => audio.pause()}>
              <Pause /> 
            </div>
          : <div className="text-white flex items-center hover:scale-95 active:scale-90 cursor-pointer" onClick={() => audio.play()}>
              <Play />
            </div>
          }
        </div>
      </div>
    </div>
  );
};
