import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mediapp.mich',
  appName: 'PWA',
  webDir: 'www',
  plugins: {
    Camera: {
      permissions: ["camera"],
      allowEditing: false
    }
  }
};

export default config;
