"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinecraftAuthHeaders = exports.RealmAPIHeaders = exports.BeRPColor = exports.Scopes = exports.AzureClientID = exports.Endpoints = exports.BeRP_VERSION = exports.CUR_VERSION_PROTOCOL = exports.CUR_VERSION = exports.ProtoDataPath = void 0;
const path_1 = require("path");
exports.ProtoDataPath = (0, path_1.resolve)(process.cwd(), 'data');
exports.CUR_VERSION = '1.18.30';
exports.CUR_VERSION_PROTOCOL = 503;
exports.BeRP_VERSION = '1.0.0';
const MCRAPI = "https://pocket.realms.minecraft.net/";
exports.Endpoints = {
    Authorities: {
        RealmAPI: MCRAPI,
        MineRak: "https://multiplayer.minecraft.net/",
        ClubHub: "https://clubhub.xboxlive.com/",
        PeopleHub: "https://peoplehub.xboxlive.com/",
        MSAL: "https://login.microsoftonline.com/consumers",
    },
    Misc: {
        MinecraftAuth: 'https://multiplayer.minecraft.net/authentication',
        XboxDeviceAuth: 'https://device.auth.xboxlive.com/device/authenticate',
        XboxTitleAuth: 'https://title.auth.xboxlive.com/title/authenticate',
        XstsAuthorize: 'https://xsts.auth.xboxlive.com/xsts/authorize',
        LiveDeviceCodeRequest: 'https://login.live.com/oauth20_connect.srf',
        LiveTokenRequest: 'https://login.live.com/oauth20_token.srf',
    },
    RealmAPI: {
        GET: {
            UserCompatible: MCRAPI + "mco/client/compatible",
            UserTrial: MCRAPI + "trial/new",
            UserInvites: "invites/count/pending",
            LivePlayers: MCRAPI + "activities/live/players",
            Realms: MCRAPI + "worlds",
            Realm: (id) => MCRAPI + `worlds/${id}`,
            RealmJoinInfo: (id) => MCRAPI + `worlds/${id}/join`,
            RealmPacks: (id) => MCRAPI + `worlds/${id}/content`,
            RealmSubsciptionDetails: (id) => MCRAPI + `subscriptions/${id}/details`,
            RealmBackups: (id) => MCRAPI + `worlds/${id}/backups`,
            RealmBackup: (id, slot, backupId) => MCRAPI + `archive/download/world/${id}/${slot}/${backupId}`,
            RealmBackupLatest: (id, slot) => MCRAPI + `archive/download/world/${id}/${slot}/latest`,
            RealmInviteLink: (id) => MCRAPI + `links/v1?worldId=${id}`,
            RealmByInvite: (invite) => MCRAPI + `worlds/v1/link/${invite}`,
            RealmBlockedPlayers: (id) => MCRAPI + `worlds/${id}/blocklist`,
        },
        POST: {
            RealmBlockPlayer: (id, xuid) => MCRAPI + `worlds/${id}/blocklist/${xuid}`,
            RealmAcceptInvite: (invite) => MCRAPI + `worlds/v1/link/accept/${invite}`,
            RealmConfiguration: (id) => MCRAPI + `worlds/${id}/configuration`,
        },
        PUT: {
            RealmUpdateInvite: (id) => MCRAPI + `invites/${id}/invite/update`,
            RealmDefaultPermission: (id) => MCRAPI + `worlds/${id}/defaultPermission`,
            RealmUserPermission: (id) => MCRAPI + `worlds/${id}/userPermission`,
            RealmBackup: (id, backupId) => MCRAPI + `worlds/${id}/backups?backupId=${backupId}&clientSupportsRetries`,
            RealmSlot: (id, slotNum) => MCRAPI + `worlds/${id}/slot/${slotNum}`,
            RealmOpen: (id) => MCRAPI + `worlds/${id}/open`,
            RealmClose: (id) => MCRAPI + `worlds/${id}/close`,
        },
        DELETE: {
            RealmBlockedPlayer: (id, xuid) => MCRAPI + `worlds/${id}/blocklist/${xuid}`,
            RealmInvite: (id) => MCRAPI + `invites/${id}`,
            RealmWorld: (id) => MCRAPI + `worlds/${id}`,
        },
    },
};
// Should Never Have To Change Unless Nobus Microsoft Account Gets Yeeted
exports.AzureClientID = "d4e8e17a-f8ae-47b8-a392-8b76fcdb10d2";
exports.Scopes = ["Xboxlive.signin", "Xboxlive.offline_access"];
exports.BeRPColor = "#6990ff";
const RealmAPIHeaders = (token) => {
    return {
        "cache-control": "no-cache",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.5",
        "content-type": "application/json",
        "charset": "utf-8",
        "client-version": exports.CUR_VERSION,
        "authorization": token,
        "Connection": "Keep-Alive",
        "Host": "pocket.realms.minecraft.net",
        "User-Agent": "BeRP [Bedrock Edition Realm Protocol](https://github.com/nobuwu/berp)",
    };
};
exports.RealmAPIHeaders = RealmAPIHeaders;
const MinecraftAuthHeaders = (token) => {
    return {
        "cache-control": "no-cache",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.5",
        "content-type": "application/json",
        "charset": "utf-8",
        "client-version": exports.CUR_VERSION,
        "authorization": token,
        "Connection": "Keep-Alive",
        "Host": "multiplayer.minecraft.net",
        "User-Agent": "BeRP [Bedrock Edition Realm Protocol](https://github.com/nobuwu/berp)",
    };
};
exports.MinecraftAuthHeaders = MinecraftAuthHeaders;
