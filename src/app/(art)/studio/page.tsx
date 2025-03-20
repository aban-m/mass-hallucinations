"use client";

import { trpc } from "@/client/trpc";
import { useSearchParams } from "next/navigation";
import { Form } from "^/form";
import { Button } from "^/button";
import { Label } from "^/label";
import { Input } from "^/input";
import { Textarea } from "^/textarea";
import { Checkbox } from "^/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "^/card";
import { useEffect, useState } from "react";
import { ImageWithLoader } from "@/components/ui/image";

export default function StudioPage() {
  const params = useSearchParams();
  const buildOn = params.get("buildOn");
  const pieceQuery = trpc.piece.useQuery(buildOn!, { enabled: false });
  const [formData, setFormData] = useState({
    prompt: "",
    title: "",
    description: "",
    seed: 1,
    isPublic: false,
  });

  useEffect(() => {
    if (!buildOn) return;
    (async () => {
      const { data } = await pieceQuery.refetch();
      if (data) setFormData(data!);
    })();
  }, [buildOn]);

  const [result, setResult] = useState<string>("");
  const commitImage = trpc.commitImage.useMutation({
    async onSuccess(data, variables, context) {
      setResult(data);
    },
  });
  const generateImage = trpc.generateImage.useMutation({
    async onSuccess(data, variables, context) {
      setResult(data);
    },
  });

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (formData.prompt) {
      commitImage.mutate({
        ...formData,
        extraArgs: { width: 512, height: 512 },
      });
    }
  };

  const handlePreview = async () => {
    if (formData.prompt) {
      generateImage.mutate({
        ...formData,
        extraArgs: { width: 512, height: 512 },
      });
    }
  };

  const handleVariant = async () => {
    if (formData.prompt) {
      setFormData((prev) => ({
        ...prev,
        seed: Math.floor(Math.random() * 10000),
      }));
      generateImage.mutate({
        ...formData,
        extraArgs: { width: 512, height: 512 },
      });
    }
  };
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="flex w-full max-w-4xl gap-6">
        <Card className="w-2/3">
          <CardHeader>
            <CardTitle className="text-center">Studio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, prompt: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seed">Seed</Label>
                <Input
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
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPublic: checked.valueOf() as boolean,
                    }))
                  }
                />
                <Label htmlFor="isPublic">Public</Label>
              </div>
              <div className="flex justify-between">
                <Button type="submit">Submit</Button>
                <Button variant="secondary" onClick={handlePreview}>
                  Preview
                </Button>
                <Button variant="secondary" onClick={handleVariant}>
                  See Variant
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        {result && <ImageWithLoader src={result} loading={generateImage.isLoading} />}
      </div>
    </div>
  );
}
