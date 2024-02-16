import { Playlist, Track } from "~/libs/spotifyApi"
import { PlaylistHeader } from "./PlaylistHeader"
import { PlaylistTrack } from "./PlaylistTrack"
import { useState } from "react";
import { AudioSnapshot } from "react-use-audio";

interface Props {
  playlist: Playlist;
  selectedTrack?: Track;
  onSelectTrack: (track: Track) => void;
}
export function PlaylistView({ playlist, selectedTrack, onSelectTrack }: Props) {
  return (
    <>
      <PlaylistHeader playlist={playlist} />
      <div>
        {playlist?.tracks.items.map((item, index) => 
          <PlaylistTrack
            track={item.track}
            index={index}
            key={JSON.stringify(item.track)}
            selectedTrack={selectedTrack}
            onSelectTrack={onSelectTrack}
          />
        )}
      </div>
    </>
  )
}