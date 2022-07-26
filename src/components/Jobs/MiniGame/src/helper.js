export function get(module, key, defaultValue) {
    if (module.hasOwnProperty(key)) {
        return module[key]
    }
    return defaultValue
}
