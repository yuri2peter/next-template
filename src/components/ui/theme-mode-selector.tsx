'use client';

import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { useId } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const items = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
];

export default function ThemeModeSelector() {
  const { setTheme, theme } = useTheme();
  const id = useId();
  return (
    <RadioGroup className="space-y-2" value={theme} onValueChange={setTheme}>
      {items.map((item) => (
        <div
          key={`${id}-${item.value}`}
          className="relative flex flex-col gap-4 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring"
        >
          <div className="flex justify-between gap-2">
            <RadioGroupItem
              id={`${id}-${item.value}`}
              value={item.value}
              className="order-1 after:absolute after:inset-0"
            />
            <item.Icon
              className="opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
          <Label htmlFor={`${id}-${item.value}`}>{item.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
