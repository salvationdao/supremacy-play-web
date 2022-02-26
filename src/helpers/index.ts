import BigNumber from 'bignumber.js'

// Capitalize convert a string "example" to "Example"
export const Capitalize = (str: string): string => str[0].toUpperCase() + str.substring(1).toLowerCase()

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export const isObject = (item: any) => {
    return item && typeof item === 'object' && !Array.isArray(item)
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

    R = parseInt((R * (100 + percent)) / 100 + '')
    G = parseInt((G * (100 + percent)) / 100 + '')
    B = parseInt((B * (100 + percent)) / 100 + '')

    R = R < 255 ? R : 255
    G = G < 255 ? G : 255
    B = B < 255 ? B : 255

    const RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16)
    const GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16)
    const BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16)

    return '#' + RR + GG + BB
}

export const getRandomArbitrary = (min: number, max: number): number => {
    return Math.random() * (max - min) + min
}

export const supFormatter = (num: BigNumber): string => {
    // sups have 18 decimal places, divide by 1,000,000,000,000,000,000
    return num.dividedBy(new BigNumber('1000000000000000000')).toFixed()
}

export const parseString = (val: string | null, defaultVal: number): number => {
    if (!val) return defaultVal

    return parseInt(val)
}

export const getObjectFromArrayByKey = (array: any[], idValue: string, idName = 'id') => {
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