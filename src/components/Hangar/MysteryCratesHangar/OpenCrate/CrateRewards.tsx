import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useLocation } from "react-router-dom"
import { SvgClose } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { ClipThing } from "../../../Common/ClipThing"
import { FancyButton } from "../../../Common/FancyButton"
import { OpenCrateResponse } from "../../../../types"
import { useEffect, useState } from "react"
import { getRarityDeets } from "../../../../helpers"

interface CrateRewardsProps {
    rewards: OpenCrateResponse
    onClose?: () => void
}

export const CrateRewards = ({ rewards, onClose }: CrateRewardsProps) => {
    const theme = useTheme()
    const location = useLocation()

    // const isMech = useMemo(() => rewards.find((reward) => reward.label === "MECH"), [rewards])

    return (
        <ClipThing
            clipSize="10px"
            corners={{
                topRight: true,
                bottomLeft: true,
            }}
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            sx={{ m: "4rem", width: "100%", height: "100%" }}
            backgroundColor={theme.factionTheme.background}
        >
            <Stack spacing="3rem" justifyContent="center" alignItems="center" sx={{ py: "5rem", px: "5.5rem", textAlign: "center" }}>
                <Typography variant={"h1"} sx={{ fontFamily: fonts.nostromoBlack, fontSize: "3rem" }}>
                    You have received:
                </Typography>

                <Stack direction={"row"}>
                    {rewards.mech && <CrateItem imageUrl={rewards.mech.image_url} label={rewards.mech.label} />}
                    <Stack>
                        {rewards.mech_skin && (
                            <CrateItem
                                direction={"row"}
                                imageUrl={rewards.mech_skin.image_url}
                                label={rewards.mech_skin.label + " Submodule"}
                                tier={rewards.mech_skin?.tier}
                            />
                        )}
                        {rewards.weapon && rewards.weapon.map((w) => <CrateItem key={w.id} direction={"row"} imageUrl={w.image_url} label={w.label} />)}
                        {rewards.weapon_skin && (
                            <CrateItem
                                direction={"row"}
                                imageUrl={rewards.weapon_skin.image_url}
                                label={rewards.weapon_skin.label + "Submodule"}
                                tier={rewards.mech_skin?.tier}
                            />
                        )}
                    </Stack>
                </Stack>

                <FancyButton
                    clipThingsProps={{
                        clipSize: "9px",
                        backgroundColor: theme.factionTheme.primary,
                        opacity: 1,
                        border: { isFancy: true, borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                        sx: { position: "relative", width: "32rem" },
                    }}
                    sx={{ width: "100%", py: "1rem", color: theme.factionTheme.secondary }}
                    to={`/fleet/mystery-crates${location.hash}`}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: theme.factionTheme.secondary,
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        View in Hangar
                    </Typography>
                </FancyButton>
            </Stack>

            {onClose && (
                <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: "1rem", right: "1rem" }}>
                    <SvgClose size="3rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                </IconButton>
            )}
        </ClipThing>
    )
}

interface CrateItemProps {
    direction?: "row" | "column"
    label: string | undefined
    imageUrl?: string | undefined
    tier?: string | undefined
}
const CrateItem = ({ label, imageUrl, tier, direction = "column" }: CrateItemProps) => {
    const [rarityDeets, setRarityDeets] = useState<{
        label: string
        color: string
    }>()

    useEffect(() => {
        setRarityDeets(tier ? getRarityDeets(tier) : undefined)
    }, [setRarityDeets, getRarityDeets, tier])

    return (
        <Stack direction={direction} alignItems={"center"} spacing="1rem" sx={{ flex: 1 }}>
            <Box component={"img"} src={imageUrl} alt={label} sx={{ width: "55%", height: "auto", objectFit: "contain", objectPosition: "center" }} />
            <Stack>
                <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                    {label}
                </Typography>
                {rarityDeets && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: rarityDeets.color,
                            fontFamily: fonts.nostromoBlack,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {rarityDeets.label}
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}
