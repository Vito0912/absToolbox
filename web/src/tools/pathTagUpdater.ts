import { useApi } from "@/composables/useApi";
import type { ToolResult } from "@/types/tool";

const { get, post } = useApi();

export async function executePathTagUpdater(formData: Record<string, any>): Promise<ToolResult> {
    const { libraryId, ruleSets, dryRun, type } = formData;

    const books = (await get(`/api/libraries/${libraryId}/items`)).data.results;

    const logs = [];

    for (const ruleSet of ruleSets) {
        const payload = []
        const lastColonIndex = ruleSet.lastIndexOf(':');
        let pathRegex, tag;

        for (const book of books) {

            if (lastColonIndex !== -1) {
                pathRegex = ruleSet.substring(0, lastColonIndex);
                tag = ruleSet.substring(lastColonIndex + 1);
            } else {
                throw new Error(`Invalid rule set format: ${ruleSet}`);
            }

            const regex = new RegExp(pathRegex);

            console.log(`Checking book ${book.media.metadata.title} with path ${book.path} against regex ${regex}`);

            if (book.path.match(regex)) {
                type == 'tags' ? payload.push({ 
                    id: book.id,         
                    mediaPayload: {
                        tags: [...new Set([...(book.media?.tags || []), tag])],
                    },
                }) : payload.push({
                    id: book.id,
                    mediaPayload: {
                        metadata: {
                            genres: [...new Set([...(book.media?.metadata?.genres || []), tag])],
                        }
                    },
                });
            }

        }

        if (payload.length > 0 && !dryRun) {
            try {
                await post('/api/items/batch/update', [...payload]);
                logs.push(`Updated ${payload.length} books for rule "${ruleSet}"`);
            } catch (error: unknown) {
                throw new Error(`Failed to update books for rule "${ruleSet}": ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        if (dryRun) {
            for (const book of payload) {
                const fullBook = books.find((b: any) => b.id === book.id);
                logs.push(`Dry run: would update book ${fullBook.media.metadata.title} with tag "${tag}" based on path "${fullBook.path}"`);
            }
        }
        if (payload.length === 0) {
            logs.push(`No books matched for rule "${ruleSet}"`);
        }

    }


    return {
        success: true,
        message: dryRun ? `Dry run completed. No changes applied.` : `Tags updated successfully.`,
        data: logs,
        timestamp: new Date().toISOString(),
    }
}