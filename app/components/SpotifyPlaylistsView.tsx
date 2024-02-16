import { Link, useNavigation, useSearchParams } from "@remix-run/react";
import { SearchIcon } from "lucide-react";

import { cn } from "~/libs";
import { Playlist } from "~/libs/spotifyApi";

import { Skeleton } from "./ui/skeleton";

interface Props {
  playlists: Playlist[];
}

export function SpotifyPlaylistsView({ playlists }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const queryValue = searchParams.get("spotify-query");

  const isLoading = navigation.state === "loading";

  const handleOnChangeQuery = (query: string) => {
    const regex = /\/playlist\/([a-zA-Z0-9]+)/;
    const matchPlaylistUrl = query.match(regex);

    if (matchPlaylistUrl) {
      searchParams.set("spotify-playlist-id", matchPlaylistUrl[1]);
      setSearchParams(searchParams, { preventScrollReset: true });
      return;
    }

    if (query.length > 0) {
      searchParams.set("spotify-query", query);
      setSearchParams(searchParams, { preventScrollReset: true });
      return;
    }

    searchParams.delete("spotify-query");
    setSearchParams(searchParams, { preventScrollReset: true });
    return;
  };

  return (
    <div className="py-8">
      <div className="bg-[#464646] rounded-md flex items-center px-6 py-2 mb-8">
        <SearchIcon className="w-4 h-4 text-gray-400" />
        <input
          placeholder="Paste spotify playlist url or search"
          type="text"
          className={cn(
            "flex w-full bg-transparent text-gray-400 px-3 text-sm placeholder:text-gray-400 outline-none",
          )}
          defaultValue={queryValue || ""}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onChange={(e) => handleOnChangeQuery(e.target.value)}
        />
      </div>

      <h2 className="font-bold text-2xl mb-4 text-white">Playlists</h2>
      <div className="grid grid-cols-4 gap-4">
        {isLoading &&
          Array.from(Array(14).keys()).map((item) => (
            <div
              key={item}
              className="bg-[#181818] hover:bg-[#282828] rounded-lg p-4 transition-all"
            >
              <Skeleton className="mb-5 rounded-lg w-36 h-36 bg-neutral-700" />
              <Skeleton className="h-4 w-32 mb-2 bg-neutral-700" />
              <Skeleton className="h-3 w-10 bg-neutral-700" />
            </div>
          ))}

        {playlists.map((playlist) => (
          <Link
            to={`/spotify/playlists/${playlist.id}`}
            key={playlist.id}
            className="bg-[#181818] hover:bg-[#282828] rounded-lg p-4 transition-all cursor-pointer"
          >
            <img src={playlist.images[0].url} className="mb-4 rounded-lg w-full h-36" alt="cover" />
            <h3 className="font-bold text-base text-white overflow-hidden truncate w-36">
              {playlist.name}
            </h3>
            <p className="font-light text-sm text-[#a7a7a7]">{playlist.owner.display_name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
