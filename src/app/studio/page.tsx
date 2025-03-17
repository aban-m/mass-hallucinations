"use client";

import { trpc } from "@/client/trpc";
import { useState } from "react";

export default function StudioPage() {
  const [formData, setFormData] = useState({
    prompt: "",
    title: "",
    description: "",
    seed: 1,
    isPublic: false,
  });
  const [result, setResult] = useState<string>("");
  const generateImage = trpc.generateImage.useMutation({
    async onSuccess(data, variables, context) {
      setResult(data);
    },
  });

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (formData.prompt) {
      generateImage.mutate({
        ...formData,
        extraArgs: { width: 512, height: 512 },
      });
    }
  };

  return (
    <main style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>Studio</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />

        <label htmlFor="prompt">Prompt:</label>
        <textarea
          id="prompt"
          value={formData.prompt}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, prompt: e.target.value }))
          }
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />

        <label htmlFor="seed">Seed:</label>
        <input
          id="seed"
          type="number"
          value={formData.seed}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              seed: Number(e.target.value),
            }))
          }
        />

        <label htmlFor="isPublic" style={{ display: "flex", alignItems: "center" }}>
          <input
            id="isPublic"
            type="checkbox"
            checked={formData.isPublic}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))
            }
            style={{ marginRight: "0.5rem" }}
          />
          Public
        </label>

        <button
          type="submit"
          style={{
            padding: "0.5rem",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Generate!
        </button>
      </form>

      {result && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <h3>Generated Image:</h3>
          <img src={result} alt="Generated" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </main>
  );
}
