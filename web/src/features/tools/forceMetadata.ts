import { useApi } from "@/shared/composables/useApi";
import { fetchLibraryIds } from "@/common/libraryIds";
import type { ToolResult } from "./types";

const { absClient, addLog } = useApi();

export async function executeForceMetadata(
  formData: Record<string, any>,
): Promise<ToolResult> {
  const { libraryIds } = formData;

  const validLibraryIds = await fetchLibraryIds(libraryIds);

  let payload = [];

  for (const libraryId of validLibraryIds) {
    const items =
      (await absClient.libraries.listItems(libraryId)).results || [];

    for (const item of items) {
      const push = {
        id: item.id,
        mediaPayload: {
          tags: [...new Set([...(item.media?.tags || []), "force-metadata"])],
        },
      };

      payload.push(push);

      addLog(
        `Adding "force-metadata" tag to book: ${item.media?.metadata?.title} (${item.id}) in library ${libraryId}`,
      );
    }
  }

  addLog(
    `Adding "force-metadata" tag to ${payload.length} books in ${validLibraryIds.length} libraries.`,
  );

  await absClient.libraryItems.batchUpdate(payload);

  await absClient.misc.deleteTag("force-metadata");

  return {
    success: true,
    message: `Metadata force tag added successfully for ${payload.length} books in ${validLibraryIds.length} libraries.`,
    timestamp: new Date().toISOString(),
  };
}
