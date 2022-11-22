import { SxProps } from "@mui/material"
import BigNumber from "bignumber.js"
import emojiRegex from "emoji-regex"
import moment from "moment"
import { VoidFunctionComponent } from "react"
import {
    SafePNG,
    SvgCorporal,
    SvgGeneral,
    SvgIntroAnimation,
    SvgNewRecruit,
    SvgOutroAnimation,
    SvgPowerCore,
    SvgPrivate,
    SvgSkin,
    SvgUtilities,
    SvgWeapons,
    SvgWrapperProps,
} from "../assets"
import { colors } from "../theme/theme"
import {
    AssetItemType,
    Dimension,
    GAME_CLIENT_TILE_SIZE,
    MechStatusEnum,
    MysteryCrateType,
    NewMechStruct,
    Rarity,
    RarityEnum,
    UserRank,
    WeaponType,
} from "../types"
import { FiatOrderStatus } from "../types/fiat"

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
    const targetClone = { ...target }
    return mergeInPlace(targetClone, ...sources)
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const mergeInPlace = (target: any, ...sources: any): any => {
    if (!sources.length) return target
    const source = sources.shift()

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} })
                mergeInPlace(target[key], source[key])
            } else {
                Object.assign(target, { [key]: source[key] })
            }
        }
    }

    return mergeInPlace(target, ...sources)
}

