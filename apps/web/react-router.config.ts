import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  // Generate a client-only SPA that can be deployed as static files.
  ssr: false,
} satisfies Config;
