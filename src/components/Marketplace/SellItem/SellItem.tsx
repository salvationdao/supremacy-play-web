import { Box, MenuItem, Select, Stack, Typography } from "@mui/material"
import { ReactNode, useState } from "react"
import { WarMachineIconPNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { colors, fonts } from "../../../theme/theme"
import { ItemType } from "../../../types/marketplace"
import { ClipThing } from "../../Common/ClipThing"

const itemTypes: {
    label: string
    value: ItemType
}[] = [
    { label: "War Machine", value: ItemType.WarMachine },
    { label: "Keycard", value: ItemType.Keycards },
    { label: "Mystery Crate", value: ItemType.MysteryCrate },
]

export const SellItem = () => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [itemType, setItemType] = useState<ItemType>()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: primaryColor,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ height: "100%" }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                        px: "2rem",
                        py: "2.2rem",
                        backgroundColor: "#00000070",
                        borderBottom: (theme) => `${theme.factionTheme.primary}70 1.5px solid`,
                    }}
                >
                    <Box
                        sx={{
                            alignSelf: "flex-start",
                            flexShrink: 0,
                            mr: "1.2rem",
                            width: "7rem",
                            height: "5.2rem",
                            background: `url(${WarMachineIconPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    />
                    <Box sx={{ mr: "2rem" }}>
                        <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                            SELL AN ITEM
                        </Typography>
                        <Typography sx={{ fontSize: "1.85rem" }}>Put your asset on the marketplace.</Typography>
                    </Box>
                </Stack>
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        ml: "2rem",
                        mr: "1rem",
                        pr: "1rem",
                        my: "2rem",
                        direction: "ltr",
                        scrollbarWidth: "none",
                        "::-webkit-scrollbar": {
                            width: ".4rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                            borderRadius: 3,
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: primaryColor,
                            borderRadius: 3,
                        },
                    }}
                >
                    <Box sx={{ direction: "ltr", height: 0 }}>
                        <Stack spacing="3rem" sx={{ px: "3rem", py: "1.8rem" }}>
                            {/* Item type select */}
                            <QuestionSection
                                primaryColor={primaryColor}
                                question="What are you selling?"
                                description="You can choose to sell your war machines, keycards, and mystery crates."
                            >
                                <ClipThing
                                    clipSize="5px"
                                    clipSlantSize="2px"
                                    opacity={0.9}
                                    border={{
                                        borderColor: primaryColor,
                                        borderThickness: "1px",
                                    }}
                                    backgroundColor={backgroundColor}
                                >
                                    <Stack sx={{ height: "100%", width: "40rem" }}>
                                        <Select
                                            sx={{
                                                width: "100%",
                                                borderRadius: 0.5,
                                                "&:hover": {
                                                    backgroundColor: colors.darkNavy,
                                                },
                                                ".MuiTypography-root": {
                                                    px: "2.4rem",
                                                    py: "1.1rem",
                                                },
                                                "& .MuiSelect-outlined": { p: 0 },
                                                ".MuiOutlinedInput-notchedOutline": {
                                                    border: "none !important",
                                                },
                                            }}
                                            displayEmpty
                                            value={itemType}
                                            renderValue={(x) => {
                                                return (
                                                    <Typography textTransform="uppercase" variant="h6" sx={{ opacity: x ? 1 : 0.7 }}>
                                                        {x || "CHOOSE AN ITEM TYPE"}
                                                    </Typography>
                                                )
                                            }}
                                            MenuProps={{
                                                variant: "menu",
                                                sx: {
                                                    "&& .Mui-selected": {
                                                        color: secondaryColor,
                                                        backgroundColor: primaryColor,
                                                    },
                                                },
                                                PaperProps: {
                                                    sx: {
                                                        backgroundColor: colors.darkNavy,
                                                        borderRadius: 0.5,
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem disabled value="">
                                                <Typography textTransform="uppercase" variant="h6">
                                                    CHOOSE AN ITEM TYPE
                                                </Typography>
                                            </MenuItem>
                                            {itemTypes.map((x, i) => {
                                                return (
                                                    <MenuItem
                                                        key={x.value + i}
                                                        value={x.value}
                                                        onClick={() => setItemType(x.value)}
                                                        sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                                                    >
                                                        <Typography textTransform="uppercase" variant="h6">
                                                            {x.label}
                                                        </Typography>
                                                    </MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </Stack>
                                </ClipThing>
                            </QuestionSection>
                        </Stack>
                    </Box>
                </Box>
            </Stack>
        </ClipThing>
    )
}

const QuestionSection = ({
    primaryColor,
    question,
    description,
    children,
}: {
    primaryColor: string
    question: string
    description?: string
    children: ReactNode
}) => {
    return (
        <Stack direction="row" alignItems="flex-start" spacing="3rem">
            <Box sx={{ width: "36rem" }}>
                <Typography gutterBottom variant="h6" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                    {question}
                </Typography>
                {description && (
                    <Typography variant="h6" sx={{ color: colors.lightGrey }}>
                        {description}
                    </Typography>
                )}
            </Box>
            {children}
        </Stack>
    )
}

/**
 * What they're selling:
 * - war machines
 * - keycards
 * - mystery crates
 *
 * List the items and they choose
 *
 * Listing type:
 * - buyout					price
 * - auction				reserve price
 * - auction or buyout		price, reserve price
 * - dutch auction			starting price, reserve price, drop rate
 */
