import { Box } from "@mui/system"
import { SvgChat, SvgRepair } from "../assets"
import { LiveChat } from "../components/RightDrawer/LiveChat/LiveChat"
import { PlayerList } from "../components/RightDrawer/PlayerList/PlayerList"

import { MyLobbies } from "../components/RightDrawer/MyLobbies/MyLobbies"
import { RepairJobs } from "../components/RightDrawer/RepairJobs/RepairJobs"
import { colors } from "../theme/theme"
import { SideTabsStruct } from "./leftDrawerRoutes"

export const RIGHT_DRAWER_MAP: { [name: string]: SideTabsStruct } = {
    live_chat: {
        id: "live_chat",
        icon: <SvgChat size="1.1rem" sx={{ pt: ".3rem" }} />,
        label: "Live Chat",
        Component: LiveChat,
        requireAuth: false,
        matchRouteIDs: undefined,
        mountAllTime: true,
    },
    active_players: {
        id: "active_players",
        icon: (
            <Box sx={{ pb: ".2rem" }}>
                <Box sx={{ width: ".9rem", height: ".9rem", borderRadius: "50%", backgroundColor: colors.green }} />
            </Box>
        ),
        label: "Active Players",
        Component: PlayerList,
        requireAuth: true,
        matchRouteIDs: undefined,
        mountAllTime: false,
    },
    repairs: {
        id: "repairs",
        icon: <SvgRepair size="1.1rem" sx={{ pt: ".3rem" }} />,
        label: "Repairs Jobs",
        Component: RepairJobs,
        requireAuth: true,
        matchRouteIDs: undefined,
        mountAllTime: false,
    },
    my_lobbies: {
        id: "my_lobbies",
        icon: <SvgRepair size="1.1rem" sx={{ pt: ".3rem" }} />,
        label: "My Lobbies",
        Component: MyLobbies,
        requireAuth: true,
        matchRouteIDs: undefined,
        mountAllTime: false,
    },
}

export const RIGHT_DRAWER_ARRAY: SideTabsStruct[] = []
for (const [, value] of Object.entries(RIGHT_DRAWER_MAP)) {
    RIGHT_DRAWER_ARRAY.push(value)
}
