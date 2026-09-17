'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type WheelEvent,
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
const SWIPE_THRESHOLD = 60;
const TRANSITION_DURATION = 460;

function formatDate(date: string) {
  if (!date) return '';

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

function formatDuration(duration: string) {
  if (!duration) return '';

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

export default function EpisodeCarousel({
  episodes,
}: Props) {
  const viewportRef =
    useRef<HTMLDivElement>(null);

  /*
   * ========================================================
   * ESTADOS
   * ========================================================
   */

  const [visibleCards, setVisibleCards] =
    useState(4);

  const [cardStep, setCardStep] =
    useState(0);

  /*
   * Siempre empezamos en la copia central.
   *
   * [ COPIA 1 ][ COPIA 2 ][ COPIA 3 ]
   *                 ↑
   *              posición
   */

  const [currentIndex, setCurrentIndex] =
    useState(episodes.length);

  const [isTransitioning, setIsTransitioning] =
    useState(true);

  const [dragX, setDragX] =
    useState(0);

  const [isDragging, setIsDragging] =
    useState(false);

  /*
   * ========================================================
   * POINTER REFS
   * ========================================================
   */

  const pointerId =
    useRef<number | null>(null);

  const startX =
    useRef<number | null>(null);

  const startY =
    useRef<number | null>(null);

  const lastX =
    useRef<number | null>(null);

  const isHorizontalGesture =
    useRef(false);

  const moved =
    useRef(false);

  const suppressClick =
    useRef(false);

  /*
   * ========================================================
   * LOOP
   * ========================================================
   */

  const isLoopResetting =
    useRef(false);

  /*
   * ========================================================
   * WHEEL
   * ========================================================
   */

  const wheelAccumulator =
    useRef(0);

  const wheelLocked =
    useRef(false);

  const wheelTimer =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  /*
   * ========================================================
   * RESPONSIVE
   * ========================================================
   */

  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;

      if (width <= 600) {
        setVisibleCards(1);
      } else if (width <= 900) {
        setVisibleCards(2);
      } else if (width <= 1200) {
        setVisibleCards(3);
      } else {
        setVisibleCards(4);
      }
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

  /*
   * ========================================================
   * MEDIR TARJETA
   * ========================================================
   */

  useEffect(() => {
    if (!episodes.length) return;

    const measureCard = () => {
      const viewport =
        viewportRef.current;

      if (!viewport) return;

      const card =
        viewport.querySelector(
          `.${styles.card}`,
        ) as HTMLElement | null;

      if (!card) return;

      const width =
        card.getBoundingClientRect().width;

      if (!width) return;

      setCardStep(
        width + GAP,
      );
    };

    measureCard();

    const observer =
      new ResizeObserver(measureCard);

    if (viewportRef.current) {
      observer.observe(
        viewportRef.current,
      );
    }

    window.addEventListener(
      'resize',
      measureCard,
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        'resize',
        measureCard,
      );
    };
  }, [
    episodes.length,
    visibleCards,
  ]);

  /*
   * ========================================================
   * REPOSICIONAR CUANDO CAMBIA RESPONSIVE
   * ========================================================
   */

  useEffect(() => {
    if (
      !episodes.length ||
      !cardStep
    ) {
      return;
    }

    setIsTransitioning(false);

    setCurrentIndex(
      episodes.length,
    );

    setDragX(0);

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

  /*
   * ========================================================
   * TRES COPIAS
   * ========================================================
   */

  const loopEpisodes = [
    ...episodes,
    ...episodes,
    ...episodes,
  ];

  /*
   * ========================================================
   * ÍNDICE REAL
   * ========================================================
   */

  const realIndex =
    ((currentIndex %
      episodes.length) +
      episodes.length) %
    episodes.length;

  /*
   * ========================================================
   * IR AL SIGUIENTE
   * ========================================================
   */

  const next = useCallback(() => {
    if (
      !episodes.length ||
      isLoopResetting.current ||
      isDragging
    ) {
      return;
    }

    setIsTransitioning(true);

    setCurrentIndex(
      (value) => value + 1,
    );
  }, [
    episodes.length,
    isDragging,
  ]);

  /*
   * ========================================================
   * IR AL ANTERIOR
   * ========================================================
   */

  const previous = useCallback(() => {
    if (
      !episodes.length ||
      isLoopResetting.current ||
      isDragging
    ) {
      return;
    }

    setIsTransitioning(true);

    setCurrentIndex(
      (value) => value - 1,
    );
  }, [
    episodes.length,
    isDragging,
  ]);

  /*
   * ========================================================
   * POINTER DOWN
   *
   * Desktop = mouse
   * Mobile = touch
   * ========================================================
   */

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (
      !episodes.length ||
      isLoopResetting.current ||
      event.button !== 0
    ) {
      return;
    }

    pointerId.current =
      event.pointerId;

    startX.current =
      event.clientX;

    startY.current =
      event.clientY;

    lastX.current =
      event.clientX;

    isHorizontalGesture.current =
      false;

    moved.current = false;

    suppressClick.current =
      false;

    setDragX(0);

    setIsDragging(true);

    setIsTransitioning(false);

    /*
     * Importante:
     * mantiene el pointer capturado aunque
     * el cursor salga del carrusel.
     */

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  };

  /*
   * ========================================================
   * POINTER MOVE
   * ========================================================
   */

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (
      !isDragging ||
      pointerId.current !==
        event.pointerId ||
      startX.current === null ||
      startY.current === null
    ) {
      return;
    }

    const deltaX =
      event.clientX -
      startX.current;

    const deltaY =
      event.clientY -
      startY.current;

    /*
     * Primero determinamos si el gesto
     * es horizontal o vertical.
     */

    if (
      !isHorizontalGesture.current &&
      (Math.abs(deltaX) > 7 ||
        Math.abs(deltaY) > 7)
    ) {
      if (
        Math.abs(deltaX) >
        Math.abs(deltaY)
      ) {
        isHorizontalGesture.current =
          true;

        moved.current = true;

        suppressClick.current =
          true;
      } else {
        /*
         * Era un movimiento vertical.
         * No interferimos con la página.
         */

        setIsDragging(false);

        setDragX(0);

        setIsTransitioning(true);

        resetPointer();

        return;
      }
    }

    if (
      !isHorizontalGesture.current
    ) {
      return;
    }

    /*
     * Evitamos que el navegador
     * intente seleccionar contenido.
     */

    event.preventDefault();

    lastX.current =
      event.clientX;

    /*
     * El contenido sigue al cursor.
     */

    setDragX(deltaX);
  };

  /*
   * ========================================================
   * POINTER UP
   * ========================================================
   */

  const handlePointerUp = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (
      !isDragging ||
      pointerId.current !==
        event.pointerId
    ) {
      return;
    }

    const start =
      startX.current;

    const last =
      lastX.current;

    /*
     * Liberar captura.
     */

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    setIsDragging(false);

    setDragX(0);

    setIsTransitioning(true);

    if (
      start !== null &&
      last !== null &&
      isHorizontalGesture.current
    ) {
      const distance =
        last - start;

      /*
       * UN GESTO = UN EPISODIO
       */

      if (
        Math.abs(distance) >=
        SWIPE_THRESHOLD
      ) {
        if (distance < 0) {
          setCurrentIndex(
            (value) => value + 1,
          );
        } else {
          setCurrentIndex(
            (value) => value - 1,
          );
        }
      }
    }

    resetPointer();
  };

  /*
   * ========================================================
   * POINTER CANCEL
   * ========================================================
   */

  const handlePointerCancel = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    setIsDragging(false);

    setDragX(0);

    setIsTransitioning(true);

    resetPointer();
  };

  /*
   * ========================================================
   * RESET POINTER
   * ========================================================
   */

  const resetPointer = () => {
    pointerId.current = null;

    startX.current = null;

    startY.current = null;

    lastX.current = null;

    isHorizontalGesture.current =
      false;
  };

  /*
   * ========================================================
   * WHEEL / TRACKPAD
   *
   * Solo desktop.
   *
   * Scroll horizontal con trackpad:
   * izquierda / derecha.
   *
   * También Shift + rueda.
   * ========================================================
   */

  const handleWheel = (
    event: WheelEvent<HTMLDivElement>,
  ) => {
    if (
      window.innerWidth <= 900 ||
      !episodes.length ||
      isLoopResetting.current ||
      isDragging
    ) {
      return;
    }

    const isHorizontal =
      Math.abs(event.deltaX) >
      Math.abs(event.deltaY);

    const isShiftScroll =
      event.shiftKey &&
      Math.abs(event.deltaY) > 0;

    if (
      !isHorizontal &&
      !isShiftScroll
    ) {
      return;
    }

    event.preventDefault();

    const delta =
      isHorizontal
        ? event.deltaX
        : event.deltaY;

    wheelAccumulator.current +=
      delta;

    if (
      wheelLocked.current
    ) {
      return;
    }

    if (
      Math.abs(
        wheelAccumulator.current,
      ) < 35
    ) {
      return;
    }

    const direction =
      wheelAccumulator.current > 0
        ? 1
        : -1;

    wheelAccumulator.current = 0;

    wheelLocked.current = true;

    if (direction > 0) {
      setIsTransitioning(true);

      setCurrentIndex(
        (value) => value + 1,
      );
    } else {
      setIsTransitioning(true);

      setCurrentIndex(
        (value) => value - 1,
      );
    }

    if (wheelTimer.current) {
      clearTimeout(
        wheelTimer.current,
      );
    }

    wheelTimer.current =
      setTimeout(() => {
        wheelLocked.current =
          false;

        wheelAccumulator.current = 0;
      }, TRANSITION_DURATION);
  };

  /*
   * ========================================================
   * LIMPIAR WHEEL
   * ========================================================
   */

  useEffect(() => {
    return () => {
      if (wheelTimer.current) {
        clearTimeout(
          wheelTimer.current,
        );
      }
    };
  }, []);

  /*
   * ========================================================
   * EVITAR CLICK DESPUÉS DEL DRAG
   * ========================================================
   */

  const handleClickCapture = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (suppressClick.current) {
      event.preventDefault();

      event.stopPropagation();

      suppressClick.current =
        false;
    }
  };

  /*
   * ========================================================
   * TRANSITION END
   *
   * Aquí se crea el LOOP INFINITO.
   * ========================================================
   */

  const handleTransitionEnd = () => {
    if (
      !episodes.length ||
      isDragging
    ) {
      return;
    }

    const total =
      episodes.length;

    /*
     * Llegamos al final de la
     * tercera copia.
     */

    if (
      currentIndex >=
      total * 2
    ) {
      isLoopResetting.current =
        true;

      /*
       * Quitamos la transición
       * durante el salto invisible.
       */

      setIsTransitioning(false);

      /*
       * Volvemos exactamente a
       * la misma posición dentro
       * de la copia central.
       */

      setCurrentIndex(total);

      setDragX(0);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isLoopResetting.current =
            false;

          setIsTransitioning(true);
        });
      });

      return;
    }

    /*
     * Llegamos al principio.
     */

    if (
      currentIndex < total
    ) {
      isLoopResetting.current =
        true;

      setIsTransitioning(false);

      /*
       * Último elemento de la copia
       * central.
       */

      setCurrentIndex(
        total * 2 - 1,
      );

      setDragX(0);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isLoopResetting.current =
            false;

          setIsTransitioning(true);
        });
      });
    }
  };

  /*
   * ========================================================
   * TRANSFORM
   * ========================================================
   */

  const translateX =
    -(currentIndex * cardStep) +
    dragX;

  /*
   * ========================================================
   * RENDER
   * ========================================================
   */

  if (!episodes.length) {
    return null;
  }

  return (
    <div
      className={styles.carousel}
    >
      {/* ==================================================
          CONTROLES
      ================================================== */}

      <div
        className={styles.controls}
      >
        <div
          className={styles.counter}
        >
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

        <div
          className={styles.arrows}
        >
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

      {/* ==================================================
          VIEWPORT
      ================================================== */}

      <div
        ref={viewportRef}
        className={`${styles.viewport} ${
          isDragging
            ? styles.dragging
            : ''
        }`}
        onPointerDown={
          handlePointerDown
        }
        onPointerMove={
          handlePointerMove
        }
        onPointerUp={
          handlePointerUp
        }
        onPointerCancel={
          handlePointerCancel
        }
        onWheel={handleWheel}
        onClickCapture={
          handleClickCapture
        }
      >
        {/* ================================================
            TRACK
        ================================================ */}

        <div
          className={styles.track}
          style={{
            transform: `translate3d(${translateX}px, 0, 0)`,

            transition:
              isTransitioning &&
              !isDragging
                ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
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
                  {/* ========================================
                      IMAGEN
                  ======================================== */}

                  <a
                    href={
                      episode.url
                    }
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
                          index < 8
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

                  {/* ========================================
                      INFORMACIÓN
                  ======================================== */}

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

      {/* ==================================================
          INDICADOR MOBILE
      ================================================== */}

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