import { FiArrowUpRight } from 'react-icons/fi';
import { SiSpotify } from 'react-icons/si';

import styles from './FeaturedEpisode.module.css';

const spotifyEmbedUrl =
  'https://open.spotify.com/embed/episode/4353PBdKvMf4Ksns6vaiQt/video?utm_source=generator';

const spotifyEpisodeUrl =
  'https://open.spotify.com/episode/4353PBdKvMf4Ksns6vaiQt';

export default function FeaturedEpisode() {
  return (
    <section
      id="episodio-destacado"
      className={styles.section}
    >
      <div className={styles.container}>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className={styles.intro}>

          <span className={styles.eyebrow}>
            EPISODIO DESTACADO
          </span>

          <h2>
            Una conversación
            <br />
            <span>para escuchar.</span>
          </h2>

        </div>


        {/* =================================================
            FEATURED GRID
        ================================================= */}

        <div className={styles.featured}>

          {/* =================================================
              SPOTIFY PLAYER
          ================================================= */}

          <div className={styles.playerWrapper}>

            <div className={styles.playerFrame}>

              <iframe
                src={spotifyEmbedUrl}
                title="Tercer Espacio — Episodio 01"
                frameBorder="0"
                allow="
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  fullscreen;
                  picture-in-picture
                "
                allowFullScreen
                loading="lazy"
              />

            </div>

          </div>


          {/* =================================================
              EPISODE INFORMATION
          ================================================= */}

          <div className={styles.info}>

            <div className={styles.meta}>

              <span>
                EP. 01
              </span>

              <span>
                TERCER ESPACIO
              </span>

            </div>


            <h3>
              El valor de una propiedad
            </h3>


            <p>
              Una conversación para entender qué hace
              realmente valiosa una propiedad y cómo la
              ubicación, el crecimiento urbano y las
              decisiones detrás de una ciudad pueden
              transformar su valor.
            </p>


            {/* =================================================
                ACTION
            ================================================= */}

            <div className={styles.actions}>

              <a
                href={spotifyEpisodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.spotifyButton}
              >

                <span
                  className={styles.spotifyIcon}
                  aria-hidden="true"
                >
                  <SiSpotify />
                </span>

                <span className={styles.buttonText}>
                  Escuchar en Spotify
                </span>

                <FiArrowUpRight
                  className={styles.arrow}
                  aria-hidden="true"
                />

              </a>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}