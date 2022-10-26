import { Typography } from "@mui/material"
import React from "react"
import { useUI } from "../../../containers"
import { RouteSingle } from "../../../routes"
import { fonts } from "../../../theme/theme"
import { KeyboardKey } from "../../Common/KeyboardKey"
import { NiceButton } from "../../Common/Nice/NiceButton"

export const TabContentItem = React.memo(function TabContentItem({ route, index, totalItems }: { route: RouteSingle; index: number; totalItems: number }) {
    const { toggleShowMainMenu } = useUI()

    let spanColumn = 1
    if (index === 0) {
        // First one always span 2
        spanColumn = 2
    } else if (totalItems % 2 === 0 && index === 1) {
        // If even number of things, then also span the 2nd item
        spanColumn = 2
    } else if (totalItems % 2 !== 0 && index === 3) {
        // If odd number of things, span 4th item
        spanColumn = 2
    }

    return (
        <NiceButton
            route={{ to: route.path }}
            onClick={() => toggleShowMainMenu(false)}
            sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                backgroundColor: "#FFFFFF30",
                border: "none",
                background: `url(${route.showInMainMenu?.image})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "top center",
                backgroundSize: "cover",
                gridColumn: `span ${spanColumn}`,
            }}
        >
            <Typography sx={{ position: "absolute", top: "1.2rem", left: "1.3rem", fontFamily: fonts.nostromoBlack }}>{route.showInMainMenu?.label}</Typography>
            <KeyboardKey variant="body2" sx={{ position: "absolute", top: "1.1rem", right: "1.3rem" }} label={`${index + 1}`} />
        </NiceButton>
    )
})
