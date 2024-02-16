import { useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
// import { useAudio } from "react-use-audio";

import { cn } from "~/libs";
import { Playlist, Track } from "~/libs/spotifyApi";

import { Player } from "./Player";
import { PlaylistView } from "./PlaylistView";
import { SpotifyPlaylistsView } from "./SpotifyPlaylistsView";

interface Data {
  playlist: Playlist;
  playlists: Playlist[];
}

export function Spotify() {
  const actionData = useActionData<Data>();
  const loaderData = useLoaderData<Data>();
  const playlist = actionData?.playlist || loaderData?.playlist;
  const playlists = actionData?.playlists || loaderData?.playlists || [];

  const [selectedTrack, setSelectedTrack] = useState<Track | undefined>(undefined);
  // const audio = (window || undefined)?.AudioContext && useAudio(selectedTrack?.preview_url || "");

  async function onSelectTrack(track: Track) {
    setSelectedTrack(track);
    // try {
    //   await new Promise(r => setTimeout(r, 100));
    //   audio.play();
    // } catch (e) {
    //   console.log("ERROR", e)
    // }
  }

  return (
    <div className="relative overflow-hidden border border-neutral-800 bg-[#121212] rounded-xl ">
      <div
        className={cn(
          playlist ? "w-[400px]" : "w-[800px]",
          "relative h-[850px] overflow-hidden overflow-y-visible transition-all",
        )}
      >
        {playlist ? (
          <PlaylistView
            playlist={playlist}
            selectedTrack={selectedTrack}
            onSelectTrack={onSelectTrack}
          />
        ) : (
          <PlaylistsView playlists={playlists} />
        )}
      </div>

      {selectedTrack && <Player track={selectedTrack} audio={audio} />}
    </div>
  );
}
