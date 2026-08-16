import { getCloudflareContext } from "@opennextjs/cloudflare";
import { fetchSurahList } from "@/lib/db";
import { SurahCatalogClient } from "./surah-catalog-client";

export async function SurahCatalog() {
  const { env } = getCloudflareContext();
  const surahList = await fetchSurahList(env);

  return <SurahCatalogClient initialSurahs={surahList} />;
}
