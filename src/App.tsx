import { useEffect, useState } from "react";
import mqtt from "mqtt";
import { MQTT_PORT, MQTT_URL } from "./env";

const client = mqtt.connect(`mqtt://${MQTT_URL}`, {
  port: MQTT_PORT,
});

interface DataArr {
  topic: string;
  message: string;
  timestamp: number;
}

function App() {
  const [dataArr, setDataArr] = useState<DataArr[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      client.on("connect", () => {
        console.log("Connected");
        setIsConnected(true);
      });
    }

    return () => {
      // console.log("Exiting...");
      // setIsConnected(false);
      // client.end();
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      client.subscribe("test_mqtt", (err) => {
        if (!err) {
          console.log("Subscribed to test_mqtt");
          setIsConnected(true); // Prevent double subscription
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
  }, [isConnected]);

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
