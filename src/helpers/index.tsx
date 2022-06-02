import BigNumber from "bignumber.js"
import emojiRegex from "emoji-regex"
import {
    MultiplierAdmiral,
    MultiplierAFoolAndHisMoney,
    MultiplierAirMarshal,
    MultiplierAirSupport,
    MultiplierContributor,
    MultiplierDestroyerOfWorlds,
    MultiplierFieldMechanic,
    MultiplierGeneric,
    MultiplierGreaseMonkey,
    MultiplierJunkE,
    MultiplierMechCommander,
    MultiplierMechHead,
    MultiplierNowIAmBecomeDeath,
    MultiplierSniper,
    MultiplierWonBattle,
    MultiplierWonLastThreeBattles,
    SafePNG,
    SvgCorporal,
    SvgGeneral,
    SvgNewRecruit,
    SvgPrivate,
    SvgWrapperProps,
} from "../assets"
import { colors } from "../theme/theme"
import { MysteryCrateType, UserRank } from "../types"

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

export const shadeColor = (hexColor: string, factor: number) => {
    let R = parseInt(hexColor.substring(1, 3), 16)
    let G = parseInt(hexColor.substring(3, 5), 16)
    let B = parseInt(hexColor.substring(5, 7), 16)

    R = parseInt((R * (100 + factor)) / 100 + "")
    G = parseInt((G * (100 + factor)) / 100 + "")
    B = parseInt((B * (100 + factor)) / 100 + "")

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
        case "contributor":
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
        case "air marshal":
            image = MultiplierAirMarshal
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
            image = MultiplierGeneric
            break
    }

    return { image }
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
            desc = 'User has achieved previous rank "Private" and has at least 1 ability kill.'
            break
        case "GENERAL":
            icon = <SvgGeneral width={width} height={height} />
            title = "GENERAL"
            desc = 'User has achieved previous rank "Corporal" and contributed top 20% of ability kills for their Syndicate in the past 7 days.'
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

export const getMysteryCrateDeets = (mysteryCrateType: MysteryCrateType): { image: string; label: string; desc: string } => {
    let image = SafePNG
    let label = "MYSTERY CRATE"
    let desc = "Open a mystery crate to receive random weapon / war machine!"

    switch (mysteryCrateType) {
        case "MECH":
            image = SafePNG
            label = "WAR MACHINE CRATE"
            desc = "Get a random war machine to participate in the battle arena."
            break
        case "WEAPON":
            image = SafePNG
            label = "WEAPON CRATE"
            desc = "Get a random weapon to equip onto your war machine."
            break
    }

    return { image, label, desc }
}

export const timeSince = (date: Date, dateToCompare?: Date) => {
    const seconds = Math.floor(((dateToCompare ? dateToCompare.getTime() : Date.now()) - date.getTime()) / 1000)

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

const regex = emojiRegex()

// Checks if the message contains all emojis and is less than the specified amount on characters
export const checkIfIsEmoji = (message: string) => {
    if (!message) return false
    const isCharEmojiArray: boolean[] = []
    const trimmedMsg = message.trim()

    // If message is long then don't bother
    if (trimmedMsg.length > 8) return false

    // Spreading string for proper emoji seperation-ignoring spaces that can appear between emojis and mess everything up
    const messageArray = [...trimmedMsg.replaceAll(" ", "")]

    messageArray.map((c) => {
        // Checking if char === invisible U+fe0f unicode- a specific code for emojis
        if (c === "️") {
            isCharEmojiArray.push(true)
            return
        }
        // Checks to see if each character matches the emoji regex from the library or a "regional indicator symbol letter" (apart of a flag emoji)
        isCharEmojiArray.push(!!c.match(regex) || !!c.match(/[\uD83C][\uDDE6-\uDDFF]/))
    })

    // Checks if the whole message is less than 8 character-some emojis can be 2+ characters and if all of them are emojis
    if (!isCharEmojiArray.includes(false)) {
        return true
    }
    return false
}

// Returns a random chat color for non faction users
export const getRandomColor = () => {
    let color = "#"
    for (let i = 0; i < 3; i++) color += ("0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)).slice(-2)
    return color
}

export const equalsIgnoreOrder = (a: unknown[], b: unknown[]) => {
    if (a.length !== b.length) return false
    const uniqueValues = new Set([...a, ...b])
    for (const v of uniqueValues) {
        const aCount = a.filter((e) => e === v).length
        const bCount = b.filter((e) => e === v).length
        if (aCount !== bCount) return false
    }
    return true
}

export const numberCommaFormatter = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
