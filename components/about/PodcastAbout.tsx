import styles from './PodcastAbout.module.css';

const cityImage =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85';

export default function PodcastAbout() {
  return (
    <section
      id="podcast"
      className={styles.section}
    >
      <div className={styles.container}>

        {/* =================================================
            IMAGE
        ================================================= */}

        <div className={styles.visual}>

          <div
            className={styles.image}
            style={{
              backgroundImage: `url("${cityImage}")`,
            }}
            role="img"
            aria-label="Arquitectura contemporánea y ciudad"
          />

        </div>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className={styles.content}>

          <span className={styles.eyebrow}>
            SOBRE EL PODCAST
          </span>

          <h2>
            Hablamos de lo que
            <br />
            realmente <em>mueve</em>
            <br />
            una ciudad.
          </h2>

          <div className={styles.copy}>

            <p>
              Construir no es solamente levantar edificios.
              Es entender cómo las personas viven, invierten,
              trabajan y proyectan su futuro.
            </p>

            <p>
              En este podcast conversamos con profesionales,
              empresarios y especialistas para descubrir las
              historias y decisiones que existen detrás del
              mundo inmobiliario.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}