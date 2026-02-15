"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useSuburbs } from "@/lib/hooks/useSuburbs";
import type { Suburb } from "@/types/suburb";

interface SearchBarProps {
  onSelect: (suburb: string, postcode: string, lat: number, lng: number) => void;
  onClear: () => void;
}

export function SearchBar({ onSelect, onClear }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { suburbs } = useSuburbs(inputValue);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(suburbs.length > 0 && inputValue.length >= 2);
    setActiveIndex(-1);
  }, [suburbs, inputValue]);

  function handleSelect(suburb: Omit<Suburb, "id">) {
    setInputValue(`${suburb.name} (${suburb.postcode})`);
    setIsOpen(false);
    onSelect(suburb.name, suburb.postcode, suburb.latitude ?? 0, suburb.longitude ?? 0);
  }

  function handleClear() {
    setInputValue("");
    setIsOpen(false);
    onClear();
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suburbs.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && suburbs[activeIndex]) {
          handleSelect(suburbs[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="suburb-listbox"
          aria-activedescendant={
            activeIndex >= 0 ? `suburb-option-${activeIndex}` : undefined
          }
          aria-label="Search by suburb or postcode"
          placeholder="Search by suburb or postcode..."
          className="w-full rounded-lg border bg-background py-3 pl-10 pr-10 text-base outline-none focus:ring-2 focus:ring-primary/20"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suburbs.length > 0 && setIsOpen(true)}
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-accent"
            aria-label="Clear search"
          >
            <X
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {isOpen && suburbs.length > 0 && (
        <ul
          id="suburb-listbox"
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-background shadow-lg"
        >
          {suburbs.map((suburb, index) => (
            <li
              key={`${suburb.name}-${suburb.postcode}`}
              id={`suburb-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={`cursor-pointer px-4 py-3 text-base ${
                index === activeIndex ? "bg-accent" : "hover:bg-accent/50"
              }`}
              onClick={() => handleSelect(suburb)}
            >
              {suburb.name}{" "}
              <span className="text-muted-foreground">
                ({suburb.postcode})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
