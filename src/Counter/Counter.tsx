import { useState } from "react";

export interface counterProps {
  startCount: number;
}

export function Counter({ startCount }: counterProps) {
  const [count, setCount] = useState(startCount ?? 0);

  return (
    <div>
      <p>You clicked the button {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
