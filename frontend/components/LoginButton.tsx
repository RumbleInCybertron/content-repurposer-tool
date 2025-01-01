// 'use client';

// import { signIn, signOut, useSession } from 'next-auth/react';

// export default function LoginButton() {
//   const { data: session } = useSession();

//   return (
//     <div>
//       {session ? (
//         <>
//           <p>Welcome, {session.user?.name || 'User'}!</p>
//           <p>Your access token: {session.accessToken}</p>
//           <button onClick={() => signOut()} className="bg-background text-secondary px-4 py-2 rounded">
//             Sign Out
//           </button>
//         </>
//       ) : (
//         <button onClick={() => signIn('twitter')} className="bg-background text-secondary px-4 py-2 rounded">
//           Sign In with Twitter
//         </button>
//       )}
//     </div>
//   );
// }
