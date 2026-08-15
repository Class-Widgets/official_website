import { FloatingSidebar } from "../components/floating-sidebar";

export default function Home() {
  return (
    <main className="relative isolate min-h-svh overflow-hidden bg-[linear-gradient(to_bottom,var(--home-bg-from),var(--home-bg-to))] transition-[background] duration-300">
      <FloatingSidebar />
    </main>
  );
}
