import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import { Spotify } from "~/components/Spotify";
import { createSpotifyAuthCookie } from "~/cookie.server";
import { Credentials } from "~/libs/credentials";
import { Playlist, SpotifyApi } from "~/libs/spotifyApi";

export async function action({ request }: ActionFunctionArgs) {
  const cookies = request.headers.get("Cookie");
  const spotifyAuthToken = await createSpotifyAuthCookie.parse(cookies) as string;

  const formData = await request.formData();
  const action = formData.get("_action");

  const spotifyApi = new SpotifyApi(spotifyAuthToken);

  switch (action) {
    case 'spotify-get-playlists':
      const query = `${formData.get("query")}`;
      const playlists = await spotifyApi.getPlaylists({ query });

      return json({ playlists });

    case 'spotify-get-playlist':
      const id = `${formData.get("id")}`;
      const playlist = await spotifyApi.getPlaylist({ id });

      return json({ playlist });

    default:
      return json({ });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookies = request.headers.get("Cookie");
  const spotifyAuthToken = await createSpotifyAuthCookie.parse(cookies) as string;

  const url = new URL(request.url);
  const spotifyPlaylistId = url.searchParams.get("spotify-playlist-id");
  const spotifyQuery = url.searchParams.get("spotify-query") || 'global';

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
    clientSecret: process.env.X_SPOTIFY_CLIENT_SECRET || ""
  });

  return json(
    { playlist, playlists },
    {
      headers: {
        'Set-Cookie': await createSpotifyAuthCookie.serialize(newSpotifyAuth.access_token, {
          expires: new Date(Date.now() + newSpotifyAuth.expires_in * 1000),
        })
      }
    });
}

export default function Home() {
  return (
    <div className="container flex items-center h-screen">
      <div className="flex justify-between w-full">
        <Spotify />

        <div className="w-[400px] h-[850px] bg-[#060606] rounded-xl overflow-hidden overflow-y-visible">
        </div>
      </div>
    </div>
  );
}