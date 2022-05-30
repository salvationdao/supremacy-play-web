import { Action } from "react-fetching-library"
import { PASSPORT_SERVER_HOST, GAME_SERVER_HOSTNAME } from "../constants"
import { Faction, Stream, User, WarMachineDestroyedRecord } from "../types"

export const PassportLoginCheck = (): Action<User> => {
    return {
        method: "GET",
        endpoint: `${window.location.protocol}//${PASSPORT_SERVER_HOST}/api/auth/check`,
        credentials: "include",
        responseType: "json",
    }
}

export const GameServerLoginCheck = (): Action<boolean> => {
    console.log("checking ")

    return {
        method: "POST",
        endpoint: `${window.location.protocol}//${GAME_SERVER_HOSTNAME}/api/auth/check`,
        credentials: "include",
        responseType: "json",
        body: { thing: "thing" },
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
