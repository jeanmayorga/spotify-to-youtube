import axios from "axios";

export interface SpotifyAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class Credentials {
  constructor () {}

  async getSpotifyAccessToken (options: { clientId: string; clientSecret: string; }) {
    const request = await axios<SpotifyAccessTokenResponse>({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        'Content-Type': "application/x-www-form-urlencoded"
      },
      data: {
        grant_type: "client_credentials",
        client_id: options.clientId,
        client_secret: options.clientSecret
      }
    });

    return request.data;
  }
}