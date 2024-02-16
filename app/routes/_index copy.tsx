import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";

import { Spotify } from "~/components/Spotify";
import { createSpotifyAuthCookie } from "~/cookie.server";
import { cn } from "~/libs";
import { Credentials } from "~/libs/credentials";
import { Playlist, SpotifyApi } from "~/libs/spotifyApi";

export async function action({ request }: ActionFunctionArgs) {
  const cookies = request.headers.get("Cookie");
  const spotifyAuthToken = (await createSpotifyAuthCookie.parse(cookies)) as string;

  const formData = await request.formData();
  const action = formData.get("_action");

  const spotifyApi = new SpotifyApi(spotifyAuthToken);

  switch (action) {
    case "spotify-get-track":
      console.log("comes here");
      const id = `${formData.get("id")}`;
      const track = await spotifyApi.getTrack({ id });

      return json({ track });

    default:
      return json({});
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookies = request.headers.get("Cookie");
  const spotifyAuthToken = (await createSpotifyAuthCookie.parse(cookies)) as string;

  const url = new URL(request.url);
  const spotifyPlaylistId = url.searchParams.get("spotify-playlist-id");
  const spotifyQuery = url.searchParams.get("spotify-query") || "global";

  const spotifyApi = new SpotifyApi(spotifyAuthToken);

  let playlist = null;
  let playlists: Playlist[] = [];

  if (spotifyPlaylistId) {
    playlist = await spotifyApi.getPlaylist({ id: spotifyPlaylistId });
  }
  if (spotifyQuery) {
    playlists = await spotifyApi.getPlaylists({ query: spotifyQuery });
  }

  if (spotifyAuthToken) {
    return json({ playlist, playlists });
  }

  const credentials = new Credentials();
  const newSpotifyAuth = await credentials.getSpotifyAccessToken({
    clientId: process.env.X_SPOTIFY_CLIENT_ID || "",
    clientSecret: process.env.X_SPOTIFY_CLIENT_SECRET || "",
  });

  return json(
    { playlist, playlists },
    {
      headers: {
        "Set-Cookie": await createSpotifyAuthCookie.serialize(newSpotifyAuth.access_token, {
          expires: new Date(Date.now() + newSpotifyAuth.expires_in * 1000),
        }),
      },
    },
  );
}

export default function Home() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div className="container flex items-center h-screen">
      <div
        className={cn(
          "flex w-full transition-all",
          loaderData.playlist ? "justify-between" : "justify-center",
        )}
      >
        <Spotify />

        {loaderData.playlist ? (
          <div className="w-[400px] h-[850px] bg-[#060606] rounded-xl overflow-hidden overflow-y-visible"></div>
        ) : null}
      </div>
    </div>
  );
}
