import { json, useLoaderData } from "@remix-run/react";
import { Credentials } from "~/libs/credentials";
import { SpotifyApi, Track } from "~/libs/spotifyApi";

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

interface TrackListItemProps {
  track: Track;
  isPlaying?: boolean;
  index: number;
}
function TrackListItem({ track, index }: TrackListItemProps) {
  return (
    <div className="flex items-center justify-between text-white hover:bg-slate-600 rounded-xl py-2">
      <div className="flex items-center">
        <div className="px-6">
          {index + 1}
        </div>
        <div className="flex min-w-[400px] items-center">
          <img src={track.album.images[0].url} className="w-10 h-10 rounded-lg mr-2" />
          <div>
            <div className="text-base">{track.name}</div>
            <div className="text-sm font-extralight">
              {track.artists.map(artist => <span className="mr-2">{artist.name}</span>)}
            </div>
          </div>
        </div>
      </div>
      <div className="text-sm font-extralight">
        {msConversion(track.duration_ms)}
      </div>
    </div>
  )
}

export async function loader({ params }: { params: { id: string } }) {
  try {
    const credentials = new Credentials();
    const spotifyApiAcessToken = await credentials.getSpotifyAccessToken({
      clientId: "6fb939a6018a46c6abb4ef6a5539b1e1",
      clientSecret: "0c2f82c490aa43628caf32c0980d77fe"
    });

    const spotifyApi = new SpotifyApi(spotifyApiAcessToken);
    const playlist = await spotifyApi.getPlaylist({ id: params.id });

    return json({ playlist });
  } catch (error) {
    return json({ playlist: null });
  }
}

export default function Users() {
  const data = useLoaderData<typeof loader>();
  const playlist = data.playlist;

  return (
    <div className="container my-8">
      <div className="rounded-xl overflow-hidden">
        <div className="relative bg-slate-900 py-8">
          <div className="absolute w-full scale-105 bottom-0 blur-3xl z-0">
            <img src={playlist?.images[0].url} className="w-full" />
          </div>
          <div className="absolute top-0 left-0 bg-gradient-to-t from-black/20 to-black/10 w-full h-full z-10" />
          <div className="py-8 px-4 grid grid-cols-6 gap-4 z-20 relative">
            <img src={playlist?.images[0].url} className="shadow-2xl w-[204px] h-[204px]" />
            <div className="col-span-5 flex flex-col justify-end ">
              <span className="text-white font-light text-sm">Playlist</span>
              <h1 className="font-bold text-8xl text-white mb-4">{playlist?.name}</h1>
              <span className="text-white font-light text-sm">{playlist?.description}</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-b from-slate-800 to-slate-900">
          <div className="h-[80px]">

          </div>
          <div className="p-4">
            {playlist?.tracks.items.map((item, index) => <TrackListItem track={item.track} index={index} key={item.track.id} />)}
          </div>
        </div>
      </div>
    </div>
  );
}