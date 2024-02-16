import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import { createSpotifyAuthCookie } from "~/cookie.server";
import { Credentials } from "~/libs/credentials";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookies = request.headers.get("Cookie");
  const spotifyAuthToken = (await createSpotifyAuthCookie.parse(cookies)) as string;

  if (spotifyAuthToken) {
    redirect("/spotify/playlists");
  }

  const credentials = new Credentials();
  const newSpotifyAuth = await credentials.getSpotifyAccessToken({
    clientId: process.env.X_SPOTIFY_CLIENT_ID || "",
    clientSecret: process.env.X_SPOTIFY_CLIENT_SECRET || "",
  });

  return redirect("/spotify/playlists", {
    headers: {
      "Set-Cookie": await createSpotifyAuthCookie.serialize(newSpotifyAuth.access_token, {
        expires: new Date(Date.now() + newSpotifyAuth.expires_in * 1000),
      }),
    },
  });
}
