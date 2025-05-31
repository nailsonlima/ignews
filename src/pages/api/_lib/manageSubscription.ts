import { stripe } from '@/services/stripe';
import { db } from '@/services/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc 
} from 'firebase/firestore';

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  
  console.log('👉 customerId recebido no webhook:', customerId);

  if (!subscriptionId || !customerId) {
  console.error('❌ subscriptionId ou customerId está undefined');
  throw new Error('subscriptionId ou customerId inválido');
}
  try {
    console.log('🚀 Iniciando saveSubscription', { subscriptionId, customerId, createAction });

    // Buscar o usuário no Firebase pelo customerId
    const usersRef = collection(db, 'users');
    const qUser = query(usersRef, where('stripe_customer_id', '==', customerId));
    const querySnapshot = await getDocs(qUser);

    console.log('🔍 Buscando usuário no Firebase...');
    if (querySnapshot.empty) {
      console.error('❌ Usuário não encontrado no Firebase');
      throw new Error('Usuário não encontrado no Firebase');
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = userDoc.ref;

    console.log('✅ Usuário encontrado:', userRef.id);

    // Buscar dados da subscription no Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    console.log('📦 Dados da subscription recuperados do Stripe:', subscription);

    // Dados para salvar no Firebase
    const subscriptionData = {
      id: subscription.id,
      userId: userRef.id,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
    };

    const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
    console.log('🗂️ Referência da subscription no Firebase:', subscriptionRef.path);

    // Criar ou atualizar no Firestore
    console.log(createAction ? '🚀 Criando assinatura no Firebase...' : '♻️ Atualizando assinatura no Firebase...');
    await setDoc(subscriptionRef, subscriptionData, { merge: true });
    console.log('✅ Assinatura salva no Firebase:', subscriptionId);

  } catch (error) {
    console.error('🔥 Erro no saveSubscription:', error);
    throw error;
  }
}
