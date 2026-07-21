import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.rexer.microservices",
  appName: "Rexer Micro-Tools",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
