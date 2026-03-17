import { useApi } from "@/shared/composables/useApi";

const { absClient } = useApi();

export async function fetchLibraryIds(libraryIds: string[]): Promise<string[]> {
  const response = await absClient.libraries.list();

  let allLibraries = response.libraries || [];

  if (libraryIds.length !== 0) {
    allLibraries = allLibraries.filter((library: { id: string }) =>
      libraryIds.includes(library.id),
    );
  }
  return allLibraries.map((library: { id: string }) => library.id);
}