export const shadeColor = (hexColor: string, factor: number) => {
    const hex = hexColor.toUpperCase()

    let R = parseInt(hex.substring(1, 3), 16)
    let G = parseInt(hex.substring(3, 5), 16)
    let B = parseInt(hex.substring(5, 7), 16)

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

export const getRandomFloat = (min: number, max: number): number => {
    return Math.random() * (max - min) + min
}

// Inclusive of min and max
export const getRandomIntInclusive = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
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

export const supFormatter = (num: string, maxDecimals?: number): string => {
    const supTokens = new BigNumber(num).shiftedBy(-18)
    if (maxDecimals !== undefined) {
        const split = supTokens.toString().split(".")
        if (split[1] ? split[1].length : 0 >= maxDecimals) {
            if (supTokens.isZero()) return supTokens.toFixed(maxDecimals)
            return supTokens.toFormat(maxDecimals)
        }
    }
    if (supTokens.isZero()) return supTokens.toFixed()
    return supTokens.toFormat()
}

export const parseString = (val: number | string | null | undefined, defaultVal: number): number => {
    try {
        if (!val) return defaultVal
        return parseFloat(`${val}`)
    } catch (err) {
        return defaultVal
    }
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

export const hexToRGB = (hexx: string) => {
    const hex = hexx.toUpperCase()

    const h = "0123456789ABCDEF"
    const r = h.indexOf(hex[1]) * 16 + h.indexOf(hex[2])
    const g = h.indexOf(hex[3]) * 16 + h.indexOf(hex[4])
    const b = h.indexOf(hex[5]) * 16 + h.indexOf(hex[6])
    return { r, g, b }
}

export const getRarityDeets = (rarityKey: string): Rarity => {
    switch (rarityKey) {
        case RarityEnum.Mega:
            return { label: "Mega", color: colors.rarity.MEGA, textColor: "#FFFFFF", rank: 11 }
        case RarityEnum.Colossal:
            return { label: "Colossal", color: colors.rarity.COLOSSAL, textColor: "#FFFFFF", rank: 10 }
        case RarityEnum.Rare:
            return { label: "Rare", color: colors.rarity.RARE, textColor: "#FFFFFF", rank: 9 }
        case RarityEnum.Legendary:
            return { label: "Legendary", color: colors.rarity.LEGENDARY, textColor: "#FFFFFF", rank: 8 }
        case RarityEnum.EliteLegendary:
            return { label: "Elite Legendary", color: colors.rarity.ELITE_LEGENDARY, textColor: "#FFFFFF", rank: 7 }
        case RarityEnum.UltraRare:
            return { label: "Ultra Rare", color: colors.rarity.ULTRA_RARE, textColor: "#FFFFFF", rank: 6 }
        case RarityEnum.Exotic:
            return { label: "Exotic", color: colors.rarity.EXOTIC, textColor: "#FFFFFF", rank: 5 }
        case RarityEnum.Guardian:
            return { label: "Guardian", color: colors.rarity.GUARDIAN, textColor: "#FFFFFF", rank: 4 }
        case RarityEnum.Mythic:
            return { label: "Mythic", color: colors.rarity.MYTHIC, textColor: "#000000", rank: 3 }
        case RarityEnum.DeusEx:
            return { label: "Deus Ex", color: colors.rarity.DEUS_EX, textColor: "#000000", rank: 2 }
        case RarityEnum.Titan:
            return { label: "Titan", color: colors.rarity.TITAN, textColor: "#000000", rank: 1 }
        default:
            return { label: "", color: colors.rarity.MEGA, textColor: "#FFFFFF", rank: 100 }
    }
}

export const getOrderStatusDeets = (key: string) => {
    switch (key) {
        case FiatOrderStatus.Pending:
            return { label: "Pending", color: colors.lightNeonBlue, textColor: "#FFFFFF" }
        case FiatOrderStatus.Refunded:
            return { label: "Refunded", color: colors.red, textColor: "#FFFFFF" }
        default:
            return { label: "Paid", color: colors.green, textColor: "#FFFFFF" }
    }
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

export const getMechStatusDeets = (status?: MechStatusEnum) => {
    let color = colors.darkGrey
    let label = "UNKNOWN"

    switch (status) {
        case MechStatusEnum.Idle:
            label = "IDLE"
            color = colors.green
            break
        case MechStatusEnum.Queue:
            label = "IN LOBBY"
            color = colors.yellow
            break
        case MechStatusEnum.Battle:
            label = "BATTLING"
            color = colors.orange
            break
        case MechStatusEnum.Market:
            label = "LISTED"
            color = colors.red
            break
        case MechStatusEnum.Sold:
            label = "SOLD"
            color = colors.lightGrey
            break
        case MechStatusEnum.Damaged:
            label = "DAMAGED"
            color = colors.bronze
            break
    }
    return { color, label }
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
        case MysteryCrateType.Mech:
            image = SafePNG
            label = "WAR MACHINE CRATE"
            desc = "Get a random war machine to participate in the battle arena."
            break
        case MysteryCrateType.Weapon:
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
    totalSeconds: number
    days: number
    hours: number
    minutes: number
    seconds: number
} => {
    const total = toDate.getTime() - fromDate.getTime()
    const totalSeconds = total / 1000
    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
    const days = Math.floor(total / (1000 * 60 * 60 * 24))

    return {
        totalSeconds,
        days,
        hours,
        minutes,
        seconds,
    }
}

export const timeSinceInWords = (fromDate: Date, toDate: Date, abbreviated = false): string => {
    const { days, hours, minutes, seconds } = timeSince(fromDate, toDate)

    let result = days > 0 ? days + (abbreviated ? "d" : " day") + (days === 1 || abbreviated ? "" : "s") : ""
    result = (result ? result + " " : "") + (hours > 0 ? hours + (abbreviated ? "h" : " hour") + (hours === 1 || abbreviated ? "" : "s") : "")

    // Return result if more than a day, else too long
    if (days > 0) return result

    result = (result ? result + " " : "") + (minutes > 0 ? minutes + (abbreviated ? "m" : " minute") + (minutes === 1 || abbreviated ? "" : "s") : "")

    // Return result if more than a day, else too long
    if (hours > 0) return result

    result = (result ? result + " " : "") + (seconds > 0 ? seconds + (abbreviated ? "s" : " second") + (seconds === 1 || abbreviated ? "" : "s") : "")
    return result
}

export const secondsToWords = (secondsLeft: number) => {
    return timeSinceInWords(new Date(), new Date(new Date().getTime() + secondsLeft * 1000))
}

export const camelToTitle = (str: string) => {
    const result = str.replace(/([A-Z])/g, " $1")
    return result.charAt(0).toUpperCase() + result.slice(1)
}

export const EMOJI_REGEX = emojiRegex()

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
        isCharEmojiArray.push(!!c.match(EMOJI_REGEX) || !!c.match(/[\uD83C][\uDDE6-\uDDFF]/))
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

export const getPowerCoreSizeColor = (powerCoreSize: string | undefined) => {
    if (!powerCoreSize) return colors.neonBlue

    switch (powerCoreSize.toUpperCase()) {
        case "SMALL":
            return colors.yellow
        case "MEDIUM":
            return colors.blue
        case "LARGE":
            return colors.purple
        default:
            return colors.neonBlue
    }
}

export const getUtilityTypeColor = (utilityType: string | undefined) => {
    if (!utilityType) return colors.neonBlue

    switch (utilityType.toUpperCase()) {
        case "SHIELD":
            return colors.shield
        case "ATTACK DRONE":
            return colors.red
        case "REPAIR DRONE":
            return colors.green
        case "ANTI MISSILE":
            return colors.black2
        case "ACCELERATOR":
            return colors.silver
        default:
            return colors.neonBlue
    }
}

export const getWeaponTypeColor = (weaponType: WeaponType | undefined) => {
    if (!weaponType) return colors.neonBlue

    switch (weaponType) {
        case WeaponType.Cannon:
            return colors.green
        case WeaponType.Sword:
            return colors.red
        case WeaponType.Minigun:
            return colors.blue
        case WeaponType.MissileLauncher:
            return colors.orange
        case WeaponType.RocketPods:
            return colors.orange
        case WeaponType.GrenadeLauncher:
            return colors.orange
        case WeaponType.MachineGun:
            return colors.blue
        case WeaponType.PlasmaGun:
            return colors.purple
        case WeaponType.SniperRifle:
            return colors.blue
        case WeaponType.Rifle:
            return colors.blue
        case WeaponType.Flak:
            return colors.orange
        case WeaponType.LaserBeam:
            return colors.purple
        case WeaponType.LightningGun:
            return colors.purple
        case WeaponType.BFG:
            return colors.orange
        case WeaponType.Flamethrower:
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

export const closestAngle = (from: number, to: number) => from + ((((to - from) % 360) + 540) % 360) - 180

export const getAssetItemDeets = (
    assetItemType?: AssetItemType,
): { icon: VoidFunctionComponent<SvgWrapperProps> | null; color: string; label: string; subRoute: string } => {
    let icon = null
    let color = ""
    let label = ""
    let subRoute = ""

    if (!assetItemType) return { icon, color, label, subRoute }

    switch (assetItemType) {
        case AssetItemType.Mech:
            subRoute = "mech"
            break
        case AssetItemType.Weapon:
            icon = SvgWeapons
            color = colors.weapons
            label = "Weapon"
            subRoute = "weapon"
            break
        case AssetItemType.MechSkin:
            icon = SvgSkin
            color = colors.chassisSkin
            label = "Mech Skin"
            break
        case AssetItemType.WeaponSkin:
            icon = SvgSkin
            color = colors.chassisSkin
            label = "Weapon Skin"
            break
        case AssetItemType.PowerCore:
            icon = SvgPowerCore
            color = colors.powerCore
            label = "Power Core"
            break
        case AssetItemType.Utility:
            icon = SvgUtilities
            color = colors.utilities
            label = "Utility"
            break
        case AssetItemType.IntroAnimation:
            icon = SvgIntroAnimation
            color = colors.introAnimation
            label = "Intro Animation"
            break
        case AssetItemType.OutroAnimation:
            icon = SvgOutroAnimation
            color = colors.outroAnimation
            label = "Outro Animation"
            break
    }

    return { icon, color, label, subRoute }
}

export const generatePriceText = (currency: string, cents: string | BigNumber) => {
    if (typeof cents === "string") {
        cents = new BigNumber(cents)
    }

    const totalDollars = cents.div(100).toNumber()
    const remainingCents = cents.mod(100).toNumber()

    return `${currency} ${totalDollars}.${remainingCents < 10 ? `0${remainingCents}` : remainingCents}`
}

// Converts number to alphabet letter like excel spreadsheet columns. E.g. 0 -> "A", 27 -> AA
export const intToLetter = (i: number) => {
    let temp,
        letter = ""
    while (i > 0) {
        temp = (i - 1) % 26
        letter = String.fromCharCode(temp + 65) + letter
        i = (i - temp - 1) / 26
    }
    return letter
}

export const autoTextColor = (hex: string) => {
    const rgb = hexToRGB(hex)

    if (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 150) {
        return "#000000"
    } else {
        return "#FFFFFF"
    }
}

export const convertCellsToGameLocation = (x: number, y: number, mapLeft: number, mapTop: number) => {
    const gameClientTileSize = GAME_CLIENT_TILE_SIZE
    return {
        x: x * gameClientTileSize + gameClientTileSize / 2 + mapLeft,
        y: y * gameClientTileSize + gameClientTileSize / 2 + mapTop,
    }
}

export const diff = (a: number, b: number) => (a > b ? a - b : b - a)

// Adjusts dimensions so that the smallest side fits in a parent dimension, and keeping aspect ratio
// E.g 1. dimension: = (100, 40), parent dimension = (80, 80), returns (200, 80).
// E.g 2. dimension: = (80, 100), parent dimension = (40, 40), returns (40, 50).
export const calculateCoverDimensions = (dimensions: Dimension, containerDimensions: Dimension): Dimension => {
    const ratio = dimensions.height / dimensions.width
    const result = { ...dimensions }

    result.width = containerDimensions.width
    result.height = containerDimensions.width * ratio

    if (result.height < containerDimensions.height) {
        result.height = containerDimensions.height
        result.width = containerDimensions.height / ratio
    }

    return result
}

// Adjusts dimensions so that the largest side fits in a parent dimension, and keeping aspect ratio
// E.g 1. dimension: = (100, 40), parent dimension = (80, 80), returns (80, 32).
// E.g 2. dimension: = (80, 100), parent dimension = (40, 40), returns (20, 40).
export const calculateContainDimensions = (dimensions: Dimension, containerDimensions: Dimension): Dimension => {
    const ratio = dimensions.height / dimensions.width
    const result = { ...dimensions }

    result.width = containerDimensions.width
    result.height = containerDimensions.width * ratio

    if (result.height > containerDimensions.height) {
        result.height = containerDimensions.height
        result.width = containerDimensions.height / ratio
    }

    return result
}

export const HEXToVBColor = (hex: string): number => {
    return parseInt(hex.substring(hex.length - 6), 16)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepEqual = (object1: Record<any, any>, object2: Record<any, any>) => {
    const keys1 = Object.keys(object1)
    const keys2 = Object.keys(object2)
    if (keys1.length !== keys2.length) {
        return false
    }
    for (const key of keys1) {
        const val1 = object1[key]
        const val2 = object2[key]
        const areObjects = isObject(val1) && isObject(val2)
        if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
            return false
        }
    }
    return true
}

export const shortCodeGenerator = (length: number = 12, omitUppercase?: boolean, omitLowerCase?: boolean, omitNumber?: boolean): string => {
    let result = ""
    let base = ""
    if (!omitUppercase) base += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (!omitLowerCase) base += "abcdefghijklmnopqrstuvwxyz"
    if (!omitNumber) base += "0123456789"
    for (let i = 0; i < length; i++) {
        result += base.charAt(Math.floor(Math.random() * base.length))
    }
    return result
}

export const combineDateTime = (date: moment.Moment, time: moment.Moment): moment.Moment => {
    return moment(`${date.format("YYYY-MM-DD")} ${time.format("HH:mm")}`)
}

// Checks if given number is between two other numbers
export const isInBetweenInclusive = (num: number, between1: number, between2: number) => {
    return num >= Math.min(between1, between2) && num <= Math.max(between1, between2)
}

export const isExternalURL = (url: string) => {
    try {
        return new URL(url).origin !== location.origin
    } catch {
        return false
    }
}

// Converts { 1: "1px 2px", 2: "5px 8px" } top clipPath css string: "polygon(1px 2px, 5px 8px)"
export const objectToPolygonClipPath = (config: { [seq: number]: string }) => {
    const sorted = Object.entries(config)
        .sort((a, b) => (parseInt(a[0]) > parseInt(b[0]) ? 1 : -1))
        .map((c) => c[1])
    return `polygon(${sorted.join(", ")})`
}

// Converts milliseconds to: days, hours, minutes, seconds,  => all sum to total the original milliseconds
export const msToTime = (ms: number) => {
    const days = Math.floor(ms / 1000 / 60 / 60 / 24)
    const hours = Math.floor(ms / 1000 / 60 / 60) - days * 24
    const minutes = Math.floor(ms / 1000 / 60) - days * 24 * 60 - hours * 60
    const seconds = Math.floor(ms / 1000) - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60
    return { days, hours, minutes, seconds }
}

export const truncateAddress = (addr: string): string => {
    const first = addr.substring(0, 6)
    const last = addr.substring(addr.length - 5)
    return `${first}...${last}`
}

export const noop = () => {
    return
}

export const isBrowser = typeof window !== "undefined"

export const truncateTextLines = (numLines = 1, isInline = false): SxProps => ({
    display: isInline ? "-webkit-inline-box" : "-webkit-box",
    overflow: "hidden",
    overflowWrap: "anywhere",
    textOverflow: "ellipsis",
    WebkitLineClamp: numLines,
    WebkitBoxOrient: "vertical",
})

// Return true, if a mech has equipped a power core and more than one weapon
export const isMechDeployable = (mech: NewMechStruct): boolean => {
    // Check power core
    if (!mech.power_core) return false

    // Check weapon count
    let hasWeapon = false
    mech.weapon_slots?.forEach((weaponSlot) => {
        // Skip, if already has weapon
        if (hasWeapon) return

        // Check whether the mech has weapon equipped
        hasWeapon = !!weaponSlot.weapon
    })

    return hasWeapon
}
