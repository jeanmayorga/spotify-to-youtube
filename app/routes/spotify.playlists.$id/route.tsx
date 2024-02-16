import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { json, useLoaderData, useNavigation } from "@remix-run/react";

import { PlaylistHeader } from "~/components/PlaylistHeader";
import { PlaylistTrack } from "~/components/PlaylistTrack";
import { ScrollArea } from "~/components/ui/scroll-area";
import { createSpotifyAuthCookie } from "~/cookie.server";
import { SpotifyApi } from "~/libs/spotifyApi";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const cookies = request.headers.get("Cookie");
  const spotifyAuthToken = (await createSpotifyAuthCookie.parse(cookies)) as string;

  const spotifyPlaylistId = params.id;

  if (!spotifyAuthToken || !spotifyPlaylistId) return redirect("/");

  const spotifyApi = new SpotifyApi(spotifyAuthToken);
  const playlist = await spotifyApi.getPlaylist({ id: spotifyPlaylistId });

  if (!playlist) return redirect("/");

  return json({ playlist });
}

export default function Users() {
  const navigation = useNavigation();
  console.log({ navigation });

  const isLoading = navigation.state === "loading";
  const data = useLoaderData<typeof loader>();
  const playlist = data.playlist;

  return (
    <div className="container">
      {isLoading && "loader"}
      <div className="grid grid-cols-6">
        <ScrollArea className="col-span-2 overflow-hidden h-screen border-x border-gray-900">
          <PlaylistHeader playlist={playlist} />

          <div>
            {playlist?.tracks.items.map((item, index) => (
              <PlaylistTrack key={JSON.stringify(item.track)} track={item.track} index={index} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
