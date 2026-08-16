import { getCloudflareContext } from "@opennextjs/cloudflare";
import { fetchSurahList } from "@/lib/db";
import { SurahExplorerClient } from "./surah-explorer-client";

export async function SurahExplorer() {
  const { env } = getCloudflareContext();
  const surahList = await fetchSurahList(env);

  return <SurahExplorerClient initialSurahs={surahList} />;
}
