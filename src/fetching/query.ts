import { Action } from "react-fetching-library"
import { GAME_SERVER_HOSTNAME, PASSPORT_SERVER_HOST } from "../constants"
import { Fingerprint } from "../containers"
import { Faction, UserFromPassport, SaleAbilitiesAvailabilityResponse, Stream, User, WarMachineDestroyedRecord, WeaponMaxStats } from "../types"

export const PassportLoginCheck = (): Action<UserFromPassport> => {
    return {
        method: "GET",
        endpoint: `${window.location.protocol}//${PASSPORT_SERVER_HOST}/api/auth/check`,
        credentials: "include",
        responseType: "json",
    }
}

export const GameServerLoginCheck = (fingerprint?: Fingerprint): Action<User> => {
    return {
        method: "POST",
        endpoint: `${window.location.protocol}//${GAME_SERVER_HOSTNAME}/api/auth/check`,
        credentials: "include",
        responseType: "json",
        body: { fingerprint },
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

export const CanPlayerPurchase = (playerID: string): Action<SaleAbilitiesAvailabilityResponse> => {
    return {
        method: "GET",
        endpoint: `/sale_abilities/availability/${playerID}`,
        credentials: "include",
        responseType: "json",
    }
}

export const GetWeaponMaxStats = (playerID?: string | undefined): Action<WeaponMaxStats> => {
    return {
        method: "GET",
        endpoint: `/max_weapon_stats?user_id=${playerID || ""}`,
        credentials: "include",
        responseType: "json",
    }
}

// headers: {
// 	"X-Authorization": xxxxx
// },
