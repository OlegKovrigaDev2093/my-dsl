import { use } from "react";
import SenderDSL from "./SenderDSL";

const dataPromise = fetch("http://localhost:3000").then((res) =>
  res.json(),
) as Promise<{ message: string }>;

const App = () => {
  const data = use(dataPromise);

  return (
    <>
      <SenderDSL />
    </>
  );
};

export default App;
