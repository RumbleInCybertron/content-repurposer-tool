// frontend/app/page.tsx

'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const HomePage = dynamic(() => import('./HomePage'), { ssr: false });

export default function Root() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}