import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from './styles.module.scss'
import { api } from '@/services/api';
import { getStripeJs } from '@/services/stripe-js';


interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({priceId}: SubscribeButtonProps) {
    const session = useSession();
    const router = useRouter()

    
    async function handleSubscribe() {
        if(!session) {
            signIn('github')
            return
        }

        if(session.status === 'authenticated') {
            router.push('/posts')
            return;
        }

        // criação da checkout session
        try{ 
            const response = await api.post('/subscribe')

            const {sessionId} = response.data;

            const stripe = await getStripeJs()

            await stripe.redirectToCheckout({sessionId})

        }
        catch (err) {
            alert(err.message);
        }
        
    }

    return(
        <button 
         type="button"
         className={styles.subscribeButton}
         onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}
