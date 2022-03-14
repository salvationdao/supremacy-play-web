import { Box, Divider, IconButton, Stack } from "@mui/material"
import { ReactElement } from "react"
import { SvgHorizontalRuleSharpIcon } from "../../assets"
import { useBar, ActiveBars } from "../../containers"

interface BarExpandableProps {
    barName: keyof ActiveBars
    iconComponent: ReactElement
    children: ReactElement
    noDivider?: boolean
}

export const BarExpandable = ({ barName, iconComponent, children, noDivider }: BarExpandableProps) => {
    const { activeBars, toggleActiveBar } = useBar()

    const isActive = activeBars[barName]

    return (
        <>
            <Box
                sx={{
                    position: "relative",
                    width: "auto",
                    height: "100%",
                    overflow: "hidden",
                    maxWidth: isActive ? 1200 : 50,
                    transition: "all .3s",
                }}
                onClick={() => !isActive && toggleActiveBar(barName, true)}
            >
                <Stack
                    justifyContent="center"
                    sx={{
                        position: "relative",
                        height: "100%",
                        width: "100%",
                        opacity: isActive ? 1 : 0,
                        transition: "all .3s",
                    }}
                >
                    {children}
                    <IconButton
                        size="small"
                        disabled={!isActive}
                        sx={{ position: "absolute", top: -6, right: 0, color: "#FFFFFF", opacity: 0.07 }}
                        onClick={() => toggleActiveBar(barName, false)}
                    >
                        <SvgHorizontalRuleSharpIcon size="15px" />
                    </IconButton>
                </Stack>

                <Stack
                    direction="row"
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        flexShrink: 0,
                        transform: "translate(-50%, -50%)",
                        opacity: !isActive ? 1 : 0,
                        transition: "all .3s",
                        pointerEvents: isActive ? "none" : "all",
                    }}
                >
                    <IconButton
                        disabled={isActive}
                        sx={{ mr: 0.5, color: "#FFFFFF", flexShrink: 0 }}
                        onClick={() => toggleActiveBar(barName, true)}
                    >
                        {iconComponent}
                    </IconButton>

                    {!noDivider && (
                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                height: 23,
                                my: "auto !important",
                                pl: 1,
                                borderColor: "#494949",
                                borderRightWidth: 1.6,
                            }}
                        />
                    )}
                </Stack>
            </Box>
        </>
    )
}