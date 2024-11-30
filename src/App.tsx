import { useEffect, useState } from "react";
import mqtt from "mqtt";
import { MQTT_PORT, MQTT_URL } from "./env";

interface DataArr {
  topic: string;
  message: string;
  timestamp: number;
}

const client = mqtt.connect(`mqtt://${MQTT_URL}`, {
  port: MQTT_PORT,
});

function App() {
  const [dataArr, setDataArr] = useState<DataArr[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSubbed, setIsSubbed] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (client && !isConnected) {
      client.on("connect", () => {
        console.log("Connected");
        setIsConnected(true);
      });
    }

    if (client && isConnected && !isSubbed) {
      client.subscribe("test_mqtt", (err) => {
        if (err) {
          setIsSubbed(false);
          setErr("Error subscribing");
        } else {
          console.log("Subscribed to test_mqtt");
          setIsSubbed(true);
          setErr("");
        }
      });
      client.on("message", (topic, message) => {
        const data = {
          topic: topic,
          message: message.toString(), // message is Buffer
          timestamp: new Date().getTime(),
        };
        setDataArr((prev) => [data, ...prev]);
      });
    }
  }, [client, isConnected, isSubbed]);
  if (!isConnected) return <h1>Not Connected to MQTT</h1>;
  if (err) return <h1>Error: {err}</h1>;

  return (
    <>
      <h1>Test MQTT</h1>
      <p>
        {dataArr.map((d) => {
          return (
            <li key={d.timestamp}>
              {d.topic}: {d.message} @
              {new Date(d.timestamp).toLocaleDateString()} :
              {new Date(d.timestamp).toLocaleTimeString()}
            </li>
          );
        })}
      </p>
    </>
  );
}

export default App;
