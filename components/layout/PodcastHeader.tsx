'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { SiSpotify, SiYoutube } from 'react-icons/si';

import styles from './PodcastHeader.module.css';

const spotifyUrl =
  'https://open.spotify.com/show/4MlsSTgEjZAUKhd9SsQ5tp';

const youtubeUrl =
  'https://www.youtube.com/watch?v=Vns4Tet_GgI&list=PLK_VJTpEYo6XJkBQGDYTlYJr3IeUUROqk';

const whatsappUrl =
  'https://wa.me/51971069763?text=Hola%20Tercer%20Espacio%2C%20quiero%20más%20información.';

export default function PodcastHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((value) => !value);
  };

  return (
    <header
      className={`${styles.header} ${
        menuOpen ? styles.headerOpen : ''
      }`}
    >
      <div className={styles.container}>

        {/* LOGO */}

        <a
          href="#inicio"
          className={styles.logo}
          onClick={closeMenu}
          aria-label="Tercer Espacio - Inicio"
        >
          <Image
            src="/images/podcast/logo.svg"
            alt="Tercer Espacio Podcast"
            width={180}
            height={52}
            priority
            className={styles.logoImage}
          />
        </a>

        {/* NAVEGACIÓN DESKTOP */}

        <nav
          className={styles.desktopNav}
          aria-label="Navegación principal"
        >
          <a
            href="#episodios"
            onClick={closeMenu}
          >
            Episodios
          </a>
        </nav>

        {/* ACCIONES DESKTOP */}

        <div className={styles.actions}>

          {/* SPOTIFY */}

          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.platform}
            aria-label="Escuchar en Spotify"
            title="Spotify"
          >
            <SiSpotify aria-hidden="true" />
          </a>

          {/* YOUTUBE */}

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.platform}
            aria-label="Ver en YouTube"
            title="YouTube"
          >
            <SiYoutube aria-hidden="true" />
          </a>

          {/* WHATSAPP DESKTOP */}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactButton}
            aria-label="Contáctanos por WhatsApp"
          >
            <FaWhatsapp aria-hidden="true" />

            <span>
              Contáctanos
            </span>
          </a>

        </div>

        {/* ACCIONES MOBILE */}

        <div className={styles.mobileActions}>

          {/* WHATSAPP SOLO ICONO */}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileWhatsapp}
            aria-label="Contáctanos por WhatsApp"
            title="WhatsApp"
          >
            <FaWhatsapp aria-hidden="true" />
          </a>

          {/* MENU */}

          <button
            type="button"
            className={`${styles.menuButton} ${
              menuOpen
                ? styles.menuOpen
                : ''
            }`}
            onClick={toggleMenu}
            aria-label={
              menuOpen
                ? 'Cerrar menú'
                : 'Abrir menú'
            }
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>

        </div>
      </div>

      {/* MENU MOBILE */}

      <div
        className={`${styles.mobileMenu} ${
          menuOpen
            ? styles.mobileMenuOpen
            : ''
        }`}
      >
        <nav
          className={styles.mobileNav}
          aria-label="Navegación móvil"
        >
          <a
            href="#inicio"
            onClick={closeMenu}
          >
            Inicio
          </a>

          <a
            href="#episodios"
            onClick={closeMenu}
          >
            Episodios
          </a>

          <a
            href="#escuchar"
            onClick={closeMenu}
          >
            Escuchar
          </a>
        </nav>
      </div>
    </header>
  );
}