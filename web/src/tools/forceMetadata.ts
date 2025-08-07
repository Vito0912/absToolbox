import { useApi } from "@/composables/useApi";
import { fetchLibraryIds } from "@/common/libraryIds";
import type { ToolResult } from "@/types/tool";

const { get, post, baseDomain, addLog } = useApi();

export async function executeForceMetadata(
  formData: Record<string, any>
): Promise<ToolResult> {
  const { libraryIds } = formData;

  const validLibraryIds = await fetchLibraryIds(libraryIds);

  let payload = [];

  for (const libraryId of validLibraryIds) {
    const items =
      ((await get(`/api/libraries/${libraryId}/items`)).data.results) || [];

    for (const item of items) {
      const push = {
        id: item.id,
        mediaPayload: {
          tags: [...new Set([...item.media?.tags, "force-metadata"])],
        },
      };

      payload.push(push);

      addLog(`Adding "force-metadata" tag to book: ${item.media.metadata.title} (${item.id}) in library ${libraryId}`);
    }
  }

  addLog(`Adding "force-metadata" tag to ${payload.length} books in ${validLibraryIds.length} libraries.`);

  await post('/api/items/batch/update', [...payload]);

  return {
    success: true,
    message: `Metadata force tag added successfully for ${payload.length} books in ${validLibraryIds.length} libraries. Got to ${baseDomain.value}/config/item-metadata-utils/tags to remove the tag \'force-metadata\'.`,
    timestamp: new Date().toISOString(),
  };
}
