import { SignInButton } from '../SignInButton'

import {ActiveLink} from '../ActiveLink'
import styles from './styles.module.scss'

export function Header() {

    
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <ActiveLink activeClassName={styles.active} href='/'>
                    <img src="/images/logo.svg" alt="ig.news" />
                </ActiveLink>
                <nav>
                    <ActiveLink activeClassName={styles.active} href="/">
                        Home
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href="posts" prefetch>
                        Posts
                    </ActiveLink>
                </nav>

                <SignInButton />
            </div>
        </header>
    )
}