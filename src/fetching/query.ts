import { Action } from "react-fetching-library"
import { GAME_SERVER_HOSTNAME, PASSPORT_SERVER_HOST } from "../constants"
import { Faction, Stream, User, WarMachineDestroyedRecord } from "../types"

export const APICheck = (token: string): Action<User> => {
    return {
        method: "GET",
        endpoint: `${window.location.protocol}//${GAME_SERVER_HOSTNAME}/api/auth/check?token=${encodeURIComponent(token)}`,
        credentials: "include",
        responseType: "json",
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
