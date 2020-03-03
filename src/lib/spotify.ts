var http = require('http');
const { URL } = require('url');
import Queue from 'smart-request-balancer';
import { Observable, from } from 'rxjs';
const SpotifyWebApi = require('spotify-web-api-node');
import fs from 'fs-extra';
import { mergeMap } from 'rxjs/operators';

const clientID = process.env.SPOTIFY_CLIENT_ID || '';

const callbackUrl = 'http://localhost:8111/auth-callback/';

const spotifyApi = new SpotifyWebApi({
  redirectUri: callbackUrl,
  clientId: clientID
});

const scopes = ['user-library-read', 'playlist-read-private'];

export default spotifyApi;

const queue = new Queue({
  rules: {
    common: {
      rate: 3,
      limit: 1,
      priority: 1
    }
  }
});

const TokenForwardPage = `
    <html>
    <head>
    </head>
    <body>
    <div>Please wait...</div>
    <script>
        window.onload = () => {
            const hash = window.location.hash.substring(1);
            console.log(hash);
            fetch("http://localhost:8111/accessToken?" + hash).then(() => {
                document.write('<div>You can now close this tab.</div>');
            })
        }
    </script>
    </body>
    </html>
`;

export function createAuthUrl({
  clientID,
  redirectURI,
  scopes
}: {
  clientID: string;
  redirectURI: string;
  scopes: string[];
}) {
  return `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&redirect_uri=${encodeURI(
    redirectURI
  )}&scope=${encodeURI(scopes.join(' '))}`;
}

