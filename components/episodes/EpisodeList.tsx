import styles from './EpisodeList.module.css';

type SpotifyEpisode = {
  id: string;
  name: string;
  description: string;
  duration_ms: number;
  release_date: string;
  images?: {
    url: string;
    width: number;
    height: number;
  }[];
  external_urls?: {
    spotify?: string;
  };
};

type SpotifyEpisodesResponse = {
  items: SpotifyEpisode[];
  next: string | null;
};

const SPOTIFY_SHOW_ID = '4MlsSTgEjZAUKhd9SsQ5tp';

async function getSpotifyToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  const credentials = Buffer.from(
    `${clientId}:${clientSecret}`,
  ).toString('base64');

  const response = await fetch(
    'https://accounts.spotify.com/api/token',
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type':
          'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return data.access_token as string;
}


async function getAllEpisodes(): Promise<SpotifyEpisode[]> {
  const token = await getSpotifyToken();

  if (!token) {
    return [];
  }

  const episodes: SpotifyEpisode[] = [];

  let nextUrl =
    `https://api.spotify.com/v1/shows/${SPOTIFY_SHOW_ID}/episodes` +
    '?limit=50&market=PE';

  while (nextUrl) {
    const response = await fetch(
      nextUrl,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      break;
    }

    const data =
      (await response.json()) as SpotifyEpisodesResponse;

    episodes.push(
      ...data.items,
    );

    nextUrl = data.next ?? '';
  }

  return episodes;
}


function formatDuration(
  durationMs: number,
) {
  const totalMinutes = Math.floor(
    durationMs / 60000,
  );

  const hours = Math.floor(
    totalMinutes / 60,
  );

  const minutes =
    totalMinutes % 60;

  if (hours > 0) {
    return `${hours} h ${minutes
      .toString()
      .padStart(2, '0')} min`;
  }

  return `${minutes} min`;
}


function formatDate(
  date: string,
) {
  const parsedDate = new Date(
    `${date}T12:00:00`,
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat(
    'es-PE',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  )
    .format(parsedDate)
    .replace('.', '')
    .toUpperCase();
}


function getCategory(
  episode: SpotifyEpisode,
) {
  const text =
    `${episode.name} ${episode.description}`
      .toLowerCase();

  if (
    text.includes('inversión') ||
    text.includes('invertir') ||
    text.includes('propiedad')
  ) {
    return 'INVERSIÓN';
  }

  if (
    text.includes('arquitectura') ||
    text.includes('diseño')
  ) {
    return 'ARQUITECTURA';
  }

  if (
    text.includes('ciudad') ||
    text.includes('urbano') ||
    text.includes('urban')
  ) {
    return 'CIUDAD';
  }

  if (
    text.includes('negocio') ||
    text.includes('empresa') ||
    text.includes('empresarial')
  ) {
    return 'NEGOCIOS';
  }

  return 'TERCER ESPACIO';
}


export default async function EpisodeList() {
  const episodes =
    await getAllEpisodes();

  return (
    <section
      id="episodios"
      className={styles.section}
    >
      <div className={styles.container}>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className={styles.header}>

          <div className={styles.heading}>

            <span className={styles.eyebrow}>
              EPISODIOS
            </span>

            <h2>
              Todas las
              <br />
              <span>conversaciones.</span>
            </h2>

          </div>

          <p>
            Explora las conversaciones de
            Tercer Espacio sobre inversión,
            inmobiliaria, arquitectura,
            negocios y ciudad.
          </p>

        </div>


        {/* =================================================
            EPISODES
        ================================================= */}

        {episodes.length > 0 ? (

          <div className={styles.grid}>

            {episodes.map(
              (
                episode,
                index,
              ) => {

                const image =
                  episode.images?.[0]?.url;

                const spotifyUrl =
                  episode.external_urls?.spotify ??
                  `https://open.spotify.com/episode/${episode.id}`;

                return (
                  <article
                    key={episode.id}
                    className={styles.card}
                  >

                    {/* ======================================
                        IMAGE
                    ====================================== */}

                    <a
                      href={spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.cover}
                    >

                      {image ? (
                        <img
                          src={image}
                          alt=""
                          loading={
                            index < 3
                              ? 'eager'
                              : 'lazy'
                          }
                        />
                      ) : (
                        <div
                          className={
                            styles.coverFallback
                          }
                        >
                          TERCER
                          <br />
                          ESPACIO
                        </div>
                      )}

                      <div
                        className={
                          styles.coverOverlay
                        }
                      />

                      <span
                        className={
                          styles.coverLabel
                        }
                      >
                        EP.{' '}
                        {String(index + 1).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <span
                        className={
                          styles.coverPlay
                        }
                      >
                        ↗
                      </span>

                    </a>


                    {/* ======================================
                        CONTENT
                    ====================================== */}

                    <div
                      className={
                        styles.cardContent
                      }
                    >

                      <div
                        className={
                          styles.meta
                        }
                      >

                        <span>
                          {formatDate(
                            episode.release_date,
                          )}
                        </span>

                        <span>
                          {formatDuration(
                            episode.duration_ms,
                          )}
                        </span>

                      </div>


                      <span
                        className={
                          styles.category
                        }
                      >
                        {getCategory(
                          episode,
                        )}
                      </span>


                      <h3>
                        {episode.name}
                      </h3>


                      {episode.description && (
                        <p>
                          {episode.description}
                        </p>
                      )}


                      <a
                        href={spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          styles.listen
                        }
                      >
                        Escuchar episodio

                        <span>
                          ↗
                        </span>
                      </a>

                    </div>

                  </article>
                );
              },
            )}

          </div>

        ) : (

          /* ================================================
             EMPTY / CONFIGURATION
          ================================================= */

          <div
            className={
              styles.empty
            }
          >
            <span>
              TERCER ESPACIO
            </span>

            <h3>
              Los episodios aparecerán aquí.
            </h3>

            <p>
              Conecta las credenciales de Spotify
              para cargar automáticamente el
              contenido del podcast.
            </p>
          </div>

        )}

      </div>
    </section>
  );
}