import { Track } from "~/libs/spotifyApi";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "~/libs";

function msConversion(millis: number): string {
  let sec: number = Math.floor(millis / 1000);
  let hrs: number = Math.floor(sec / 3600);
  sec -= hrs * 3600;
  let min: number = Math.floor(sec / 60);
  sec -= min * 60;

  const paddedSec = sec.toString().padStart(2, '0');
  const paddedMin = min.toString().padStart(2, '0');

  return hrs > 0 ? `${hrs}:${paddedMin}:${paddedSec}` : `${paddedMin}:${paddedSec}`;
}


interface PlaylistTrackProps {
  track: Track;
  isPlaying?: boolean;
  index: number;
}
export function PlaylistTrack({ track, index }: PlaylistTrackProps) {
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <div className="flex items-center justify-between text-white hover:bg-neutral-800 py-2 px-4 cursor-pointer transition-all" onClick={() => setIsActive(true)}>
      <div className={cn("text-left w-[14px] mr-2", isActive && "text-[#1cd760]")}>
        {isActive ? <img width="14" height="14" alt="" src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif" /> : index + 1}
      </div>
      <div className="flex items-center">
        <img src={track.album.images[2].url} className="w-10 h-10 rounded-lg mr-2" />
        <div>
          <p className={cn("text-base overflow-hidden truncate w-52", isActive && "text-[#1cd760]")}>{track.name}</p>
          <div className="text-xs font-extralight overflow-hidden truncate w-52">
            {track.artists.map(artist => <span className="mr-2" key={artist.id}>{artist.name}</span>)}
          </div>
        </div>
      </div>
      <div className="text-xs font-extralight mx-2">
        {msConversion(track.duration_ms)}
      </div>
      <div>
        {/* <Button variant="default" size="icon-sm" className="rounded-full text-gray-500"><ArrowRight className="w-5 h-5" /></Button> */}
      </div>
    </div>
  )
}
