import { ArrowLeft } from "lucide-react"
import { Playlist } from "~/libs/spotifyApi"
import { Button } from "./ui/button"
import { useNavigate, useSearchParams } from "@remix-run/react";

interface PlaylistHeaderProps {
  playlist: Playlist
}
export function PlaylistHeader ({ playlist }: PlaylistHeaderProps) {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <div className="relative py-8">
      <Button variant="outline" size="icon-sm" className="rounded-full absolute top-4 left-4 z-20" onClick={goBack}>
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <div className="absolute w-full -top-2/3 blur-3xl z-0 scale-x-150">
        <img src={playlist?.images[0].url} className="w-full" />
      </div>
      <div className="flex items-center justify-center relative mb-8">
        <img src={playlist?.images[0].url} className="shadow-2xl w-[204px] h-[204px]" />
      </div>
      <div className="text-white px-4">
        <h2 className="font-bold text-2xl mb-2">{playlist?.name}</h2>
        <p className="font-light text-xs leading-none mb-2">{playlist?.description}</p>
        <div className="font-bold text-xs flex items-center mb-2">
          <div className="w-4 h-4 bg-slate-200 rounded-full mr-1"></div>
          {playlist.owner.display_name}
        </div>
        <div className="font-light text-xs flex items-center">
          {playlist.followers.total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')} saves
        </div>
      </div>
    </div>
  )
}