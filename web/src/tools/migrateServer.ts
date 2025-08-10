import { useApi } from "@/composables/useApi";
import type { ToolResult } from "@/types/tool";
import axios from "axios";

const { get, addLog, baseDomain } = useApi();

export async function executeMigrateServer(formData: Record<string, any>): Promise<ToolResult> {

    const { serverUrl, serverToken } = formData;

    const newLibraries = (await get("/api/libraries")).data.libraries;
    const oldLibraries = (await axios.get(`${serverUrl}/api/libraries`, {
        headers: {
            Authorization: `Bearer ${serverToken}`
        }
    })).data.libraries;

    const libraryMapping: Record<string, string> = {};

    for (const oldLibrary of oldLibraries) {
        const newLibrary = newLibraries.find((lib: any) => lib.name.toLowerCase() === oldLibrary.name.toLowerCase());
        if (newLibrary) {
            libraryMapping[oldLibrary.id] = newLibrary.id;
        }
    }

    addLog('=== Library Mapping ===');
    for (const oldLibrary of oldLibraries) {
        const newLibraryId = libraryMapping[oldLibrary.id];
        if (newLibraryId) {
            const newLibrary = newLibraries.find((lib: any) => lib.id === newLibraryId);
            if (newLibrary) {
                addLog(
                    `<a href="${serverUrl}/library/${oldLibrary.id}" target="_blank">${oldLibrary.name}</a> -> <a href="${baseDomain.value}library/${newLibrary.id}" target="_blank">${newLibrary.name}</a>`
                );
            }
        }
    }

    const newUsers = (await get("/api/users")).data.users;
    const oldUsers = (await axios.get(`${serverUrl}/api/users`, {
        headers: {
            Authorization: `Bearer ${serverToken}`
        }
    })).data.users;

    const userMapping: Record<string, string> = {};

    for (const oldUser of oldUsers) {
        const newUser = newUsers.find((user: any) =>
            user.username.toLowerCase() === oldUser.username.toLowerCase() ||
            (
                user.email !== null &&
                oldUser.email !== null &&
                user.email.toLowerCase() === oldUser.email.toLowerCase()
            )
        );
        if (newUser) {
            userMapping[oldUser.id] = newUser.id;
        }
    }

    addLog('=== User Mapping ===');
    for (const oldUser of oldUsers) {
        const newUserId = userMapping[oldUser.id];
        if (newUserId) {
            const newUser = newUsers.find((user: any) => user.id === newUserId);
            if (newUser) {
                addLog(
                    `<a href="${serverUrl}/config/users/${oldUser.id}" target="_blank">${oldUser.username}</a> -> <a href="${baseDomain.value}config/users/${newUser.id}" target="_blank">${newUser.username}</a>`
                );
            }
        }
    }


    const itemMapping: Record<string, string> = {};

    addLog('=== Item Mapping ===');
    for (const [oldId, newId] of Object.entries(libraryMapping)) {

        addLog(`Processing library: ${oldId} -> ${newId}`);

        const newItems = (await get(`/api/libraries/${newId}/items`)).data.results;
        const oldItems = (await axios.get(`${serverUrl}/api/libraries/${oldId}/items`, {
            headers: {
                Authorization: `Bearer ${serverToken}`
            }
        })).data.results;

        for (const oldItem of oldItems) {
            let item = newItems.find((item: any) => item.media.metadata.asin !== null &&  oldItem.media.metadata.asin !== null && item.media.metadata.asin === oldItem.media.metadata.asin);
            if (!item) item = newItems.find((item: any) => item.media.metadata.isbn !== null && oldItem.media.metadata.isbn !== null && item.media.metadata.isbn === oldItem.media.metadata.isbn);
            if (!item) {
                item = newItems.find((candidate: any) => {
                    const cMeta = candidate.media?.metadata;
                    const oMeta = oldItem.media?.metadata;
                    if (!cMeta || !oMeta) return false;
                    if (!cMeta.title || !oMeta.title) return false;
                    const cTitle = cMeta.title.toLowerCase();
                    const oTitle = oMeta.title.toLowerCase();
                    const cSubtitle = (cMeta.subtitle ?? '').toLowerCase();
                    const oSubtitle = (oMeta.subtitle ?? '').toLowerCase();
                    return cTitle === oTitle && cSubtitle === oSubtitle;
                });
            }

            if (item) {
                addLog(
                    `<a href="${serverUrl}/item/${oldItem.id}" target="_blank">${oldItem.media.metadata.title}</a> -> <a href="${baseDomain.value}item/${item.id}" target="_blank">${item.media.metadata.title}</a>`
                );
                itemMapping[oldItem.id] = item.id;
            }
        }
    }

    const progressMapping: Record<string, object[]> = {};

    addLog('=== User Progress ===');
    for (const [oldId, newId] of Object.entries(userMapping)) {
        addLog(`Processing user: ${oldId} -> ${newId}`);

        const oldProgresses = (await axios.get(`${serverUrl}/api/users/${oldId}`, {
            headers: {
                Authorization: `Bearer ${serverToken}`
            }
        })).data.mediaProgress;

        const pushProgres: object[] = [];


        for (let oldProgress of oldProgresses) {
            const itemId = oldProgress.libraryItemId;
            const newItemId = itemMapping[itemId];
            if (newItemId) {
                oldProgress.libraryItemId = newItemId;
                pushProgres.push(oldProgress);

                addLog(`User ${oldId} item ${itemId} mapped to ${newItemId}`);

            } else {
                addLog(`No mapping found for user ${oldId} item ${itemId}`);
            }
        }
        progressMapping[newId] = pushProgres;
    }

    const newSessions: object[] = [];

    const oldSessions = (await axios.get(`${serverUrl}/api/sessions?itemsPerPage=999999`, {
        headers: {
            Authorization: `Bearer ${serverToken}`
        }
    })).data.sessions;

    for (const oldSession of oldSessions) {
        const newUserId = userMapping[oldSession.userId];
        const newLibraryId = libraryMapping[oldSession.libraryId];
        const newLibraryItemId = itemMapping[oldSession.libraryItemId];

        if (newUserId && newLibraryId && newLibraryItemId) {
            const newSession = { ...oldSession, userId: newUserId, libraryId: newLibraryId, libraryItemId: newLibraryItemId, user: { ...oldSession.user, id: newUserId }, deviceInfo: { ...oldSession.deviceInfo, userId: newUserId } };
            newSessions.push(newSession);
            addLog(`Session ${oldSession.id} mapped to ${newSession.id}`);
        } else {
            addLog(`No mapping found for session ${oldSession.id}`);
        }
    }

    return {
        success: true,
        message: "Migration completed successfully. See logs for details.",
        timestamp: new Date().toISOString(),
    };
}