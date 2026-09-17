'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
} from 'react-icons/fi';

import styles from './EpisodeCarousel.module.css';

type Episode = {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  episodeNumber: string;
  image: string | null;
  url: string;
};

type Props = {
  episodes: Episode[];
};

const GAP = 18;
const SWIPE_THRESHOLD = 50;

/* =========================================================
   FECHA
========================================================= */

function formatDate(date: string) {
  if (!date) {
    return '';
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(parsed)
    .replace('.', '')
    .toUpperCase();
}

/* =========================================================
   DURACIÓN
========================================================= */

function formatDuration(duration: string) {
  if (!duration) {
    return '';
  }

  const value = duration.trim();

  if (value.includes(':')) {
    const parts = value.split(':').map(Number);

    if (parts.length === 3) {
      const [hours, minutes] = parts;

      if (hours > 0) {
        return `${hours} h ${String(minutes).padStart(
          2,
          '0',
        )} min`;
      }

      return `${minutes} min`;
    }

    if (parts.length === 2) {
      return `${parts[0]} min`;
    }
  }

  const seconds = Number(value);

  if (!Number.isNaN(seconds)) {
    return `${Math.floor(seconds / 60)} min`;
  }

  return value;
}

/* =========================================================
   CATEGORÍA
========================================================= */

function getCategory(episode: Episode) {
  const text = `${episode.title} ${episode.description}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

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
   COMPONENTE
========================================================= */

export default function EpisodeCarousel({
  episodes,
}: Props) {
  const viewportRef =
    useRef<HTMLDivElement>(null);

  const trackRef =
    useRef<HTMLDivElement>(null);

  /* =======================================================
     ESTADOS
  ======================================================= */

  const [visibleCards, setVisibleCards] =
    useState(4);

  const [currentIndex, setCurrentIndex] =
    useState(episodes.length);

  const [cardStep, setCardStep] =
    useState(0);

  const [isTransitioning, setIsTransitioning] =
    useState(true);

  const [dragX, setDragX] =
    useState(0);

  const [isDragging, setIsDragging] =
    useState(false);

  /* =======================================================
     REFS SWIPE
  ======================================================= */

  const touchStartX =
    useRef<number | null>(null);

  const touchStartY =
    useRef<number | null>(null);

  const lastTouchX =
    useRef<number | null>(null);

  const isHorizontalSwipe =
    useRef(false);

  const isResetting =
    useRef(false);

  /* =======================================================
     RESPONSIVE
  ======================================================= */

  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;

      if (width <= 600) {
        setVisibleCards(1);
        return;
      }

      if (width <= 900) {
        setVisibleCards(2);
        return;
      }

      if (width <= 1200) {
        setVisibleCards(3);
        return;
      }

      setVisibleCards(4);
    };

    updateVisibleCards();

    window.addEventListener(
      'resize',
      updateVisibleCards,
    );

    return () => {
      window.removeEventListener(
        'resize',
        updateVisibleCards,
      );
    };
  }, []);

  /* =======================================================
     MEDIR TARJETA
  ======================================================= */

  useEffect(() => {
    const calculateStep = () => {
      const viewport =
        viewportRef.current;

      if (!viewport) {
        return;
      }

      const firstCard =
        viewport.querySelector(
          `.${styles.card}`,
        ) as HTMLElement | null;

      if (!firstCard) {
        return;
      }

      const width =
        firstCard.getBoundingClientRect()
          .width;

      if (!width) {
        return;
      }

      setCardStep(width + GAP);
    };

    calculateStep();

    const observer =
      new ResizeObserver(
        calculateStep,
      );

    if (viewportRef.current) {
      observer.observe(
        viewportRef.current,
      );
    }

    window.addEventListener(
      'resize',
      calculateStep,
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        'resize',
        calculateStep,
      );
    };
  }, [
    visibleCards,
    episodes.length,
  ]);

  /* =======================================================
     REINICIAR POSICIÓN
  ======================================================= */

  useEffect(() => {
    if (
      !cardStep ||
      !episodes.length
    ) {
      return;
    }

    setIsTransitioning(false);
    setCurrentIndex(
      episodes.length,
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
    });
  }, [
    cardStep,
    visibleCards,
    episodes.length,
  ]);

  /* =======================================================
     EPISODIOS DUPLICADOS
  ======================================================= */

  const loopEpisodes = [
    ...episodes,
    ...episodes,
    ...episodes,
  ];

  /* =======================================================
     ÍNDICE REAL
  ======================================================= */

  const realIndex =
    ((currentIndex %
      episodes.length) +
      episodes.length) %
    episodes.length;

  /* =======================================================
     SIGUIENTE
  ======================================================= */

  const next = () => {
    if (
      !episodes.length ||
      isResetting.current
    ) {
      return;
    }

    setIsTransitioning(true);

    setCurrentIndex(
      (value) => value + 1,
    );
  };

  /* =======================================================
     ANTERIOR
  ======================================================= */

  const previous = () => {
    if (
      !episodes.length ||
      isResetting.current
    ) {
      return;
    }

    setIsTransitioning(true);

    setCurrentIndex(
      (value) => value - 1,
    );
  };

  /* =======================================================
     TOUCH START
  ======================================================= */

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>,
  ) => {
    if (
      !episodes.length ||
      isResetting.current
    ) {
      return;
    }

    const touch =
      event.touches[0];

    if (!touch) {
      return;
    }

    touchStartX.current =
      touch.clientX;

    touchStartY.current =
      touch.clientY;

    lastTouchX.current =
      touch.clientX;

    isHorizontalSwipe.current =
      false;

    setDragX(0);

    setIsDragging(true);

    /*
     * Quitamos la transición durante
     * el arrastre para que la tarjeta
     * siga exactamente el dedo.
     */

    setIsTransitioning(false);
  };

  /* =======================================================
     TOUCH MOVE
  ======================================================= */

  const handleTouchMove = (
    event: React.TouchEvent<HTMLDivElement>,
  ) => {
    if (
      !isDragging ||
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return;
    }

    const touch =
      event.touches[0];

    if (!touch) {
      return;
    }

    const deltaX =
      touch.clientX -
      touchStartX.current;

    const deltaY =
      touch.clientY -
      touchStartY.current;

    /*
     * Primero determinamos si el
     * usuario está haciendo swipe
     * horizontal o desplazamiento
     * vertical de página.
     */

    if (
      Math.abs(deltaX) > 8 ||
      Math.abs(deltaY) > 8
    ) {
      if (
        Math.abs(deltaX) >
        Math.abs(deltaY)
      ) {
        isHorizontalSwipe.current =
          true;
      } else {
        isHorizontalSwipe.current =
          false;

        setIsDragging(false);
        setDragX(0);

        return;
      }
    }

    if (
      !isHorizontalSwipe.current
    ) {
      return;
    }

    /*
     * Aquí sí bloqueamos el scroll
     * vertical mientras el gesto es
     * claramente horizontal.
     */

    event.preventDefault();

    lastTouchX.current =
      touch.clientX;

    /*
     * Resistencia ligera en los extremos.
     * Aunque tenemos loop infinito,
     * evita un arrastre exagerado.
     */

    const resistance =
      Math.min(
        Math.abs(deltaX),
        120,
      ) * 0.15;

    const adjustedX =
      deltaX > 0
        ? deltaX - resistance
        : deltaX + resistance;

    setDragX(adjustedX);
  };

  /* =======================================================
     TOUCH END
  ======================================================= */

  const handleTouchEnd = () => {
    if (
      !isDragging ||
      touchStartX.current === null ||
      lastTouchX.current === null
    ) {
      resetTouch();
      return;
    }

    const distance =
      lastTouchX.current -
      touchStartX.current;

    setIsDragging(false);
    setDragX(0);

    /*
     * Activamos nuevamente la
     * transición antes de cambiar
     * de episodio.
     */

    setIsTransitioning(true);

    if (
      isHorizontalSwipe.current &&
      Math.abs(distance) >=
        SWIPE_THRESHOLD
    ) {
      if (distance < 0) {
        next();
      } else {
        previous();
      }
    }

    resetTouch();
  };

  /* =======================================================
     TOUCH CANCEL
  ======================================================= */

  const handleTouchCancel = () => {
    setIsDragging(false);
    setDragX(0);

    setIsTransitioning(true);

    resetTouch();
  };

  /* =======================================================
     RESET TOUCH
  ======================================================= */

  const resetTouch = () => {
    touchStartX.current = null;
    touchStartY.current = null;
    lastTouchX.current = null;

    isHorizontalSwipe.current =
      false;
  };

  /* =======================================================
     TRANSITION END
  ======================================================= */

  const handleTransitionEnd = () => {
    const total =
      episodes.length;

    if (!total) {
      return;
    }

    /*
     * LOOP HACIA ADELANTE
     */

    if (
      currentIndex >=
      total * 2
    ) {
      isResetting.current =
        true;

      setIsTransitioning(false);

      setCurrentIndex(total);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isResetting.current =
            false;

          setIsTransitioning(true);
        });
      });

      return;
    }

    /*
     * LOOP HACIA ATRÁS
     */

    if (
      currentIndex < total
    ) {
      isResetting.current =
        true;

      setIsTransitioning(false);

      setCurrentIndex(
        total * 2 - 1,
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isResetting.current =
            false;

          setIsTransitioning(true);
        });
      });
    }
  };

  /* =======================================================
     NO HAY EPISODIOS
  ======================================================= */

  if (!episodes.length) {
    return null;
  }

  /* =======================================================
     TRANSFORM
  ======================================================= */

  const translateX =
    -(currentIndex * cardStep) +
    dragX;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className={styles.carousel}>
      {/* =================================================
          CONTROLES
      ================================================= */}

      <div className={styles.controls}>
        <div className={styles.counter}>
          <span>
            {String(
              realIndex + 1,
            ).padStart(2, '0')}
          </span>

          <span
            className={
              styles.counterDivider
            }
          >
            /
          </span>

          <span>
            {String(
              episodes.length,
            ).padStart(2, '0')}
          </span>
        </div>

        <div className={styles.arrows}>
          <button
            type="button"
            onClick={previous}
            className={
              styles.arrowButton
            }
            aria-label="Episodio anterior"
          >
            <FiArrowLeft />
          </button>

          <button
            type="button"
            onClick={next}
            className={
              styles.arrowButton
            }
            aria-label="Siguiente episodio"
          >
            <FiArrowRight />
          </button>
        </div>
      </div>

      {/* =================================================
          VIEWPORT
      ================================================= */}

      <div
        ref={viewportRef}
        className={`${styles.viewport} ${
          isDragging
            ? styles.dragging
            : ''
        }`}
        onTouchStart={
          handleTouchStart
        }
        onTouchMove={
          handleTouchMove
        }
        onTouchEnd={
          handleTouchEnd
        }
        onTouchCancel={
          handleTouchCancel
        }
      >
        <div
          ref={trackRef}
          className={styles.track}
          style={{
            transform:
              `translate3d(${translateX}px, 0, 0)`,

            transition:
              isTransitioning &&
              !isDragging
                ? 'transform 520ms cubic-bezier(0.22, 0.61, 0.36, 1)'
                : 'none',
          }}
          onTransitionEnd={
            handleTransitionEnd
          }
        >
          {loopEpisodes.map(
            (
              episode,
              index,
            ) => {
              const originalIndex =
                index %
                episodes.length;

              return (
                <article
                  key={`${episode.id}-${index}`}
                  className={
                    styles.card
                  }
                >
                  {/* =========================================
                      PORTADA
                  ========================================= */}

                  <a
                    href={episode.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      styles.cover
                    }
                    aria-label={`Escuchar ${episode.title}`}
                    draggable={false}
                  >
                    {episode.image ? (
                      <img
                        src={
                          episode.image
                        }
                        alt={
                          episode.title
                        }
                        className={
                          styles.image
                        }
                        loading={
                          index < 7
                            ? 'eager'
                            : 'lazy'
                        }
                        referrerPolicy="no-referrer"
                        draggable={false}
                      />
                    ) : (
                      <div
                        className={
                          styles.fallback
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
                        styles.imageOverlay
                      }
                    />

                    <span
                      className={
                        styles.episodeNumber
                      }
                    >
                      EP.{' '}
                      {String(
                        episode.episodeNumber ||
                          originalIndex +
                            1,
                      ).padStart(
                        2,
                        '0',
                      )}
                    </span>

                    <span
                      className={
                        styles.imageArrow
                      }
                    >
                      <FiArrowUpRight />
                    </span>
                  </a>

                  {/* =========================================
                      CONTENIDO
                  ========================================= */}

                  <div
                    className={
                      styles.content
                    }
                  >
                    <div
                      className={
                        styles.meta
                      }
                    >
                      <span>
                        {formatDate(
                          episode.date,
                        )}
                      </span>

                      {episode.duration && (
                        <span>
                          {formatDuration(
                            episode.duration,
                          )}
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
                      {episode.title}
                    </h3>

                    <a
                      href={
                        episode.url
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

                      <FiArrowUpRight />
                    </a>
                  </div>
                </article>
              );
            },
          )}
        </div>
      </div>

      {/* =================================================
          INDICADOR MOBILE
      ================================================= */}

      <div
        className={
          styles.swipeHint
        }
        aria-hidden="true"
      >
        <FiArrowLeft />

        <span>
          Desliza para explorar
        </span>

        <FiArrowRight />
      </div>
    </div>
  );
}