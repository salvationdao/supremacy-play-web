import BigNumber from "bignumber.js"
import { colors } from "../theme/theme"
import {
    MultiplierAdmiral,
    MultiplierAFoolAndHisMoney,
    MultiplierAirSupport,
    MultiplierCitizen,
    MultiplierContributor,
    MultiplierDestroyerOfWorlds,
    MultiplierFieldMechanic,
    MultiplierGreaseMonkey,
    MultiplierMechCommander,
    MultiplierNowIAmBecomeDeath,
    MultiplierSuperContributor,
    MultiplierSupporter,
    MultiplierFiend,
    MultiplierJunkE,
    MultiplierMechHead,
    MultiplierSniper,
    MultiplierWonBattle,
    MultiplierWonLastThreeBattles,
} from "../assets"

// Capitalize convert a string "example" to "Example"
export const Capitalize = (str: string): string => str[0].toUpperCase() + str.substring(1).toLowerCase()

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export const isObject = (item: any) => {
    return item && typeof item === "object" && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export const mergeDeep = (target: any, ...sources: any): any => {
    if (!sources.length) return target
    const source = sources.shift()

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} })
                mergeDeep(target[key], source[key])
            } else {
                Object.assign(target, { [key]: source[key] })
            }
        }
    }

    return mergeDeep(target, ...sources)
}

export const shadeColor = (hexColor: string, percent: number) => {
    let R = parseInt(hexColor.substring(1, 3), 16)
    let G = parseInt(hexColor.substring(3, 5), 16)
    let B = parseInt(hexColor.substring(5, 7), 16)

    R = parseInt((R * (100 + percent)) / 100 + "")
    G = parseInt((G * (100 + percent)) / 100 + "")
    B = parseInt((B * (100 + percent)) / 100 + "")

    R = R < 255 ? R : 255
    G = G < 255 ? G : 255
    B = B < 255 ? B : 255

    const RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16)
    const GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16)
    const BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16)

    return "#" + RR + GG + BB
}

export const getRandomArbitrary = (min: number, max: number): number => {
    return Math.random() * (max - min) + min
}

export const numFormatter = (num: number) => {
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1) + "K"
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(1) + "M"
    } else if (num < 900) {
        return num + ""
    }
}

export const supFormatter = (num: string, fixedAmount: number | undefined = 0): string => {
    const supTokens = new BigNumber(num)
    if (supTokens.isZero()) return supTokens.toFixed(fixedAmount)

    const a = !fixedAmount || fixedAmount == 0 ? 1 : fixedAmount * 10
    return (Math.floor(supTokens.dividedBy(new BigNumber("1000000000000000000")).toNumber() * a) / a).toFixed(
        fixedAmount,
    )
}
export const supFormatterNoFixed = (num: string, maxDecimals?: number): string => {
    const supTokens = new BigNumber(num).shiftedBy(-18)
    if (maxDecimals) {
        const split = supTokens.toString().split(".")
        if (split[1] ? split[1].length : 0 > maxDecimals) {
            if (supTokens.isZero()) return supTokens.toFixed(maxDecimals)
            return supTokens.toFormat(maxDecimals)
        }
    }
    if (supTokens.isZero()) return supTokens.toFixed()
    return supTokens.toFormat()
}

export const parseString = (val: string | null, defaultVal: number): number => {
    if (!val) return defaultVal

    return parseFloat(val)
}

export const getObjectFromArrayByKey = (array: any[], idValue: string, idName = "id") => {
    for (let i = 0; i < array.length; i++) {
        if (array[i][idName] === idValue) {
            return array[i]
        }
    }
    return undefined
}

export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1) // deg2rad below
    const dLon = deg2rad(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
}

// Converts numeric degrees to radians
export const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180)
}

// Converts numeric degrees to radians
export const rad2Deg = (rad: number): number => {
    return rad * (180 / Math.PI)
}

export const clamp = (min: number, value: number, max: number) => {
    return Math.min(Math.max(value, min), max)
}

export function acronym(s: string): string {
    const x = s.match(/\b(\w)/g)
    if (!x) {
        return ""
    }
    return x.join("").toUpperCase()
}

