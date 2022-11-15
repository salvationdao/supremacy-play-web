import { Action } from "react-fetching-library"
import { GAME_SERVER_HOSTNAME } from "../constants"
import { Fingerprint } from "../containers"
import { OvenStream } from "../containers/oven"
import { Faction, Feature, PowerCoreMaxStats, SaleAbilityAvailability, User, UserFromPassport, WarMachineDestroyedRecord, WeaponMaxStats } from "../types"

export const PassportLoginCheck = (formValues: { issue_token: string; fingerprint?: Fingerprint }): Action<UserFromPassport> => {
    const { issue_token, fingerprint } = formValues
    return {
        method: "POST",
        endpoint: `${window.location.protocol}//${GAME_SERVER_HOSTNAME}/api/auth/xsyn`,
        credentials: "include",
        responseType: "json",
        body: { issue_token, fingerprint },
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

export const GetOvenStreamList = (): Action<OvenStream[]> => {
    return {
        method: "GET",
        endpoint: "/video_server/oven_streams",
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

export const GetSaleAbilityAvailability = (playerID: string): Action<SaleAbilityAvailability> => {
    return {
        method: "GET",
        endpoint: `/sale_abilities/availability/${playerID}`,
        credentials: "include",
        responseType: "json",
    }
}

export const GetPowerCoreMaxStats = (playerID?: string): Action<PowerCoreMaxStats> => {
    return {
        method: "GET",
        endpoint: `/max_power_core_stats?user_id=${playerID || ""}`,
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

export const GetGlobalFeatures = (): Action<Feature[]> => {
    return {
        method: "GET",
        endpoint: "/feature/global-features",
        credentials: "include",
        responseType: "json",
    }
}

// headers: {
// 	"X-Authorization": xxxxx
// },
