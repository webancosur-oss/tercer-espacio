import PodcastHeader from '@/components/layout/PodcastHeader';
import PodcastHero from '@/components/hero/PodcastHero';
import EpisodeList from '@/components/episodes/EpisodeList';
import PodcastCTA from '@/components/newsletter/PodcastCTA';
import PodcastFooter from '@/components/layout/PodcastFooter';

import styles from './page.module.css';
import ListeningPlatforms from '@/components/platforms/ListeningPlatforms';

export default function Home() {
  return (
    <div className={styles.page}>
      <PodcastHeader />

      <main>
        <PodcastHero />


        <EpisodeList />

        {/* <PodcastHosts /> */}

        <ListeningPlatforms />

        <PodcastCTA />
      </main>

      <PodcastFooter />
    </div>
  );
}