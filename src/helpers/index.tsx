import BigNumber from "bignumber.js"
import {
    MultiplierAdmiral,
    MultiplierAFoolAndHisMoney,
    MultiplierAirSupport,
    MultiplierCitizen,
    MultiplierContributor,
    MultiplierDestroyerOfWorlds,
    MultiplierFieldMechanic,
    MultiplierFiend,
    MultiplierGreaseMonkey,
    MultiplierJunkE,
    MultiplierMechCommander,
    MultiplierMechHead,
    MultiplierNowIAmBecomeDeath,
    MultiplierSniper,
    MultiplierSuperContributor,
    MultiplierSupporter,
    MultiplierWonBattle,
    MultiplierWonLastThreeBattles,
    SvgGeneral,
    SvgPrivate,
    SvgCorporal,
    SvgNewRecruit,
    SvgWrapperProps,
} from "../assets"
import { MultiplierGuide, UserRank } from "../types"
import { colors } from "../theme/theme"

// Capitalize convert a string "example" to "Example"
export const Capitalize = (str: string): string => str[0].toUpperCase() + str.substring(1).toLowerCase()

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const isObject = (item: any) => {
    return item && typeof item === "object" && !Array.isArray(item)
}

export const truncate = (str: string, n: number): string => {
    return str.length > n ? str.substring(0, n - 1) + "..." : str
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
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
    return (Math.floor(supTokens.dividedBy(new BigNumber("1000000000000000000")).toNumber() * a) / a).toFixed(fixedAmount)
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

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
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
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
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

export const getMutiplierDeets = (multiplierKey: string): { image: string } => {
    let image

    switch (multiplierKey.toLowerCase()) {
        case "citizen":
            image = MultiplierCitizen
            break
        case "supporter":
            image = MultiplierSupporter
            break
        case "contributor":
            image = MultiplierSuperContributor
            break
        case "super contributor":
            image = MultiplierContributor
            break
        case "a fool and his money":
            image = MultiplierAFoolAndHisMoney
            break
        case "air support":
            image = MultiplierAirSupport
            break
        case "now i am become death":
            image = MultiplierNowIAmBecomeDeath
            break
        case "destroyer of worlds":
            image = MultiplierDestroyerOfWorlds
            break
        case "grease monkey":
            image = MultiplierGreaseMonkey
            break
        case "field mechanic":
            image = MultiplierFieldMechanic
            break
        case "combo breaker":
            image = MultiplierFieldMechanic
            break
        case "mech commander":
            image = MultiplierMechCommander
            break
        case "admiral":
            image = MultiplierAdmiral
            break
        case "fiend":
            image = MultiplierFiend
            break
        case "junk-e":
            image = MultiplierJunkE
            break
        case "mech head":
            image = MultiplierMechHead
            break
        case "sniper":
            image = MultiplierSniper
            break
        case "won battle":
            image = MultiplierWonBattle
            break
        case "won last three battles":
            image = MultiplierWonLastThreeBattles
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
            break
    }

    return { image }
}

export const getMultiplierGuide = (multiplierKey: string): MultiplierGuide => {
    let description: string
    let title: string
    let amount: number
    let isMultiplicative = false
    let duration: number

    switch (multiplierKey.toLowerCase()) {
        case "supporter":
            title = multiplierKey
            amount = 5
            duration = 1
            description = `When a player is within the top 50% of ability $SUPS average.`
            break
        case "contributor":
            title = multiplierKey
            amount = 10
            duration = 1
            description = `When a player is within the top 25% of ability $SUPS average.`
            break
        case "super contributor":
            title = multiplierKey
            amount = 20
            duration = 1
            description = `When a player is within the top 10% of ability $SUPS average.`
            break
        case "a fool and his money":
            title = multiplierKey
            amount = 5
            duration = 1
            description = `A player who has put the most individual SUPS in but your Syndicate didn’t win the ability.`
            break
        case "air support":
            title = multiplierKey
            amount = 5
            duration = 1
            description = `For a player who triggered the last airstrike of the battle.`
            break
        case "air marshal":
            title = multiplierKey
            amount = 5
            duration = 1
            description = `For a player who triggered the last three airstrikes`
            break
        case "now i am become death":
            title = multiplierKey
            amount = 5
            duration = 1
            description = `For a player who triggered a nuke.`
            break
        case "destroyer of worlds":
            title = multiplierKey
            amount = 10
            duration = 1
            description = `For a player who has triggered the previous three nukes.`
            break
        case "grease monkey":
            title = multiplierKey
            amount = 3
            duration = 1
            description = `For a player who triggered a repair drop.`
            break
        case "field mechanic":
            title = multiplierKey
            amount = 5
            duration = 1
            description = `For a player who has triggered the previous three repair drops.`
            break
        case "combo breaker":
            title = multiplierKey
            amount = 5
            duration = 1
            description = `For a player who triggers an ability for their syndicate after it has lost the last 3 rounds.`
            break
        case "c-c-c-c-combo breaker":
            title = multiplierKey
            amount = 5
            duration = 3
            description = `For a player who triggers an ability for their syndicate after it has lost the last ten rounds.`
            break
        case "mech commander":
            title = multiplierKey
            amount = 5
            duration = 1
            description = `When a player’s mech wins the battles.`
            break
        case "admiral":
            title = multiplierKey
            amount = 10
            duration = 1
            description = `When a player’s mech wins the last 3 battles.`
            break
        case "won battle":
            title = multiplierKey
            amount = 5
            isMultiplicative = true
            duration = 1
            description = `When a player’s syndicate has won the last battle.`
            break
        case "won last three battles":
            title = multiplierKey
            amount = 10
            duration = 3
            description = `When a player’s syndicate has won the last 3 battles.`
            break
        case "citizen":
        default:
            title = multiplierKey
            amount = 2
            duration = 2
            description = `For a player whose syndicate won the battle and they are within the 95% of $SUPS spent. For a player whose syndicate did't win the battle but they are within the top 80% of $SUPS spent.`
            break
    }

    return { key: multiplierKey, title, description, amount, isMultiplicative, duration }
}

export const dateFormatter = (date: Date, showSeconds?: boolean): string => {
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    // Check whether AM or PM
    const suffix = hours >= 12 ? "PM" : "AM"

    // Find current hour in AM-PM Format
    hours = hours % 12

    // To display "0" as "12"
    hours = hours ? hours : 12
    const minutes2 = minutes < 10 ? "0" + minutes : minutes
    const seconds2 = seconds < 10 ? "0" + seconds : seconds

    if (showSeconds) return `${hours}:${minutes2}:${seconds2} ${suffix}`

    return `${hours}:${minutes2} ${suffix}`
}

export const snakeToTitle = (str: string, lowerCase?: boolean): string => {
    const result = str.split("_").join(" ")
    if (lowerCase) return result
    return Capitalize(result)
}

export const getUserRankDeets = (rank: UserRank, width: string, height: string): { icon: SvgWrapperProps; title: string; desc: string } => {
    let icon = null
    let title = ""
    let desc = ""

    switch (rank.toUpperCase()) {
        case "PRIVATE":
            icon = <SvgPrivate width={width} height={height} />
            title = "PRIVATE"
            desc = "User has joined Supremacy for more than 24 hours and has sent at least 1 chat message."
            break
        case "CORPORAL":
            icon = <SvgCorporal width={width} height={height} />
            title = "CORPORAL"
            desc = 'User has achieved "Private" and has least at 1 ability kill.'
            break
        case "GENERAL":
            icon = <SvgGeneral width={width} height={height} />
            title = "GENERAL"
            desc = 'User has achieved "Corporal" and contributed top 20% of ability kills for their Syndicate in the past 7 days.'
            break
        case "NEW_RECRUIT":
        default:
            icon = <SvgNewRecruit width={width} height={height} />
            title = "NEW RECRUIT"
            desc = "User has joined Supremacy less than 24 hours ago."
            break
    }

    return { icon, title, desc }
}

export const timeSince = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

    let interval = seconds / 31536000

    if (interval > 1) {
        return Math.floor(interval) + " years"
    }
    interval = seconds / 2592000
    if (interval > 1) {
        return Math.floor(interval) + " months"
    }
    interval = seconds / 86400
    if (interval > 1) {
        return Math.floor(interval) + " days"
    }
    interval = seconds / 3600
    if (interval > 1) {
        return Math.floor(interval) + " hours"
    }
    interval = seconds / 60
    if (interval > 1) {
        return Math.floor(interval) + " minutes"
    }
    return Math.floor(seconds) + " seconds"
}

export const camelToTitle = (str: string) => {
    const result = str.replace(/([A-Z])/g, " $1")
    return result.charAt(0).toUpperCase() + result.slice(1)
}
