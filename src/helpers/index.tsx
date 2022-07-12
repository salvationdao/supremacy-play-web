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
import { MysteryCrateType, Rarity, UserRank } from "../types"

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
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + "B"
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K"
    }
    return num + ""
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

export const getRarityDeets = (rarityKey: string): Rarity => {
    switch (rarityKey) {
        case "COLOSSAL":
            return { label: "Colossal", color: colors.rarity.COLOSSAL, textColor: "#FFFFFF" }
        case "RARE":
            return { label: "Rare", color: colors.rarity.RARE, textColor: "#FFFFFF" }
        case "LEGENDARY":
            return { label: "Legendary", color: colors.rarity.LEGENDARY, textColor: "#FFFFFF" }
        case "ELITE_LEGENDARY":
            return { label: "Elite Legendary", color: colors.rarity.ELITE_LEGENDARY, textColor: "#FFFFFF" }
        case "ULTRA_RARE":
            return { label: "Ultra Rare", color: colors.rarity.ULTRA_RARE, textColor: "#FFFFFF" }
        case "EXOTIC":
            return { label: "Exotic", color: colors.rarity.EXOTIC, textColor: "#FFFFFF" }
        case "GUARDIAN":
            return { label: "Guardian", color: colors.rarity.GUARDIAN, textColor: "#FFFFFF" }
        case "MYTHIC":
            return { label: "Mythic", color: colors.rarity.MYTHIC, textColor: "#000000" }
        case "DEUS_EX":
            return { label: "Deus Ex", color: colors.rarity.DEUS_EX, textColor: "#000000" }
        case "TITAN":
            return { label: "Titan", color: colors.rarity.TITAN, textColor: "#000000" }
        case "MEGA":
            return { label: "Mega", color: colors.rarity.MEGA, textColor: "#FFFFFF" }
        default:
            return { label: "", color: colors.rarity.MEGA, textColor: "#FFFFFF" }
    }
}

export const getMultiplierDeets = (multiplierKey: string): { image: string } => {
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

export const dateFormatter = (date: Date, showSeconds?: boolean, showDate?: boolean): string => {
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const day = date.getDate()
    const month = date.getMonth()

    // Check whether AM or PM
    const suffix = hours >= 12 ? "PM" : "AM"

    // Find current hour in AM-PM Format
    hours = hours % 12

    // To display "0" as "12"
    hours = hours ? hours : 12
    const minutes2 = minutes < 10 ? "0" + minutes : minutes
    const seconds2 = seconds < 10 ? "0" + seconds : seconds

    if (showSeconds) return `${hours}:${minutes2}:${seconds2} ${suffix}`

    if (showDate) return `${hours}:${minutes2} ${suffix} ${day}/${month}`

    return `${hours}:${minutes2} ${suffix}`
}

export const snakeToTitle = (str: string, lowerCase?: boolean): string => {
    const result = str.split("_").join(" ")
    if (lowerCase) return result
    return Capitalize(result)
}

export const snakeToSlug = (str: string): string => {
    return str.split("_").join("-").toLowerCase()
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
            desc = 'User has achieved previous rank "Corporal" and contributed top 20% of ability kills for their Faction in the past 7 days.'
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

// Calculates the difference between two dates in different units (days, hours etc.)
export const timeDiff = (
    fromDate: Date,
    toDate: Date,
): {
    total: number
    days: number
    hours: number
    minutes: number
    seconds: number
} => {
    const total = toDate.getTime() - fromDate.getTime()
    const seconds = Math.floor(total / 1000)
    const minutes = Math.floor(total / 1000 / 60)
    const hours = Math.floor(total / (1000 * 60 * 60))
    const days = Math.floor(total / (1000 * 60 * 60 * 24))

    return {
        total,
        days,
        hours,
        minutes,
        seconds,
    }
}

// Calculates the time difference between two dates in days, hours minutes etc.
export const timeSince = (
    fromDate: Date,
    toDate: Date,
): {
    total: number
    days: number
    hours: number
    minutes: number
    seconds: number
} => {
    const total = toDate.getTime() - fromDate.getTime()
    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
    const days = Math.floor(total / (1000 * 60 * 60 * 24))

    return {
        total,
        days,
        hours,
        minutes,
        seconds,
    }
}

export const timeSinceInWords = (fromDate: Date, toDate: Date): string => {
    const { days, hours, minutes, seconds } = timeSince(fromDate, toDate)

    let result = days > 0 ? days + " day" + (days === 1 ? "" : "s") : ""
    result = (result ? result + " " : "") + (hours > 0 ? hours + " hour" + (hours === 1 ? "" : "s") : "")

    // Return result if more than a day, else too long
    if (days > 0) return result

    result = (result ? result + " " : "") + (minutes > 0 ? minutes + " minute" + (minutes === 1 ? "" : "s") : "")

    // Return result if more than a day, else too long
    if (hours > 0) return result

    result = (result ? result + " " : "") + (seconds > 0 ? seconds + " second" + (seconds === 1 ? "" : "s") : "")
    return result
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

    // Spreading string for proper emoji separation-ignoring spaces that can appear between emojis and mess everything up
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

export const calculateDutchAuctionCurrentPrice = ({ createdAt, dropRate, startPrice }: { createdAt: Date; dropRate?: BigNumber; startPrice: BigNumber }) => {
    if (!dropRate) return startPrice
    return startPrice.minus(dropRate.multipliedBy(timeDiff(createdAt, new Date()).minutes))
}

export const calculateDutchAuctionEndPrice = ({ endAt, dropRate, startPrice }: { endAt: Date; dropRate?: number; startPrice: number }) => {
    if (!dropRate) return startPrice
    return Math.max(startPrice - dropRate * timeDiff(new Date(), endAt).minutes, 1)
}

export const getWeaponTypeColor = (weaponType: string | undefined) => {
    if (!weaponType) return colors.neonBlue

    switch (weaponType.toUpperCase()) {
        case "CANNON":
            return colors.green
        case "SWORD":
            return colors.red
        case "MINIGUN":
            return colors.yellow
        case "MISSILE LAUNCHER":
            return colors.purple
        case "PLASMA GUN":
            return colors.blue
        case "SNIPER RIFLE":
            return colors.orange
        default:
            return colors.neonBlue
    }
}

export const getWeaponDamageTypeColor = (damageType: string | undefined) => {
    if (!damageType) return colors.neonBlue

    switch (damageType.toUpperCase()) {
        case "KINETIC":
            return colors.blue2
        case "EXPLOSIVE":
            return colors.orange
        case "ENERGY":
            return colors.gold
        default:
            return colors.neonBlue
    }
}