export const hexToRGB = (hex: string, alpha?: number): string => {
    const h = "0123456789ABCDEF"
    const r = h.indexOf(hex[1]) * 16 + h.indexOf(hex[2])
    const g = h.indexOf(hex[3]) * 16 + h.indexOf(hex[4])
    const b = h.indexOf(hex[5]) * 16 + h.indexOf(hex[6])
    if (alpha) return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")"
    else return "rgb(" + r + ", " + g + ", " + b + ")"
}

export const getRarityDeets = (rarityKey: string): { label: string; color: string } => {
    switch (rarityKey) {
        case "COLOSSAL":
            return { label: "Colossal", color: colors.rarity.COLOSSAL }
        case "RARE":
            return { label: "Rare", color: colors.rarity.RARE }
        case "LEGENDARY":
            return { label: "Legendary", color: colors.rarity.LEGENDARY }
        case "ELITE_LEGENDARY":
            return { label: "Elite Legendary", color: colors.rarity.ELITE_LEGENDARY }
        case "ULTRA_RARE":
            return { label: "Ultra Rare", color: colors.rarity.ULTRA_RARE }
        case "EXOTIC":
            return { label: "Exotic", color: colors.rarity.EXOTIC }
        case "GUARDIAN":
            return { label: "Guardian", color: colors.rarity.GUARDIAN }
        case "MYTHIC":
            return { label: "Mythic", color: colors.rarity.MYTHIC }
        case "DEUS_EX":
            return { label: "Deus Ex", color: colors.rarity.DEUS_EX }
        case "TITAN":
            return { label: "Titan", color: colors.rarity.TITAN }
        case "MEGA":
            return { label: "Mega", color: colors.rarity.MEGA }
        default:
            return { label: "", color: colors.rarity.MEGA }
    }
}

export const getMutiplierDeets = (multiplierKey: string): { image: string; description: string } => {
    let image
    let description

    switch (multiplierKey.toLowerCase()) {
        case "citizen":
            image = MultiplierCitizen
            description = "When a player is within the top 80% of voting average."
            break
        case "supporter":
            image = MultiplierSupporter
            description = "When a player is within the top 50% of voting average."
            break
        case "contributor":
            image = MultiplierSuperContributor
            description = "When a player is within the top 75% of voting average."
            break
        case "super contributor":
            image = MultiplierContributor
            description = "When a player is within the top 10% of voting average."
            break
        case "a fool and his money":
            image = MultiplierAFoolAndHisMoney
            description = "For a player who has put the most individual SUPS in to vote but still lost."
            break
        case "air support":
            image = MultiplierAirSupport
            description = "For a player who won an airstrike."
            break
        case "now i am become death":
            image = MultiplierNowIAmBecomeDeath
            description = "For a player who won a nuke."
            break
        case "destroyer of worlds":
            image = MultiplierDestroyerOfWorlds
            description = "For a player who has won the previous three nukes."
            break
        case "grease monkey":
            image = MultiplierGreaseMonkey
            description = "For a player who won a repair drop."
            break
        case "field mechanic":
            image = MultiplierFieldMechanic
            description = "For a player who has won the previous three repair drops."
            break
        case "combo breaker":
            image = MultiplierFieldMechanic
            description = "For a player who wins the vote for their syndicate after it has lost the last three rounds."
            break
        case "mech commander":
            image = MultiplierMechCommander
            description = "When a player's mech wins the battles."
            break
        case "admiral":
            image = MultiplierAdmiral
            description = "When a player's mech wins the last 3 battles."
            break
        case "fiend":
            image = MultiplierFiend
            description = "3 hours of active playing."
            break
        case "juke-e":
            image = MultiplierJunkE
            description = "6 hours of active playing."
            break
        case "mech head":
            image = MultiplierMechHead
            description = "10 hours of active playing."
            break
        case "sniper":
            image = MultiplierSniper
            description = "For a player who has won the vote by dropping in big."
            break
        case "won battle":
            image = MultiplierWonBattle
            description = "When a player's syndicate has won the last."
            break
        case "won last three battles":
            image = MultiplierWonLastThreeBattles
            description = "When a player's syndicate has won the last 3 battles."
            break
        case "offline":
        case "applause":
        case "picked location":
        case "battlerewardupdate":
        case "supsmultiplierget":
        case "checkmultiplierupdate":
        case "supstick":
        default:
            image = MultiplierCitizen
            description = multiplierKey
            break
    }

    return { image, description }
}
