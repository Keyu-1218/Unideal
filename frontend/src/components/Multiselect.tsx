import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { useState } from "react";

interface MultiSelectProps {
  locations: string[];
  onChange: (locations: string[]) => void;
}

export function MultiSelect({ locations, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggle = (value: string) => {
    const newValue = locations.includes(value)
      ? locations.filter((l) => l !== value) 
      : [...locations, value];

    onChange(newValue);
  };

  const locationsSelectedCount = locations.length;

  const availableMockedlocations = [
    "Aalto Metro Station",
    "Tapiola",
    "Kamppi",
    "Iso Omena",
    "New York",
  ];

  return (
    <div className="flex items-center gap-2 p-2 bg-[#EBEBEB] rounded-md w-[200px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="h-7 px-4 bg-[#507A5C] hover:bg-[#507A5C]/90 text-white text-sm rounded-md">
            + Add
          </Button>
        </PopoverTrigger>
        {locations.length !== 0 && (
          <span className="text-xs text-green-dark">
            {locationsSelectedCount > 1
              ? `${locationsSelectedCount} locations selected`
              : `${locationsSelectedCount} location selected`}
          </span>
        )}

        <PopoverContent className="w-[200px] p-0" align="end">
          <Command>
            <CommandInput placeholder="Search location..." className="h-9" />
            <CommandList>
              <CommandEmpty>No location found.</CommandEmpty>
              <CommandGroup>
                {availableMockedlocations.map((location) => (
                  <CommandItem
                    key={location}
                    onSelect={() => toggle(location)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        locations.includes(location)
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {location}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
