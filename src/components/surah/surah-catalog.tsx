import { getCloudflareContext } from "@opennextjs/cloudflare";
import { fetchSurahList } from "@/lib/db";
import { SurahCatalogClient } from "./surah-catalog-client";
import type { LoadingProps } from "@/types/components";

export async function SurahCatalog({ isLoading }: LoadingProps = {}) {
  if (isLoading) {
    return <SurahCatalogClient initialSurahs={[]} isLoading={true} />;
  }

  let surahList = [];
  try {
    const { env } = getCloudflareContext();
    surahList = await fetchSurahList(env);
  } catch {
    surahList = await fetchSurahList();
  }

  return <SurahCatalogClient initialSurahs={surahList} />;
}

