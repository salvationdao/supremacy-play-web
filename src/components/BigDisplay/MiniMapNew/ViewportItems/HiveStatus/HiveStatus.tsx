import { useGame } from "../../../../../containers"

const TheHiveMapName: string = "TheHive"

export const HiveStatus = () => {
    const { map } = useGame()

    if (!map || map.Name === TheHiveMapName) {
        return null
    }

    return null
}
