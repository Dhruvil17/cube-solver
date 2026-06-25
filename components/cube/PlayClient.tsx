"use client";

import dynamic from "next/dynamic";

const PlayView = dynamic(
  () => import("./PlayView").then((mod) => mod.PlayView),
  { ssr: false }
);

export function PlayClient() {
  return <PlayView />;
}
