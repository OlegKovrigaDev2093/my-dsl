import { use } from "react";

const dataPromise = fetch("http://localhost:3000").then((res) =>
  res.json(),
) as Promise<{ message: string }>;

const App = () => {
  const data = use(dataPromise);

  return (
    <>
      <h1>Hello World</h1>
      <h2>{data.message}</h2>
    </>
  );
};

export default App;
