import Parser from 'rss-parser';

import styles from './EpisodeList.module.css';
import EpisodeCarousel from './EpisodeCarousel';

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

  'itunes:image'?: {
    href?: string;
  };

  'itunes:duration'?: string;
  'itunes:episode'?: string;
  'itunes:season'?: string;
};

type PodcastFeed = {
  title?: string;
  description?: string;

  image?: {
    url?: string;
  };

  items: PodcastItem[];
};

/* =========================================================
   RSS DEL PODCAST
   ========================================================= */

const RSS_URL =
  'https://anchor.fm/s/10899deec/podcast/rss';

const SPOTIFY_URL =
  'https://open.spotify.com/show/4MlsSTgEjZAUKhd9SsQ5tp';

/* =========================================================
   PARSER RSS
   ========================================================= */

const parser = new Parser<PodcastFeed>({
  customFields: {
    item: [
      ['itunes:image', 'itunes:image'],
      ['itunes:duration', 'itunes:duration'],
      ['itunes:episode', 'itunes:episode'],
      ['itunes:season', 'itunes:season'],
    ],
  },
});

/* =========================================================
   LIMPIAR URL
   ========================================================= */

function cleanUrl(
  value?: string | null,
): string | null {
  if (!value) {
    return null;
  }

  let url = value.trim();

  if (!url) {
    return null;
  }

  if (url.startsWith('//')) {
    url = `https:${url}`;
  }

  return url
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/* =========================================================
   EXTRAER IMAGEN DEL XML
   ========================================================= */

function extractPodcastImage(
  xml: string,
): string | null {
  /*
   * iTunes image
   */
  const itunesImage = xml.match(
    /<itunes:image\b[^>]*\bhref=["']([^"']+)["'][^>]*\/?>/i,
  );

  if (itunesImage?.[1]) {
    return cleanUrl(itunesImage[1]);
  }

  /*
   * RSS image
   */
  const rssImage = xml.match(
    /<image\b[^>]*>[\s\S]*?<url>\s*([^<]+?)\s*<\/url>[\s\S]*?<\/image>/i,
  );

  if (rssImage?.[1]) {
    return cleanUrl(rssImage[1]);
  }

  /*
   * media:content
   */
  const mediaContent = xml.match(
    /<media:content\b[^>]*\burl=["']([^"']+)["'][^>]*\/?>/i,
  );

  if (mediaContent?.[1]) {
    return cleanUrl(mediaContent[1]);
  }

  return null;
}

/* =========================================================
   OBTENER IMÁGENES DE CADA EPISODIO
   ========================================================= */

function extractEpisodeImages(
  xml: string,
): (string | null)[] {
  const itemXml =
    xml.match(
      /<item\b[\s\S]*?<\/item>/gi,
    ) ?? [];

  return itemXml.map((item) => {
    /*
     * iTunes image
     */
    const image = item.match(
      /<itunes:image\b[^>]*\bhref=["']([^"']+)["'][^>]*\/?>/i,
    );

    if (image?.[1]) {
      return cleanUrl(image[1]);
    }

    /*
     * media:content
     */
    const media = item.match(
      /<media:content\b[^>]*\burl=["']([^"']+)["'][^>]*\/?>/i,
    );

    if (media?.[1]) {
      return cleanUrl(media[1]);
    }

    /*
     * media:thumbnail
     */
    const thumbnail = item.match(
      /<media:thumbnail\b[^>]*\burl=["']([^"']+)["'][^>]*\/?>/i,
    );

    if (thumbnail?.[1]) {
      return cleanUrl(thumbnail[1]);
    }

    return null;
  });
}

/* =========================================================
   OBTENER PODCAST
   ========================================================= */

async function getPodcast() {
  const response = await fetch(RSS_URL, {
    next: {
      revalidate: 300,
    },

    headers: {
      Accept:
        'application/rss+xml, application/xml, text/xml',
    },
  });

  if (!response.ok) {
    throw new Error(
      `RSS ERROR: ${response.status} ${response.statusText}`,
    );
  }

  const xml = await response.text();

  if (!xml) {
    throw new Error(
      'El RSS devolvió una respuesta vacía.',
    );
  }

  const feed = await parser.parseString(xml);

  const podcastImage =
    extractPodcastImage(xml);

  const episodeImages =
    extractEpisodeImages(xml);

  return {
    feed,
    podcastImage,
    episodeImages,
  };
}

/* =========================================================
   LIMPIAR DESCRIPCIÓN
   ========================================================= */

function cleanDescription(
  description?: string,
): string {
  if (!description) {
    return '';
  }

  return description
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/* =========================================================
   PREPARAR EPISODIOS
   ========================================================= */

function prepareEpisodes(
  feed: PodcastFeed,
  podcastImage: string | null,
  episodeImages: (string | null)[],
) {
  return feed.items.map(
    (episode, index) => {
      const episodeImage =
        episodeImages[index];

      const image =
        episodeImage ??
        episode['itunes:image']?.href ??
        podcastImage ??
        feed.image?.url ??
        null;

      return {
        id:
          episode.guid ??
          `${episode.title ?? 'episodio'}-${index}`,

        title:
          episode.title ??
          'Episodio sin título',

        description:
          cleanDescription(
            episode.description ??
              episode.content,
          ),

        date:
          episode.isoDate ??
          episode.pubDate ??
          '',

        duration:
          episode['itunes:duration'] ??
          '',

        episodeNumber:
          episode['itunes:episode'] ??
          String(
            feed.items.length - index,
          ),

        image,

        url:
          episode.link ??
          SPOTIFY_URL,
      };
    },
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
  } = await getPodcast();

  const episodes =
    prepareEpisodes(
      feed,
      podcastImage,
      episodeImages,
    );

  return (
    <section
      id="episodios"
      className={styles.section}
    >
      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.heading}>
            <span
              className={styles.eyebrow}
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

        {/* EPISODIOS */}
        {episodes.length > 0 ? (
          <EpisodeCarousel
            episodes={episodes}
          />
        ) : (
          <div
            className={styles.empty}
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