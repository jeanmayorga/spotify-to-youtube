import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";

import { PlaylistTrack } from "~/components/PlaylistTrack";
import { createSpotifyAuthCookie } from "~/cookie.server";
import { SpotifyApi } from "~/libs/spotifyApi";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const cookies = request.headers.get("Cookie");
  const spotifyAuthToken = (await createSpotifyAuthCookie.parse(cookies)) as string;

  const spotifyPlaylistId = params.id;

  if (!spotifyAuthToken || !spotifyPlaylistId) return redirect("/");

  const spotifyApi = new SpotifyApi(spotifyAuthToken);
  const playlist = await spotifyApi.getPlaylist({ id: spotifyPlaylistId });

  return json({ playlist });
}

export default function Users() {
  const data = useLoaderData<typeof loader>();
  const playlist = data.playlist;

  if (!playlist) {
    return <></>;
  }

  return (
    <div className="grid grid-cols-4">
      <header className="relative py-8 w-[400px] h-screen overflow-hidden">
        <div className="absolute w-full bottom-[60%] blur-3xl z-0 scale-x-150">
          <img src={playlist?.images[0].url} className="w-full" alt="background" />
        </div>
        <div className="flex items-center justify-center relative mb-8 z-10">
          <img
            src={playlist?.images[0].url}
            className="shadow-2xl w-[204px] h-[204px]"
            alt="cover"
          />
        </div>
        <div className="text-white px-4 relative z-10">
          <h2 className="font-bold text-2xl mb-2">{playlist?.name}</h2>
          <p className="font-light text-xs leading-none mb-2">{playlist?.description}</p>
          <div className="font-bold text-xs flex items-center mb-2">
            <div className="w-4 h-4 bg-slate-200 rounded-full mr-1"></div>
            {playlist.owner.display_name}
          </div>
          <div className="font-light text-xs flex items-center">
            {playlist.followers.total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")} saves
          </div>
        </div>
      </header>

      <div>
        {playlist?.tracks.items.map((item, index) => (
          <PlaylistTrack key={JSON.stringify(item.track)} track={item.track} index={index} />
        ))}
      </div>
    </div>
  );
}
