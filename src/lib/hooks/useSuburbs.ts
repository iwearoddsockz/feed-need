"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PERTH_SUBURBS } from "@/lib/data/perth-suburbs";
import type { Suburb } from "@/types/suburb";

export function useSuburbs(searchTerm?: string) {
  const [suburbs, setSuburbs] = useState<Omit<Suburb, "id">[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (term: string) => {
      if (!term || term.length < 2) {
        setSuburbs([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const isPostcode = /^\d+$/.test(term);

        let query = supabase.from("suburbs").select("*").limit(20);

        if (isPostcode) {
          query = query.like("postcode", `${term}%`);
        } else {
          query = query.ilike("name", `${term}%`);
        }

        const { data, error: queryError } = await query.order("name");

        if (queryError) {
          throw new Error(queryError.message);
        }

        setSuburbs(data ?? []);
      } catch {
        // Fallback to static data when offline or on error
        const isPostcode = /^\d+$/.test(term);
        const termLower = term.toLowerCase();
        const filtered = PERTH_SUBURBS.filter((s) =>
          isPostcode
            ? s.postcode.startsWith(term)
            : s.name.toLowerCase().startsWith(termLower)
        ).slice(0, 20);
        setSuburbs(filtered);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (searchTerm !== undefined) {
      const timer = setTimeout(() => search(searchTerm), 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, search]);

  return { suburbs, loading, error, search };
}
