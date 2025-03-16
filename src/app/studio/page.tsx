"use client";

import { trpc } from "@/client/trpc";
import { useState } from "react";

export default function StudioPage() {
  const generateImage = trpc.generateImage.useMutation({
    async onSuccess(data, variables, context) {
      setResult(data);
    },
  });
  const [prompt, setPrompt] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const handleSubmit = async () => {
    if (prompt) {
      generateImage.mutate({ prompt });
    }
  };
  return (
    <main>
      <h2>Studio</h2>
      <form action={async () => {}}>
        <label htmlFor="prompt">Prompt:</label>
        <textarea
          name="prompt"
          value={prompt}
          onChange={async (ev) => {
            setPrompt(ev.currentTarget.value);
          }}
        />
        <button onClick={handleSubmit}>Generate!</button>
      </form>
      {result && <img src={result} />}
    </main>
  );
}
