"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewLocationForm } from "./NewLocationForm";
import type { MealLocation } from "@/types/location";

interface EditSuggestionDialogProps {
  location: MealLocation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSuggestionDialog({
  location,
  open,
  onOpenChange,
}: EditSuggestionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Suggest an edit</DialogTitle>
          <DialogDescription>
            Update the details for {location.name}. Change the fields that
            need updating and submit. We will review your changes.
          </DialogDescription>
        </DialogHeader>
        <NewLocationForm
          prefill={location}
          locationId={location.id}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
