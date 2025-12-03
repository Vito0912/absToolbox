import { useApi } from "@/shared/composables/useApi";
import type { ToolResult } from "./types";
import axios from "axios";

const { get, post, del, addLog, baseDomain } = useApi();

function expandMapping(
  mapping: Record<string, string | null>,
): Record<string, string> {
  const expanded: Record<string, string> = {};

  for (const [key, value] of Object.entries(mapping)) {
    const keyParts = typeof key === "string" ? key.split(";") : [];
    const valueParts =
      typeof value === "string"
        ? value.split(";")
        : new Array(keyParts.length).fill(null);

    keyParts.forEach((k, i) => {
      const v = valueParts[i];
      if (k && k !== "null" && v && v !== "null") {
        expanded[k] = v;
      }
    });
  }

  return expanded;
}

function deepReplace(obj: any, mapping: Record<string, string>): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepReplace(item, mapping));
  } else if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        deepReplace(value, mapping),
      ]),
    );
  } else if (typeof obj === "string") {
    if (obj === "null") return "null";
    return mapping[obj] ? mapping[obj] : obj;
  }
  return obj;
}

export async function executeMigrateServer(
  formData: Record<string, any>,
): Promise<ToolResult> {
  const { serverUrl, serverToken, apiKeyExpiresIn } = formData;

  const expiresInMinutes = Number.parseInt(String(apiKeyExpiresIn).trim(), 10);
  if (Number.isNaN(expiresInMinutes)) {
    throw new Error("apiKeyExpiresIn must be a numeric string (minutes).");
  }
  const expiresInSeconds = expiresInMinutes * 60;

  const newLibraries = (await get("/api/libraries")).data.libraries;
  const oldLibraries = (
    await axios.get(`${serverUrl}/api/libraries`, {
      headers: {
        Authorization: `Bearer ${serverToken}`,
      },
    })
  ).data.libraries;

  const libraryMapping: Record<string, string> = {};

  for (const oldLibrary of oldLibraries) {
    const newLibrary = newLibraries.find(
      (lib: any) => lib.name.toLowerCase() === oldLibrary.name.toLowerCase(),
    );
    if (newLibrary) {
      libraryMapping[oldLibrary.id] = newLibrary.id;
    }
  }

  addLog("=== Library Mapping ===");
  for (const oldLibrary of oldLibraries) {
    const newLibraryId = libraryMapping[oldLibrary.id];
    if (newLibraryId) {
      const newLibrary = newLibraries.find(
        (lib: any) => lib.id === newLibraryId,
      );
      if (newLibrary) {
        addLog(
          `<a href="${serverUrl}/library/${oldLibrary.id}" target="_blank">${oldLibrary.name}</a> -> <a href="${baseDomain.value}library/${newLibrary.id}" target="_blank">${newLibrary.name}</a>`,
        );
      }
    }
  }

  const newUsers = (await get("/api/users")).data.users;
  const oldUsers = (
    await axios.get(`${serverUrl}/api/users`, {
      headers: {
        Authorization: `Bearer ${serverToken}`,
      },
    })
  ).data.users;

  const userMapping: Record<string, string> = {};

  for (const oldUser of oldUsers) {
    const newUser = newUsers.find(
      (user: any) =>
        user.username.toLowerCase() === oldUser.username.toLowerCase() ||
        (user.email !== null &&
          oldUser.email !== null &&
          user.email.toLowerCase() === oldUser.email.toLowerCase()),
    );
    if (newUser) {
      userMapping[oldUser.id] = newUser.id;
    }
  }

  addLog("=== User Mapping ===");
  for (const oldUser of oldUsers) {
    const newUserId = userMapping[oldUser.id];
    if (newUserId) {
      const newUser = newUsers.find((user: any) => user.id === newUserId);
      if (newUser) {
        addLog(
          `<a href="${serverUrl}/config/users/${oldUser.id}" target="_blank">${oldUser.username}</a> -> <a href="${baseDomain.value}config/users/${newUser.id}" target="_blank">${newUser.username}</a>`,
        );
      }
    }
  }

  const itemMapping: Record<string, string> = {};
  const itemMediaMapping: Record<string, string> = {};

  addLog("=== Item Mapping ===");
  for (const [oldId, newId] of Object.entries(libraryMapping)) {
    addLog(`Processing library: ${oldId} -> ${newId}`);

    const newItems = (await get(`/api/libraries/${newId}/items`)).data.results;
    const oldItems = (
      await axios.get(`${serverUrl}/api/libraries/${oldId}/items`, {
        headers: {
          Authorization: `Bearer ${serverToken}`,
        },
      })
    ).data.results;

    for (let oldItem of oldItems) {
      let item = newItems.find(
        (item: any) =>
          item.media.metadata.asin !== null &&
          oldItem.media.metadata.asin !== null &&
          item.media.metadata.asin === oldItem.media.metadata.asin,
      );
      if (!item)
        item = newItems.find(
          (item: any) =>
            item.media.metadata.isbn !== null &&
            oldItem.media.metadata.isbn !== null &&
            item.media.metadata.isbn === oldItem.media.metadata.isbn,
        );
      if (!item) {
        item = newItems.find((candidate: any) => {
          const cMeta = candidate.media?.metadata;
          const oMeta = oldItem.media?.metadata;
          if (!cMeta || !oMeta) return false;
          if (!cMeta.title || !oMeta.title) return false;
          const cTitle = cMeta.title.toLowerCase();
          const oTitle = oMeta.title.toLowerCase();
          const cSubtitle = (cMeta.subtitle ?? "").toLowerCase();
          const oSubtitle = (oMeta.subtitle ?? "").toLowerCase();
          return cTitle === oTitle && cSubtitle === oSubtitle;
        });
      }

      if (item) {
        addLog(
          `<a href="${serverUrl}/item/${oldItem.id}" target="_blank">${oldItem.media.metadata.title}</a> -> <a href="${baseDomain.value}item/${item.id}" target="_blank">${item.media.metadata.title}</a>`,
        );
        if (oldItem.mediaType == "podcast") {
          oldItem = (
            await axios.get(`${serverUrl}/api/items/${oldItem.id}`, {
              headers: {
                Authorization: `Bearer ${serverToken}`,
              },
            })
          ).data;
          item = (await get(`/api/items/${item.id}`)).data;

          for (let i: number = 0; i < oldItem.media.episodes.length; i++) {
            const oldEpisode = oldItem.media.episodes[i];
            const newEpisode = item.media.episodes[i];
            if (newEpisode) {
              itemMapping[`${oldItem.id};${oldEpisode.id}`] =
                `${item.id};${newEpisode.id}`;
            } else {
              addLog(
                `Warning: No mapping found for podcast episode <a href="${serverUrl}/item/${oldItem.id}" target="_blank">${oldItem.media.metadata.title}</a> episode "${oldEpisode.title}"`,
              );
            }
          }
        } else {
          itemMapping[`${oldItem.id};${null}`] = `${item.id};${null}`;
        }
        itemMediaMapping[oldItem.media.id] = item.media.id;
      }
    }
  }

  const progressMapping: Record<string, object[]> = {};

  addLog("=== User Progress ===");
  for (const [oldId, newId] of Object.entries(userMapping)) {
    addLog(`Processing user: ${oldId} -> ${newId}`);

    const oldProgresses = (
      await axios.get(`${serverUrl}/api/users/${oldId}`, {
        headers: {
          Authorization: `Bearer ${serverToken}`,
        },
      })
    ).data.mediaProgress;

    const pushProgres: object[] = [];

    for (let oldProgress of oldProgresses) {
      const itemId = oldProgress.libraryItemId;
      const episodeId = oldProgress.episodeId;

      const newItemId = itemMapping[`${itemId ?? null};${episodeId ?? null}`];
      if (newItemId) {
        const newProgress = deepReplace(
          oldProgress,
          expandMapping({
            ...userMapping,
            ...libraryMapping,
            ...itemMapping,
            ...itemMediaMapping,
          }),
        );
        pushProgres.push(newProgress);

        addLog(`User ${oldId} item ${itemId} mapped to ${newItemId}`);
      } else {
        addLog(`Warning: No mapping found for user ${oldId} item ${itemId}`);
      }
    }
    progressMapping[newId] = pushProgres;
  }

  const newSessions: object[] = [];

  const oldSessions = (
    await axios.get(`${serverUrl}/api/sessions?itemsPerPage=999999`, {
      headers: {
        Authorization: `Bearer ${serverToken}`,
      },
    })
  ).data.sessions;

  const uuidMapping: Record<string, string> = {
    ...userMapping,
    ...libraryMapping,
    ...itemMapping,
    ...itemMediaMapping,
  };

  let firstItem: string | null = null;

  for (const [key, value] of Object.entries(itemMapping)) {
    if (key.includes(";null")) {
      firstItem = value.split(";")[0] ?? null;
      break;
    }
  }

  if (!firstItem) {
    throw new Error(
      "No non podcast item found. You need to have at least one non podcast item.",
    );
  }

  const sessionsToFix: Record<string, string> = {};

  for (const oldSession of oldSessions) {
    const newSession = deepReplace(oldSession, expandMapping(uuidMapping));

    if (
      !itemMapping[
        `${oldSession.libraryItemId};${oldSession.episodeId ?? null}`
      ]
    ) {
      addLog(
        `Warning: The library item for session ${oldSession.id} could not be found. Using ${firstItem} as a fallback.`,
      );
      newSession.libraryItemId = firstItem;
      newSession.episodeId = null;
      sessionsToFix[newSession.id] =
        `${oldSession.libraryItemId};${oldSession.episodeId ?? null}`;
    }

    newSessions.push(newSession);
    //console.log(newSession.id, `<pre>${JSON.stringify(newSession, null, 2)}</pre>`);
    addLog(`Session ${newSession.id} updated`);
  }

  addLog("=== Adding Progress (This may take a while) ===");

  for (const userId of Object.values(userMapping)) {
    const userProgress = progressMapping[userId];

    const apiKeyResponse = (
      await post("/api/api-keys", {
        name: "Migration Script",
        expiresIn: expiresInSeconds,
        isActive: true,
        userId: userId,
      })
    ).data;

    const apiKey = apiKeyResponse.apiKey.apiKey;
    const apiKeyId = apiKeyResponse.apiKey.id;

    const sessions = newSessions.filter(
      (session: any) => session.userId === userId,
    );

    await axios.patch(
      `${baseDomain.value}api/me/progress/batch/update`,
      userProgress,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    await axios.post(
      `${baseDomain.value}api/session/local-all`,
      {
        sessions: sessions,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );
    await del(`/api/api-keys/${apiKeyId}`);

    addLog(`Added sessions for user ${userId}`);
  }

  return {
    success: true,
    message: "Migration completed successfully. See logs for details.",
    timestamp: new Date().toISOString(),
  };
}
