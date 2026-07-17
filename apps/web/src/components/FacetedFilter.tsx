import { IconCheck, IconPlus } from "@tabler/icons-react";
import type { ComponentType } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type FacetedFilterOption = {
  label: string;
  value: string;
  count?: number;
  icon?: ComponentType<{ className?: string }>;
};

type FacetedFilterProps = {
  title: string;
  options: FacetedFilterOption[];
  selected: string[];
  onSelectedChange: (next: string[]) => void;
};

export function FacetedFilter({
  title,
  options,
  selected,
  onSelectedChange,
}: FacetedFilterProps) {
  const selectedValues = new Set(selected);
  const selectedOptions = options.filter((option) =>
    selectedValues.has(option.value),
  );

  function toggle(value: string) {
    const next = new Set(selectedValues);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    onSelectedChange([...next]);
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-dashed border-[color:var(--tc-line)] bg-[color:var(--tc-surface)]"
          />
        }
      >
        <IconPlus data-icon="inline-start" className="size-4" />
        {title}
        {selectedOptions.length > 0 ? (
          <>
            <Separator
              orientation="vertical"
              className="mx-2 data-vertical:h-4"
            />
            <Badge
              variant="secondary"
              className="rounded-sm px-1 font-normal lg:hidden"
            >
              {selectedOptions.length}
            </Badge>
            <div className="hidden gap-1 lg:flex">
              {selectedOptions.length > 2 ? (
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selectedOptions.length} selected
                </Badge>
              ) : (
                selectedOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {option.label}
                  </Badge>
                ))
              )}
            </div>
          </>
        ) : null}
      </PopoverTrigger>
      <PopoverContent className="w-[12.5rem] gap-0 p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                const Icon = option.icon;
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    data-checked={isSelected || undefined}
                    onSelect={() => toggle(option.value)}
                  >
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <IconCheck className="size-3" />
                    </div>
                    {Icon ? (
                      <Icon className="size-4 text-muted-foreground" />
                    ) : null}
                    <span>{option.label}</span>
                    {option.count != null ? (
                      <CommandShortcut className="font-mono tracking-normal">
                        {option.count}
                      </CommandShortcut>
                    ) : (
                      <span data-slot="command-shortcut" className="sr-only" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 ? (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onSelectedChange([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                    <span data-slot="command-shortcut" className="sr-only" />
                  </CommandItem>
                </CommandGroup>
              </>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
