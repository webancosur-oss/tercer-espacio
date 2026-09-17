import styles from './PodcastTopics.module.css';

const topics = [
  'Inversión',
  'Arquitectura',
  'Ciudad',
  'Construcción',
  'Patrimonio',
  'Mercado',
];

export default function PodcastTopics() {
  return (
    <section
      id="temas"
      className={styles.section}
    >
      <div className={styles.container}>

        <span className={styles.eyebrow}>
          DE QUÉ HABLAMOS
        </span>

        <h2>
          Ideas que
          <br />
          <span>mueven.</span>
        </h2>

        <div className={styles.topics}>
          {topics.map((topic) => (
            <div
              key={topic}
              className={styles.topic}
            >
              <span>{topic}</span>

              <i />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}