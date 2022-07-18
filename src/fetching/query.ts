import { Action } from "react-fetching-library"
import { PASSPORT_SERVER_HOST, GAME_SERVER_HOSTNAME } from "../constants"
import { Fingerprint } from "../containers/fingerprint"
import { Faction, Stream, User, UserFromPassport, WarMachineDestroyedRecord } from "../types"

export const PassportLoginCheck = (): Action<UserFromPassport> => {
    return {
        method: "GET",
        endpoint: `${window.location.protocol}//${PASSPORT_SERVER_HOST}/api/auth/check`,
        credentials: "include",
        responseType: "json",
    }
}

export const GameServerLoginCheck = (fingerprint?: Fingerprint): Action<boolean> => {
    return {
        method: "POST",
        endpoint: `${window.location.protocol}//${GAME_SERVER_HOSTNAME}/api/auth/check`,
        credentials: "include",
        responseType: "json",
        body: { fingerprint },
    }
}

export const GetGameServerPlayer = (userID: string | undefined): Action<User> => {
    return {
        method: "POST",
        endpoint: `${window.location.protocol}//${GAME_SERVER_HOSTNAME}/api/auth/player`,
        credentials: "include",
        responseType: "json",
        body: { user_id: userID },
    }
}

export const GetFactionsAll = (): Action<Faction[]> => {
    return {
        method: "GET",
        endpoint: "/faction/all",
        credentials: "include",
        responseType: "json",
    }
}

export const GetStreamList = (): Action<Stream[]> => {
    return {
        method: "GET",
        endpoint: "/video_server",
        credentials: "include",
        responseType: "json",
    }
}

export const GetMechDestroyedInfo = (mechID: string): Action<WarMachineDestroyedRecord> => {
    return {
        method: "GET",
        endpoint: `/battle/mech/${mechID}/destroyed_detail`,
        credentials: "include",
        responseType: "json",
    }
}

// headers: {
// 	"X-Authorization": xxxxx
// },
