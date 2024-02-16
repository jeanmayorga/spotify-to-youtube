import { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";

import { SpotifyPlaylistsView } from "~/components/SpotifyPlaylistsView";
import { createSpotifyAuthCookie } from "~/cookie.server";
import { SpotifyApi } from "~/libs/spotifyApi";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookies = request.headers.get("Cookie");
  const spotifyAuthToken = (await createSpotifyAuthCookie.parse(cookies)) as string;

  const url = new URL(request.url);
  const spotifyQuery = url.searchParams.get("spotify-query") || "global";

  const spotifyApi = new SpotifyApi(spotifyAuthToken);

  const playlists = await spotifyApi.getPlaylists({ query: spotifyQuery });

  return json({ playlists });
}

export default function Home() {
  const loaderData = useLoaderData<typeof loader>();
  const playlists = loaderData.playlists;

  return (
    <div className="container max-w-3xl">
      <SpotifyPlaylistsView playlists={playlists} />
    </div>
  );
}
