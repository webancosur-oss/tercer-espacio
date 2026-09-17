import Parser from 'rss-parser';
import { FiArrowUpRight } from 'react-icons/fi';

import styles from './EpisodeList.module.css';

type PodcastItem = {
  title?: string;
  description?: string;
  content?: string;
  pubDate?: string;
  isoDate?: string;
  guid?: string;
  link?: string;

  enclosure?: {
    url?: string;
    type?: string;
    length?: string;
  };

  'itunes:duration'?: string;
  'itunes:episode'?: string;
  'itunes:season'?: string;
  'itunes:episodeType'?: string;

  'itunes:image'?: {
    href?: string;
  };
};

type PodcastFeed = {
  title?: string;
  description?: string;

  image?: {
    url?: string;
    title?: string;
    link?: string;
  };

  items: PodcastItem[];
};

const RSS_URL =
  process.env.PODCAST_RSS_URL;

const SPOTIFY_SHOW_URL =
  'https://open.spotify.com/show/4MlsSTgEjZAUKhd9SsQ5tp';

const parser =
  new Parser<PodcastFeed>({
    customFields: {
      item: [
        [
          'itunes:image',
          'itunes:image',
        ],
        [
          'itunes:duration',
          'itunes:duration',
        ],
        [
          'itunes:episode',
          'itunes:episode',
        ],
        [
          'itunes:season',
          'itunes:season',
        ],
        [
          'itunes:episodeType',
          'itunes:episodeType',
        ],
      ],
    },
  });

/* =========================================================
   LIMPIAR URL
========================================================= */

function cleanImageUrl(
  value?: string | null,
) {
  if (!value) {
    return null;
  }

  let url = value.trim();

  if (!url) {
    return null;
  }

  /*
   * Convierte URLs como:
   *
   * //example.com/image.jpg
   *
   * en:
   *
   * https://example.com/image.jpg
   */

  if (url.startsWith('//')) {
    url = `https:${url}`;
  }

  /*
   * Decodificar entidades HTML.
   */

  url = url
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return url;
}

/* =========================================================
   EXTRAER IMAGEN DEL XML
========================================================= */

function extractImageFromXml(
  xml: string,
) {
  /*
   * 1. iTunes image
   *
   * <itunes:image href="..." />
   */

  const itunesMatches = [
    /<itunes:image\b[^>]*\bhref=["']([^"']+)["'][^>]*\/?>/i,

    /<itunes:image\b[^>]*\burl=["']([^"']+)["'][^>]*\/?>/i,

    /<itunes:image\b[^>]*>([^<]+)<\/itunes:image>/i,
  ];

  for (const regex of itunesMatches) {
    const match =
      xml.match(regex);

    if (match?.[1]) {
      const url =
        cleanImageUrl(
          match[1],
        );

      if (url) {
        return url;
      }
    }
  }

  /*
   * 2. media:content
   */

  const mediaContent =
    xml.match(
      /<media:content\b[^>]*\burl=["']([^"']+)["'][^>]*\/?>/i,
    );

  if (mediaContent?.[1]) {
    const url =
      cleanImageUrl(
        mediaContent[1],
      );

    if (url) {
      return url;
    }
  }

  /*
   * 3. media:thumbnail
   */

  const mediaThumbnail =
    xml.match(
      /<media:thumbnail\b[^>]*\burl=["']([^"']+)["'][^>]*\/?>/i,
    );

  if (mediaThumbnail?.[1]) {
    const url =
      cleanImageUrl(
        mediaThumbnail[1],
      );

    if (url) {
      return url;
    }
  }

  /*
   * 4. RSS image tradicional
   *
   * <image>
   *   <url>...</url>
   * </image>
   */

  const rssImage =
    xml.match(
      /<image\b[^>]*>[\s\S]*?<url>\s*([^<]+)\s*<\/url>[\s\S]*?<\/image>/i,
    );

  if (rssImage?.[1]) {
    const url =
      cleanImageUrl(
        rssImage[1],
      );

    if (url) {
      return url;
    }
  }

  return null;
}

/* =========================================================
   EXTRAER IMAGEN DE UN ITEM
========================================================= */

