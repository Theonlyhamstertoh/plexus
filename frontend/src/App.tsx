export default function App() {
  return <div>Empty</div>;
}
const DEV_SERVER_URL = "ws://localhost:3001";
const ws = new WebSocket(DEV_SERVER_URL);
console.log(ws);
