import { Playlist } from "~/libs/spotifyApi"
import { PlaylistView } from "./PlaylistView"
import { PlaylistsView } from "./PlaylistsView"
import { useActionData, useLoaderData } from "@remix-run/react"

interface Data {
  playlist: Playlist,
  playlists: Playlist[]
}

export function Spotify() {
  const actionData = useActionData<Data>();
  const loaderData = useLoaderData<Data>();
  const playlist = actionData?.playlist || loaderData?.playlist;
  const playlists = actionData?.playlists || loaderData?.playlists || [];

  if (playlist) {
    return (
      <div className="w-[400px] h-[850px] bg-[#121212] rounded-xl overflow-hidden overflow-y-visible border border-neutral-800">
        <PlaylistView playlist={playlist} />
      </div>
    )
  };

  return (
    <div className="w-[400px] h-[850px] bg-[#121212] rounded-xl overflow-hidden overflow-y-visible border border-neutral-800">
      <PlaylistsView playlists={playlists} />
    </div>
  )
}