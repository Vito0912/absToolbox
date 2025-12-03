import { useApi } from "@/shared/composables/useApi";

const { get } = useApi();

export async function fetchLibraryIds(libraryIds: string[]): Promise<string[]> {
  const response = await get("/api/libraries");

  let allLibraries = response.data.libraries || [];

  if (libraryIds.length !== 0) {
    allLibraries = allLibraries.filter((library: { id: string }) =>
      libraryIds.includes(library.id),
    );
  }
  return allLibraries.map((library: { id: string }) => library.id);
}
