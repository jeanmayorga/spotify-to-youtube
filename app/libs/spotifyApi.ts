import axios, { AxiosInstance } from "axios";


export interface Playlist {
  collaborative: boolean
  external_urls: ExternalUrls
  followers: Followers
  href: string
  id: string
  images: Image[]
  primary_color: string | null
  name: string
  description: string
  type: string
  uri: string
  owner: Owner
  public: boolean
  snapshot_id: string
  tracks: Tracks
}

export interface ExternalUrls {
  spotify: string
}

export interface Followers {
  href: null
  total: number
}

export interface Image {
  url: string
  height: number | null
  width: number | null
}

export interface Owner {
  href: string
  id: string
  type: string
  uri: string
  display_name: string
  external_urls: ExternalUrls
}

export interface Tracks {
  limit: number
  next: string | null
  offset: number
  previous: string | null
  href: string
  total: number
  items: Item[]
}

export interface Item {
  added_at: string
  primary_color: string | null
  video_thumbnail: VideoThumbnail
  is_local: boolean
  added_by: AddedBy
  track: Track
}

export interface VideoThumbnail {
  url: string
}

export interface AddedBy {
  external_urls: ExternalUrls
  id: string
  type: string
  uri: string
  href: string
}

export interface Track {
  preview_url: string
  available_markets: string[]
  explicit: boolean
  type: string
  episode: boolean
  track: boolean
  album: Album
  artists: Artist[]
  disc_number: number
  track_number: number
  duration_ms: number
  external_ids: ExternalIds
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  popularity: number
  uri: string
  is_local: boolean
}

export interface Album {
  available_markets: string[]
  type: string
  album_type: string
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  uri: string
  artists: Artist[]
  external_urls: ExternalUrls
  total_tracks: number
}

export interface Artist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export interface ExternalIds {
  isrc: string
}

export interface Search <T> {
  playlists: {
    href: string
    items: T
    limit: number
    next: string
    offset: number
    previous: string | null
    total: number
  }
}

export class SpotifyApi {
  private client: AxiosInstance;

  constructor (token: string) {
    this.client = axios.create({
      baseURL: "https://api.spotify.com/v1",
      headers: {
        'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}` 
      }
    });
  };

  async getPlaylists (options: { query: string; }) {
    try {
      const request = await this.client.get<Search<Playlist[]>>(`/search`, {
        params: {
          type: 'playlist',
          q: options.query
        }
      });
      console.log(`get playlist ${options.query}`, request.data.playlists.items.length);
      return request.data.playlists.items;
    } catch (error: any) {
      console.log(`error get playlists ${options.query}`, error.response.data)
      return [];
    }
  }

  async getPlaylist (options:{ id: string }) {
    try {
      const request = await this.client.get<Playlist>(`/playlists/${options.id}`);
      console.log(`get playlist ${options.id}`, request.data.name);
      return request.data;
    } catch (error: any) {
      console.log(`error get playlist ${options.id}`, error.response.data)
      return null;
    }
  }
}