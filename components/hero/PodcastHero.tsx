import Image from 'next/image';
import { FiArrowUpRight } from 'react-icons/fi';
import { SiSpotify, SiYoutube } from 'react-icons/si';

import styles from './PodcastHero.module.css';

const spotifyUrl =
  'https://open.spotify.com/show/4MlsSTgEjZAUKhd9SsQ5tp';

const youtubeUrl =
  'https://www.youtube.com/watch?v=Vns4Tet_GgI&list=PLK_VJTpEYo6XJkBQGDYTlYJr3IeUUROqk';

export default function PodcastHero() {
  return (
    <section id="inicio" className={styles.hero}>
      {/* Decoración de fondo */}
      <div
        className={styles.backgroundGlow}
        aria-hidden="true"
      />

      <div
        className={styles.backgroundRing}
        aria-hidden="true"
      />

      <div
        className={styles.backgroundRingInner}
        aria-hidden="true"
      />

      <div
        className={styles.backgroundArc}
        aria-hidden="true"
      />

      <span
        className={styles.decorativeDot}
        aria-hidden="true"
      />

      <span
        className={styles.decorativeDotSmall}
        aria-hidden="true"
      />

      <div className={styles.content}>

        {/* TELEFONO */}
        <div className={styles.visual}>
          <div
            className={styles.phoneDecoration}
            aria-hidden="true"
          />

          <div
            className={styles.phoneShadow}
            aria-hidden="true"
          />

          <div className={styles.phone}>

            {/* Botones laterales */}
            <span
              className={styles.volumeOne}
              aria-hidden="true"
            />

            <span
              className={styles.volumeTwo}
              aria-hidden="true"
            />

            <span
              className={styles.volumeThree}
              aria-hidden="true"
            />

            <span
              className={styles.powerButton}
              aria-hidden="true"
            />

            <div className={styles.phoneFrame}>
              <div className={styles.screen}>
                <Image
                  src="/images/podcast/hero/podcast-mobile.png"
                  alt="Tercer Espacio Podcast"
                  fill
                  priority
                  className={styles.screenImage}
                  sizes="
                    (max-width: 340px) 185px,
                    (max-width: 420px) 205px,
                    (max-width: 760px) 220px,
                    (max-width: 1100px) 300px,
                    365px
                  "
                />
              </div>
            </div>
          </div>
        </div>

        {/* TEXTO */}
        <div className={styles.copy}>

          <span className={styles.eyebrow}>
            PODCAST · INMOBILIARIA · CIUDAD
          </span>

          <h1>
            Conversaciones
            <br />
            que
            <em>construyen.</em>
          </h1>

          <p className={styles.description}>
            Historias, ideas y decisiones detrás
            del mundo inmobiliario, la arquitectura
            y las ciudades que estamos creando.
          </p>

          <div className={styles.platforms}>

            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.platformButton}
            >
              <span
                className={`${styles.platformIcon} ${styles.spotifyIcon}`}
                aria-hidden="true"
              >
                <SiSpotify />
              </span>

              <span>
                Escuchar en Spotify
              </span>

              <FiArrowUpRight
                className={styles.buttonArrow}
                aria-hidden="true"
              />
            </a>

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.platformButton}
            >
              <span
                className={`${styles.platformIcon} ${styles.youtubeIcon}`}
                aria-hidden="true"
              >
                <SiYoutube />
              </span>

              <span>
                Ver en YouTube
              </span>

              <FiArrowUpRight
                className={styles.buttonArrow}
                aria-hidden="true"
              />
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}