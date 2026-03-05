'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface BehaviorToggleRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function BehaviorToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}: BehaviorToggleRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
}
