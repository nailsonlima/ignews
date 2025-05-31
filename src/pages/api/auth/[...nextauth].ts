import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../../../services/firebase";

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any }) {
      const email = user.email;

      try {
        const userRef = doc(db, "users", email);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: email,
            createdAt: new Date(),
          });
          console.log("Novo usuário criado no Firestore:", email);
        } else {
          console.log("Usuário já existe no Firestore:", email);
        }

        return true;
      } catch (error) {
        console.error("Erro ao salvar usuário no Firestore:", error);
        return false;
      }
    },

    async session({ session }: { session: any }) {
      const email = session.user?.email;

      if (!email) {
        return {
          ...session,
          activeSubscription: null,
        };
      }

      try {
        const subsQuery = query(
          collection(db, "subscriptions"),
          where("userId", "==", email), // 💥 Aqui tá o pulo do gato
          where("status", "==", "active")
        );

        const subsSnapshot = await getDocs(subsQuery);

        if (subsSnapshot.empty) {
          return {
            ...session,
            activeSubscription: null,
          };
        }

        const activeSubscription = subsSnapshot.docs[0].data();

        return {
          ...session,
          activeSubscription: activeSubscription || null,
        };
      } catch (error) {
        console.error("Erro ao buscar assinatura ativa:", error);
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
  },
};

export default NextAuth(authOptions);


// async session({ session }) {
//   const activeSubscription = await getActiveSubscription(session.user.email);

//   return {
//     ...session,
//     activeSubscription: activeSubscription || null,
//   };
// },
//   async signIn({ user }: { user: any }) {
//     const email = user.email;

//     try {
//       const userRef = doc(collection(db, "users"), email);
//       const userSnap = await getDoc(userRef);

//       if (!userSnap.exists()) {
//         await setDoc(userRef, {
//           email: email,
//           createdAt: new Date(),
//         });
//         console.log("Novo usuário criado no Firestore:", email);
//       } else {
//         console.log("Usuário já existe no Firestore:", email);
//       }

//       return true;
//     } catch (error) {
//       console.error("Erro ao salvar usuário no Firestore:", error);
//       return false;
//     }
//   },

//   async session({ session }: { session: any }) {
//     const email = session.user?.email;

//     if (!email) {
//       return {
//         ...session,
//         activeSubscription: null,
//       };
//     }

//     try {
//       // Buscar usuário
//       const userRef = doc(collection(db, "users"), email);
//       const userSnap = await getDoc(userRef);

//       if (!userSnap.exists()) {
//         return {
//           ...session,
//           activeSubscription: null,
//         };
//       }

//       const userId = userSnap.id;
//       // console.log('userid', userId)
      
//       // Consultar assinatura ativa
//       const subsRef = collection(db, "subscriptions");
//       console.log('subsref', subsRef)
//       const subsQuery = query(
//         subsRef,
//         where("userRef", "==", userId),
//         where("status", "==", "active")
//       );
//       // console.log('subsquery', subsQuery)

//       const subsSnapshot = await getDocs(subsQuery);
//       console.log('subsSnapshot', subsSnapshot.docs[0].data())
//       if (subsSnapshot.empty) {
//         return {
//           ...session,
//           activeSubscription: null,
//         };
//       }

//       const activeSubscription = subsSnapshot.docs[0].data();
//       console.log('activeSubscription',activeSubscription)

//       return {
//         ...session,
//         activeSubscription: activeSubscription || null,
//       };
//     } catch (error) {
//       console.error("Erro ao buscar assinatura ativa:", error);
//       return {
//         ...session,
//         activeSubscription: null,
//       };
//     }
//   },