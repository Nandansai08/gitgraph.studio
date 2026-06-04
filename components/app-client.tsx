"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("@/src/App"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen bg-[#0f1115] text-white items-center justify-center font-mono text-xs uppercase tracking-widest">
      Initializing Workspace...
    </div>
  ),
});

export default function AppClient() {
  return <App />;
}
