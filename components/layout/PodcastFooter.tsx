import Image from 'next/image';

import {
  FiArrowUp,
  FiArrowUpRight,
} from 'react-icons/fi';

import {
  SiSpotify,
  SiYoutube,
} from 'react-icons/si';

import { FaWhatsapp } from 'react-icons/fa';

import styles from './PodcastFooter.module.css';

const spotifyUrl =
  'https://open.spotify.com/show/4MlsSTgEjZAUKhd9SsQ5tp';

const youtubeUrl =
  'https://www.youtube.com/playlist?list=PLK_VJTpEYo6XJkBQGDYTlYJr3IeUUROqk';

const whatsappUrl =
  'https://wa.me/51971069763?text=Hola%20Tercer%20Espacio%2C%20quiero%20más%20información.';

export default function PodcastFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* =================================================
            TOP
        ================================================= */}

        <div className={styles.top}>

          {/* BRAND */}

          <div className={styles.brandBlock}>
            <a
              href="#inicio"
              className={styles.brand}
              aria-label="Tercer Espacio - Inicio"
            >
              <Image
                src="/images/podcast/logo.svg"
                alt="Tercer Espacio Podcast"
                width={180}
                height={52}
                className={styles.logo}
              />
            </a>

            <p className={styles.description}>
              Conversaciones sobre inmobiliaria,
              inversión, arquitectura y las
              ciudades que estamos construyendo.
            </p>
          </div>

          {/* NAVEGACIÓN */}

          <div className={styles.column}>
            <span className={styles.label}>
              EXPLORA
            </span>

            <nav
              className={styles.links}
              aria-label="Navegación del footer"
            >
              <a href="#inicio">
                Inicio
              </a>

              <a href="#episodios">
                Episodios
              </a>

              <a href="#escuchar">
                Escuchar
              </a>
            </nav>
          </div>

          {/* CANALES */}

          <div className={styles.column}>
            <span className={styles.label}>
              ESCUCHA
            </span>

            <div className={styles.platforms}>

              <a
                href={spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.platform}
                aria-label="Escuchar Tercer Espacio en Spotify"
              >
                <span className={styles.platformIcon}>
                  <SiSpotify />
                </span>

                <span className={styles.platformText}>
                  Spotify
                </span>

                <FiArrowUpRight
                  className={styles.platformArrow}
                />
              </a>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.platform}
                aria-label="Escuchar Tercer Espacio en YouTube"
              >
                <span className={styles.platformIcon}>
                  <SiYoutube />
                </span>

                <span className={styles.platformText}>
                  YouTube
                </span>

                <FiArrowUpRight
                  className={styles.platformArrow}
                />
              </a>

            </div>
          </div>

          {/* CONTACTO */}

          <div className={styles.column}>
            <span className={styles.label}>
              CONTACTO
            </span>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsapp}
              aria-label="Contactar por WhatsApp"
            >
              <span className={styles.whatsappIcon}>
                <FaWhatsapp />
              </span>

              <span>
                Hablemos
              </span>

              <FiArrowUpRight />
            </a>
          </div>

        </div>

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className={styles.bottom}>

          <span className={styles.copy}>
            © 2026 Tercer Espacio Podcast
          </span>

          <span className={styles.bottomText}>
            Un espacio para conversar sobre
            ciudad, inversión y futuro.
          </span>

          <a
            href="#inicio"
            className={styles.backTop}
            aria-label="Volver al inicio"
          >
            <span className={styles.backTopIcon}>
              <FiArrowUp />
            </span>

            <span>
              Volver arriba
            </span>
          </a>

        </div>

      </div>
    </footer>
  );
}