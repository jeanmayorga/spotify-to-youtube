import { Playlist } from "~/libs/spotifyApi"
import { PlaylistHeader } from "./PlaylistHeader"
import { PlaylistTrack } from "./PlaylistTrack"

interface Props {
  playlist: Playlist;
}
export function PlaylistView({ playlist }: Props) {
  return (
    <>
      <PlaylistHeader playlist={playlist} />
      <div>
        {playlist?.tracks.items.map((item, index) => 
          <PlaylistTrack
            track={item.track}
            index={index}
            key={JSON.stringify(item.track)}
          />
        )}
      </div>
    </>
  )
}