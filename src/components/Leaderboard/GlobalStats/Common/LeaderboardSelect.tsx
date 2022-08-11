import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { colors } from "../../../../theme/theme"

export enum LeaderboardTypeEnum {
    PlayerAbilityKills = "PlayerAbilityKills",
    PlayerBattlesSpectated = "PlayerBattlesSpectated",
    PlayerMechSurvives = "PlayerMechSurvives",
    PlayerMechKills = "PlayerMechKills",
    PlayerAbilityTriggers = "PlayerAbilityTriggers",
    PlayerMechsOwned = "PlayerMechsOwned",
    PlayerRepairBlocks = "PlayerRepairBlocks",
}

export const leaderboardTypeOptions: {
    label: string
    value: LeaderboardTypeEnum
}[] = [
    { label: "Top Player Ability Kills", value: LeaderboardTypeEnum.PlayerAbilityKills },
    { label: "Top Player Battles Spectated", value: LeaderboardTypeEnum.PlayerBattlesSpectated },
    { label: "Top Player Mech Survives", value: LeaderboardTypeEnum.PlayerMechSurvives },
    { label: "Top Player Mech Kills", value: LeaderboardTypeEnum.PlayerMechKills },
    { label: "Top Player Ability Triggers", value: LeaderboardTypeEnum.PlayerAbilityTriggers },
    { label: "Top Player Mechs Owned", value: LeaderboardTypeEnum.PlayerMechsOwned },
    { label: "Top Player Repair Blocks", value: LeaderboardTypeEnum.PlayerRepairBlocks },
]

export const LeaderboardSelect = ({
    leaderboardType,
    setLeaderboardType,
}: {
    leaderboardType: LeaderboardTypeEnum
    setLeaderboardType: React.Dispatch<React.SetStateAction<LeaderboardTypeEnum>>
}) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    return (
        <Stack>
            <Select
                sx={{
                    width: "100%",
                    borderRadius: 0.5,
                    backgroundColor: primaryColor,
                    "&:hover": {
                        opacity: 0.9,
                    },
                    ".MuiTypography-root": {
                        px: "2.4rem",
                        pt: ".5rem",
                        pb: ".3rem",
                    },
                    "& .MuiSelect-outlined": { p: 0 },
                    ".MuiOutlinedInput-notchedOutline": {
                        border: "none !important",
                    },
                }}
                displayEmpty
                value={leaderboardType}
                MenuProps={{
                    variant: "menu",
                    sx: {
                        "&& .Mui-selected": {
                            ".MuiTypography-root": {
                                color: secondaryColor,
                            },
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
                {leaderboardTypeOptions.map((x, i) => {
                    return (
                        <MenuItem
                            key={x.value + i}
                            value={x.value}
                            onClick={() => {
                                setLeaderboardType(x.value)
                            }}
                            sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                        >
                            <Typography textTransform="uppercase" sx={{ fontWeight: "fontWeightBold", color: secondaryColor }}>
                                {x.label}
                            </Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
