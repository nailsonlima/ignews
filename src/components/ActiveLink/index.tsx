import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import {ReactElement} from  'react'

interface ActiveLinkProps extends LinkProps{
    children: ReactElement | string;
    activeClassName: string;
}
export function ActiveLink({children, activeClassName, ...rest} : ActiveLinkProps) {

    const { asPath } = useRouter();

    const className =  asPath === (rest.href.startsWith('/') ? rest.href : '/' + rest.href )? activeClassName : ''

    return(
        <Link className={className} {...rest}>
            {children}
        </Link> 
    )
}   