function extractEpisodeImage(
  itemXml: string,
) {
  /*
   * iTunes
   */

  const itunes =
    itemXml.match(
      /<itunes:image\b[^>]*\bhref=["']([^"']+)["'][^>]*\/?>/i,
    );

  if (itunes?.[1]) {
    return cleanImageUrl(
      itunes[1],
    );
  }

  /*
   * Media content
   */

  const media =
    itemXml.match(
      /<media:content\b[^>]*\burl=["']([^"']+)["'][^>]*\/?>/i,
    );

  if (media?.[1]) {
    return cleanImageUrl(
      media[1],
    );
  }

  /*
   * Media thumbnail
   */

  const thumbnail =
    itemXml.match(
      /<media:thumbnail\b[^>]*\burl=["']([^"']+)["'][^>]*\/?>/i,
    );

  if (thumbnail?.[1]) {
    return cleanImageUrl(
      thumbnail[1],
    );
  }

  return null;
}

/* =========================================================
   OBTENER RSS
========================================================= */

async function getPodcastData() {
  if (!RSS_URL) {
    throw new Error(
      'FALTA PODCAST_RSS_URL EN .env.local',
    );
  }

  const response =
    await fetch(
      RSS_URL,
      {
        next: {
          revalidate: 300,
        },

        headers: {
          Accept:
            'application/rss+xml, application/xml, text/xml',
        },
      },
    );

  if (!response.ok) {
    throw new Error(
      `RSS ERROR: ${response.status} ${response.statusText}`,
    );
  }

  const xml =
    await response.text();

  if (!xml) {
    throw new Error(
      'El RSS devolvió una respuesta vacía.',
    );
  }

  const feed =
    await parser.parseString(
      xml,
    );

  /*
   * Imagen general del podcast
   */

  const podcastImage =
    extractImageFromXml(
      xml,
    );

  /*
   * Extraemos cada <item>
   * del XML original para buscar
   * su imagen específica.
   */

  const itemMatches =
    xml.match(
      /<item\b[\s\S]*?<\/item>/gi,
    ) ?? [];

  const episodeImages =
    itemMatches.map(
      (itemXml) =>
        extractEpisodeImage(
          itemXml,
        ),
    );

  return {
    feed,
    podcastImage,
    episodeImages,
  };
}

/* =========================================================
   DURACIÓN
========================================================= */

function formatDuration(
  duration?: string,
) {
  if (!duration) {
    return null;
  }

  const value =
    duration.trim();

  if (
    value.includes(':')
  ) {
    const parts =
      value
        .split(':')
        .map(Number);

    if (
      parts.length === 3
    ) {
      const [
        hours,
        minutes,
      ] = parts;

      if (hours > 0) {
        return `${hours} h ${String(
          minutes,
        ).padStart(
          2,
          '0',
        )} min`;
      }

      return `${minutes} min`;
    }

    if (
      parts.length === 2
    ) {
      const [
        minutes,
      ] = parts;

      return `${minutes} min`;
    }
  }

  const seconds =
    Number(value);

  if (
    !Number.isNaN(
      seconds,
    )
  ) {
    const totalMinutes =
      Math.floor(
        seconds / 60,
      );

    const hours =
      Math.floor(
        totalMinutes / 60,
      );

    const minutes =
      totalMinutes % 60;

    if (hours > 0) {
      return `${hours} h ${String(
        minutes,
      ).padStart(
        2,
        '0',
      )} min`;
    }

    return `${minutes} min`;
  }

  return value;
}

/* =========================================================
   FECHA
========================================================= */

function formatDate(
  date?: string,
) {
  if (!date) {
    return '';
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
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
    .replace(
      '.',
      '',
    )
    .toUpperCase();
}

/* =========================================================
   CATEGORÍA
========================================================= */

function getCategory(
  episode: PodcastItem,
) {
  const text =
    `${episode.title ?? ''} ${
      episode.description ?? ''
    }`
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        '',
      );

  if (
    text.includes('inversion') ||
    text.includes('invertir') ||
    text.includes('propiedad') ||
    text.includes('inmobili')
  ) {
    return 'INVERSIÓN';
  }

  if (
    text.includes('arquitectura') ||
    text.includes('arquitecto') ||
    text.includes('diseno')
  ) {
    return 'ARQUITECTURA';
  }

  if (
    text.includes('ciudad') ||
    text.includes('urbano') ||
    text.includes('urbanismo')
  ) {
    return 'CIUDAD';
  }

  if (
    text.includes('negocio') ||
    text.includes('empresa') ||
    text.includes('empresarial') ||
    text.includes('emprend')
  ) {
    return 'NEGOCIOS';
  }

  if (
    text.includes('construccion') ||
    text.includes('construir')
  ) {
    return 'CONSTRUCCIÓN';
  }

  return 'TERCER ESPACIO';
}

