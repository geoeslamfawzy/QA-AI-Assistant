'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Palette, Loader2, Image } from 'lucide-react';
import { toast } from 'sonner';

export interface FigmaFrame {
  id: string;
  name: string;
  width: number;
  height: number;
  thumbnailUrl?: string;
}

interface FigmaExtractCardProps {
  frames: FigmaFrame[];
  onExtract: (frames: FigmaFrame[]) => void;
}

export function FigmaExtractCard({ frames, onExtract }: FigmaExtractCardProps) {
  const [figmaUrl, setFigmaUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleExtract = async () => {
    if (!figmaUrl.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/figma/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: figmaUrl.trim() }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to extract frames');
      }

      onExtract(data.frames);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-dim">
            <Palette className="h-4 w-4 text-pink-500" />
          </div>
          Figma Designs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Figma Frame URL (or auto-detect from ticket)
          </Label>
          <div className="flex gap-2">
            <Input
              value={figmaUrl}
              onChange={(e) => setFigmaUrl(e.target.value)}
              placeholder="https://www.figma.com/file/..."
              className="text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
            />
            <Button
              variant="secondary"
              onClick={handleExtract}
              disabled={!figmaUrl.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Extract'
              )}
            </Button>
          </div>
        </div>

        {/* Frame Previews */}
        {frames.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground">
              Extracted Frames ({frames.length})
            </p>
            <div className="grid grid-cols-3 gap-2">
              {frames.map((frame) => (
                <div
                  key={frame.id}
                  className="rounded-lg border-2 border-dashed border-border p-3 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                    <Image className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="text-[10px] text-center text-muted-foreground line-clamp-2">
                    {frame.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {frames.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
              <Palette className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              No frames extracted yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
