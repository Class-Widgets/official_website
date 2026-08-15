import { FloatingSidebar } from "../components/floating-sidebar";

export default function Home() {
  return (
    <main className="relative isolate min-h-svh overflow-hidden bg-[#f4f6f8] transition-colors duration-300 dark:bg-[#101318]">
      <FloatingSidebar />
    </main>
  );
}