export async function startAuth(tokenPath: string) {
  await fs.ensureFile(tokenPath);
  try {
    const userConfig = await fs.readJSON(tokenPath);

    if (userConfig.token && userConfig.expiresAt > new Date().getTime()) {
      spotifyApi.setAccessToken(userConfig.token);
      return {
        waitForAuth: Promise.resolve()
      };
    }
  } catch (e) {
    console.error(e);
  }
  const waitForAuth = new Promise(async (resolve, reject) => {
    const server = http
      .createServer(function(req: any, res: any) {
        if (req.url.includes('accessToken')) {
          const queryData = new URL(req.url, `http://${req.headers.host}`);
          const token = queryData.searchParams.get('access_token');
          spotifyApi.setAccessToken(token);
          res.writeHead(200);
          res.end();
          server.close();
          return fs
            .writeJSON(tokenPath, {
              token,
              expiresAt: new Date().getTime() + 3600 * 1000
            })
            .then(() => {
              resolve();
            });
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(TokenForwardPage);
        res.end();
      })
      .listen(8111);
  });

  return {
    authURL: createAuthUrl({ clientID, redirectURI: callbackUrl, scopes }),
    waitForAuth
  };
}

export async function* getTracksGenerator() {
  const limit = 20;
  let offset = 0;
  const { body } = await spotifyApi.getMySavedTracks({ limit, offset });
  let { items, next, total } = body;
  while (next) {
    yield items;
    offset += limit;
    const { body: nextBody } = await spotifyApi.getMySavedTracks({
      limit,
      offset
    });
    items = nextBody.items;
    next = nextBody.next;
  }
  return body.items;
}

async function queueRequest(method: Function, key: string) {
  return queue.request(
    retry =>
      method()
        .then((data: any) => data)
        .catch((err: any) => {
          console.error(err);
          retry(err?.response?.data?.parameters?.retry_after || 3000);
        }),
    key
  );
}

async function* spotifyPaginator(method: Function) {
  const limit = 20;
  let offset = 0;
  const { body } = await queueRequest(
    () => method({ limit, offset }),
    '' + limit + offset
  );
  let { items, next, total } = body;
  while (next) {
    yield { items, total };
    offset += limit;
    const { body: nextBody } = await queueRequest(
      () => method({ limit, offset }),
      '' + limit + offset
    );
    items = nextBody.items;
    next = nextBody.next;
  }
  yield { items, total };
}

function getAll(
  paginator: AsyncGenerator<any, any, any>
): Observable<{ items: any[]; total?: number }> {
  return new Observable(subscriber => {
    (async () => {
      //TODO change to use SmartQueue
      for await (const items of paginator) {
        subscriber.next(items);
      }
      subscriber.complete();
    })();
  });
}

export function getTracks(): Observable<{ items: any[]; total?: number }> {
  return getAll(spotifyPaginator(spotifyApi.getMySavedTracks.bind(spotifyApi)));
}

const getAlbums = () => {
  return getAll(spotifyPaginator(spotifyApi.getMySavedAlbums.bind(spotifyApi)));
};

export function getPlaylists(): Observable<{ items: any[]; total?: number }> {
  return from(spotifyApi.getMe() as Promise<{ body: { id: string } }>).pipe(
    mergeMap(({ body }) => {
      return getAll(
        spotifyPaginator(spotifyApi.getUserPlaylists.bind(spotifyApi, body.id))
      );
    })
  );
}

// export function getPlaylists(): Observable<{ items: any[]; total?: number }> {
//   return from([{ items: [1, 2, 3], total: 6 }]).pipe(throttleTime(1000));
//   return from(spotifyApi.getMe() as Promise<{ body: { id: string } }>).pipe(
//     concatMap((resp: { body: { id: string } }) => {
//       const user = resp.body;
//       return getAll(
//         spotifyPaginator(spotifyApi.getUserPlaylists.bind(spotifyApi, user.id))
//       );
//     })
//   );

//   // .pipe(
//   //   mergeMap(({ items, total }) => {
//   //     return merge(
//   //       ...items.map(({ id }) => spotifyApi.getPlaylist(user.id, id))
//   //     );
//   //   })
//   // );
// }

type ResourceGetter = (options?: any) => Observable<any>;

type RateLimit = {
  rate: number;
  limit: number;
};

export interface iResource {
  scopes: string[];
  name: ResourceType;
  label: string;
  get: ResourceGetter;
  rateLimit?: RateLimit;
  options?: any;
  schema?: {};
}

enum ResourceType {
  tracks = 'tracks',
  albums = 'albums',
  playlists = 'playlists'
}

type AlbumType = 'album' | 'single' | 'compilation';

type ImageObjectType = {
  height: number;
  url: string;
  width: number;
};

type SimpleAlbumType = {
  album_group?: string;
  album_type: AlbumType;
  artists: SimpleArtistType[];
  available_markets: string[];
  external_urls: ExternalURLType;
  href: string;
  id: string;
  images: ImageObjectType[];
  name: string;
  release_date: string;
  release_date_precision: 'year' | 'month' | 'day';
  restrictions: Object;
  type: 'album';
  uri: string;
};
type SimpleArtistType = {
  external_urls: ExternalURLType;
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
};
type ExternalIDType = { [key: string]: string };
type ExternalURLType = { [key: string]: string };
type LinkedTrackType = {
  external_urls: ExternalURLType;
  href: string;
  id: string;
  type: 'track';
  uri: string;
};

type TrackDocType = {
  album: SimpleAlbumType;
  artists: SimpleArtistType;
  available_markets: string[];
  disk_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIDType;
  external_urls: ExternalURLType;
  href: string;
  id: string;
  is_playlable: boolean;
  linked_from: LinkedTrackType;
  restrictions: any;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: 'track';
  uri: string;
};

export const resources: { [key: string]: iResource } = {
  tracks: {
    name: ResourceType.tracks,
    label: 'Your saved tracks',
    scopes: ['user-library-read'],
    get: getTracks,
    schema: {
      title: 'Spotify Track',
      description: 'A song from Spotify',
      version: 0,
      type: 'object',
      properties: {
        album: {
          type: 'object',
          properties: {
            album_group: '',
            album_type: {
              enum: ['album', 'single', 'compilation']
            },
            artists: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  external_urls: { type: 'object' },
                  href: { type: 'string' },
                  id: { type: 'string' },
                  name: { type: 'string' },
                  type: { const: 'artist' },
                  uri: { type: 'string' }
                }
              }
            },
            available_markets: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            external_urls: { type: 'object' },
            href: { type: 'string' },
            id: { type: 'string' },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  height: { type: 'integer' },
                  url: { type: 'string' },
                  width: { type: 'integer' }
                }
              }
            },
            name: { type: 'string' },
            release_date: { type: 'string' },
            release_date_precision: {
              enum: ['year', 'month', 'day']
            },
            restrictions: {
              type: 'object'
            },
            type: { const: 'album' },
            uri: { type: 'string' }
          }
        },
        artists: {},
        available_markets: {},
        disk_number: {},
        duration_ms: {},
        explicit: {},
        external_ids: {},
        external_urls: {},
        href: {},
        id: {},
        is_playlable: {},
        linked_from: {},
        restrictions: {},
        name: {},
        popularity: {
          type: 'integer',
          min: 0,
          max: 100
        },
        preview_url: {},
        track_number: {},
        type: 'track',
        uri: {}
      },
      required: [
        'artists',
        'available_markets',
        'disk_number',
        'duration_ms',
        'explicit',
        'external_urls',
        'href',
        'id',
        'is_playlable',
        'linked_from',
        'restrictions',
        'name',
        'preview_url',
        'track_number',
        'type',
        'uri',
        'is_local'
      ]
    }
  },
  albums: {
    name: ResourceType.albums,
    label: 'Your saved albums',
    scopes: ['user-library-read'],
    get: getAlbums
  },
  playlists: {
    name: ResourceType.playlists,
    label: 'Your playlists',
    scopes: ['playlist-read-private'],
    get: getPlaylists
  }
};

export function getResource(name: string): iResource {
  return resources[name];
}