/* =========================================================
   LIMPIAR DESCRIPCIÓN
========================================================= */

function cleanDescription(
  description?: string,
) {
  if (!description) {
    return '';
  }

  return description
    .replace(
      /<[^>]*>/g,
      '',
    )
    .replace(
      /&nbsp;/g,
      ' ',
    )
    .replace(
      /&amp;/g,
      '&',
    )
    .replace(
      /&quot;/g,
      '"',
    )
    .replace(
      /&#39;/g,
      "'",
    )
    .trim();
}

/* =========================================================
   URL EPISODIO
========================================================= */

function getEpisodeUrl(
  episode: PodcastItem,
) {
  return (
    episode.link ??
    SPOTIFY_SHOW_URL
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

export default async function EpisodeList() {
  const {
    feed,
    podcastImage,
    episodeImages,
  } =
    await getPodcastData();

  const episodes =
    feed.items ?? [];

  return (
    <section
      id="episodios"
      className={styles.section}
    >
      <div
        className={
          styles.container
        }
      >

        {/* HEADER */}

        <div
          className={
            styles.header
          }
        >
          <div
            className={
              styles.heading
            }
          >
            <span
              className={
                styles.eyebrow
              }
            >
              EPISODIOS
            </span>

            <h2>
              Todas las
              <br />
              <span>
                conversaciones.
              </span>
            </h2>
          </div>

          <p>
            Explora las conversaciones de
            Tercer Espacio sobre inversión,
            inmobiliaria, arquitectura,
            negocios y ciudad.
          </p>
        </div>

        {/* GRID */}

        {episodes.length > 0 ? (
          <div
            className={
              styles.grid
            }
          >
            {episodes.map(
              (
                episode,
                index,
              ) => {
                const title =
                  episode.title ??
                  'Episodio sin título';

                const description =
                  cleanDescription(
                    episode.description ??
                      episode.content,
                  );

                /*
                 * Imagen específica del episodio.
                 *
                 * Si no existe, usamos
                 * la portada general.
                 */

                const image =
                  episodeImages[index] ??
                  podcastImage;

                const episodeUrl =
                  getEpisodeUrl(
                    episode,
                  );

                const duration =
                  formatDuration(
                    episode[
                      'itunes:duration'
                    ],
                  );

                const date =
                  formatDate(
                    episode.isoDate ??
                      episode.pubDate,
                  );

                const episodeNumber =
                  episode[
                    'itunes:episode'
                  ] ??
                  String(
                    episodes.length -
                      index,
                  ).padStart(
                    2,
                    '0',
                  );

                return (
                  <article
                    key={
                      episode.guid ??
                      `${title}-${index}`
                    }
                    className={
                      styles.card
                    }
                  >

                    {/* COVER */}

                    <a
                      href={
                        episodeUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        styles.cover
                      }
                      aria-label={`Escuchar ${title}`}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={title}
                          className={
                            styles.coverImage
                          }
                          loading={
                            index < 3
                              ? 'eager'
                              : 'lazy'
                          }
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div
                          className={
                            styles.coverFallback
                          }
                        >
                          <span>
                            TERCER
                          </span>

                          <strong>
                            ESPACIO
                          </strong>
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
                        {String(
                          episodeNumber,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <span
                        className={
                          styles.coverPlay
                        }
                        aria-hidden="true"
                      >
                        <FiArrowUpRight />
                      </span>
                    </a>

                    {/* CONTENT */}

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
                          {date}
                        </span>

                        {duration && (
                          <span>
                            {duration}
                          </span>
                        )}
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
                        {title}
                      </h3>

                      {description && (
                        <p>
                          {
                            description
                          }
                        </p>
                      )}

                      <a
                        href={
                          episodeUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          styles.listen
                        }
                      >
                        <span>
                          Escuchar episodio
                        </span>

                        <FiArrowUpRight
                          className={
                            styles.listenIcon
                          }
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        ) : (
          <div
            className={
              styles.empty
            }
          >
            <span>
              TERCER ESPACIO
            </span>

            <h3>
              Aún no hay episodios.
            </h3>

            <p>
              No encontramos episodios
              publicados en el feed RSS.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}