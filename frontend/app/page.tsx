'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const HomePage = dynamic(() => import('./HomePage'), { ssr: false });

export default function Root() {
  const dataPromise = fetchData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}

function fetchData() {
  let status = "pending";
  let result: any;
  const suspender = fetch("/api/profile")
    .then((res) => res.json())
    .then((data) => {
      status = "success";
      result = data;
    })
    .catch((err) => {
      status = "error";
      result = err;
    });

  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw result;
      return result;
    },
  };
}