export const MQTT_URL = import.meta.env.VITE_MQTT_URL ?? "";
export const MQTT_PORT = parseInt(import.meta.env.VITE_MQTT_PORT ?? "0");

if (!MQTT_URL || !MQTT_PORT) {
  throw new Error("Incorrect env");
}
