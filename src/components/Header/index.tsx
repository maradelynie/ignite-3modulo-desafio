import Link from 'next/link';

import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';

export default function Header(): JSX.Element {
  return (
    <header
      className={`${styles.headerContainer} ${commonStyles.pageContainer}`}
    >
      <Link href="/">
        <a>
          <img src="/images/Logo.svg" alt="logo" />
        </a>
      </Link>
    </header>
  );
}
