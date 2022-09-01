import { Box, IconButton, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useEffect, useMemo, useRef } from "react"
import { GenericWarMachinePNG, SvgInfoCircular, SvgSkull } from "../../../../assets"
import { useAuth, useMobile, useSupremacy, useTraining } from "../../../../containers"
import { getRarityDeets } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { zoomEffect } from "../../../../theme/keyframes"
import { colors, fonts } from "../../../../theme/theme"
import { GameAbility, MechAbilityStages, WarMachineState } from "../../../../types"
import { ClipThing } from "../../../Common/ClipThing"
import { WarMachineAbilitiesPopoverBT } from "../WarMachineAbilitiesPopover/WarMachineAbilitiesPopoverBT"
import { WarMachineDestroyedInfoBT } from "../WarMachineDestroyedInfoBT"
import { HealthShieldBarsBT } from "./HealthShieldBarsBT"
import { MoveCommandBT } from "./MoveCommandBT"

// in rems
const WIDTH_AVATAR = 8.6
const WIDTH_BODY = 17
const HEIGHT = 8
export const DEAD_OPACITY = 0.6
export const WIDTH_SKILL_BUTTON = 3.8
export const WIDTH_STAT_BAR = 1.5

const trainingGameAbilities: GameAbility[] = [
    {
        id: "4fc7e90a-bf5f-4cb4-a8ed-2b48860554b8",
        game_client_ability_id: 2,
        label: "REPAIR",
        colour: "#23AE3C",
        image_url: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/ability-repair.jpg",
        sups_cost: "70000000000000000000",
        description: "Support your Syndicate with a well-timed repair.",
        text_colour: "#FFFFFF",
        current_sups: "0",
        location_select_type: "LOCATION_SELECT",
        identity: "",
        ability_offering_id: "",
    },
    {
        id: "cf5218ec-42c6-41df-8e2c-aa0b4e89bad6",
        game_client_ability_id: 5,
        label: "OVERCHARGE",
        colour: "#FFFFFF",
        image_url: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/ability-overcharge.jpg",
        sups_cost: "20584764066757779948",
        description: "Consume your remaining shield for an explosive defence mechanism.",
        text_colour: "#000000",
        current_sups: "0",
        location_select_type: "LOCATION_SELECT",
        identity: "",
        ability_offering_id: "",
    },
]

export const WarMachineItemBT = ({
    warMachine,
    scale,
    initialExpanded = false,
    transformOrigin,
    isPoppedout,
}: {
    warMachine: WarMachineState
    scale: number
    initialExpanded?: boolean
    transformOrigin?: string
    isPoppedout?: boolean
}) => {
    const { isMobile } = useMobile()
    const { userID } = useAuth()
    const { getFaction } = useSupremacy()
    const { highlightedMechParticipantID, setHighlightedMechParticipantID, trainingStage, setTrainingStage } = useTraining()

    const { hash, participantID, factionID: wmFactionID, name, imageAvatar, tier, ownedByID } = warMachine

    const [isAlive, toggleIsAlive] = useToggle(warMachine.health > 0)
    const [isExpanded, toggleIsExpanded] = useToggle(initialExpanded)
    const faction = getFaction(wmFactionID)

    const popoverRef = useRef(null)
    const [popoverOpen, togglePopoverOpen] = useToggle()
    const [isDestroyedInfoOpen, toggleIsDestroyedInfoOpen] = useToggle()
    const maxAbilityPriceMap = useRef<Map<string, BigNumber>>(new Map<string, BigNumber>())

    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])
    const wmImageUrl = useMemo(() => imageAvatar || GenericWarMachinePNG, [imageAvatar])
    const selfOwned = useMemo(() => ownedByID === userID, [ownedByID, userID])
    const primaryColor = useMemo(() => (selfOwned ? colors.gold : faction.primary_color), [faction.primary_color, selfOwned])
    const backgroundColor = useMemo(() => faction.background_color, [faction.background_color])

    // Toggle out isExpanded if other mech is highlighted
    useEffect(() => {
        if (highlightedMechParticipantID !== participantID) {
            toggleIsExpanded(initialExpanded)
        } else {
            toggleIsExpanded(true)
        }
    }, [highlightedMechParticipantID, initialExpanded, isMobile, setHighlightedMechParticipantID, toggleIsExpanded, participantID])

    return (
        <>
            <Stack
                ref={popoverRef}
                direction="row"
                alignItems="flex-end"
                sx={{
                    position: "relative",
                    height: "100%",
                    opacity: isAlive ? 1 : 0.8,
                    width: `${
                        WIDTH_AVATAR +
                        (isExpanded ? WIDTH_BODY : 2 * WIDTH_STAT_BAR) +
                        (isAlive ? WIDTH_SKILL_BUTTON : 0) +
                        (warMachine.ownedByID === userID ? WIDTH_SKILL_BUTTON : 0)
                    }rem`,
                    transition: "width .1s",
                    transform: highlightedMechParticipantID === participantID ? `scale(${scale * 1.08})` : `scale(${scale})`,
                    transformOrigin: transformOrigin || "center",
                }}
            >
                {/* Little info button to show the mech destroyed info */}
                {!isAlive && (
                    <IconButton
                        size="small"
                        onClick={() => toggleIsDestroyedInfoOpen()}
                        sx={{
                            position: "absolute",
                            top: ".15rem",
                            left: `${WIDTH_AVATAR - 2}rem`,
                            px: ".56rem",
                            py: ".4rem",
                            opacity: 0.83,
                            zIndex: 99,
                        }}
                    >
                        <SvgInfoCircular fill={"white"} size="1.5rem" />
                    </IconButton>
                )}

                {/* The underline at the bottom */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        left: "1rem",
                        height: ".3rem",
                        backgroundColor: primaryColor,
                        zIndex: 9,
                        opacity: isAlive ? 1 : DEAD_OPACITY,
                    }}
                />

                {/* Mech avatar image */}
                <ClipThing
                    clipSize="8px"
                    corners={{ bottomLeft: true }}
                    border={{ isFancy: false, borderColor: primaryColor, borderThickness: ".25rem" }}
                    backgroundColor={primaryColor}
                    sx={{ zIndex: 2 }}
                    innerSx={{ background: `linear-gradient(${primaryColor}, #000000)` }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            width: `${WIDTH_AVATAR}rem`,
                            height: `${HEIGHT}rem`,
                            overflow: "hidden",
                            backgroundImage: `url(${wmImageUrl})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            cursor: "pointer",
                        }}
                    >
                        {/* Number */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                right: ".2rem",
                                px: ".3rem",
                                backgroundColor: "#00000090",
                            }}
                        >
                            <Typography variant="h4" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                                {warMachine.participantID}
                            </Typography>
                        </Box>

                        {!isAlive && (
                            <Stack
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    px: "2.64rem",
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: "linear-gradient(#00000090, #000000)",
                                    transition: "all .2s",
                                    zIndex: 2,
                                }}
                            >
                                <SvgSkull size="100%" />
                            </Stack>
                        )}
                    </Box>
                </ClipThing>

                <Stack direction="row" alignSelf="stretch" sx={{ flex: 1, position: "relative" }}>
                    {/* Mech rarity and name */}
                    {isExpanded && (
                        <Stack
                            sx={{
                                flex: 1,
                                position: "relative",
                                height: "100%",
                                px: "1rem",
                                py: ".6rem",
                                background: `linear-gradient(${backgroundColor}BB 25%, ${backgroundColor}90, ${primaryColor}55)`,
                                opacity: isAlive ? 1 : DEAD_OPACITY,
                                zIndex: 1,
                            }}
                        >
                            <Typography sx={{ fontFamily: fonts.nostromoBlack, color: rarityDeets.color }}>{rarityDeets.label}</Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    lineHeight: 1,
                                    fontWeight: "fontWeightBold",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    whiteSpace: "normal",
                                    display: "-webkit-box",
                                    overflowWrap: "anywhere",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 2,
                                }}
                            >
                                {name || hash}
                            </Typography>
                        </Stack>
                    )}

                    {/* Health and shield bars */}
                    <HealthShieldBarsBT warMachine={warMachine} toggleIsAlive={toggleIsAlive} />

                    {/* Mech abilities */}
                    {isAlive && warMachine.ownedByID === userID && (
                        <>
                            <Box
                                sx={{
                                    position: "relative",
                                    width: `${WIDTH_SKILL_BUTTON}rem`,
                                    height: "100%",
                                    backgroundColor: (theme) => theme.factionTheme.primary,
                                    boxShadow: 2,
                                    cursor: isAlive ? "pointer" : "auto",
                                    zIndex: 3,
                                    opacity: isAlive ? 1 : DEAD_OPACITY,
                                    ":hover #warMachineSkillsText": {
                                        letterSpacing: trainingStage !== MechAbilityStages.ExplainMA ? "unset" : isAlive ? 2.3 : 1,
                                    },
                                }}
                                onClick={() => {
                                    if (trainingStage !== MechAbilityStages.ExplainMA) return
                                    if (!isAlive) return
                                    setHighlightedMechParticipantID(participantID)
                                    // Need this time out so that it waits for it expand first then popover, else positioning is wrong
                                    togglePopoverOpen(true)
                                    setTrainingStage(MechAbilityStages.ExpandMA)
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "absolute",
                                        left: "2rem",
                                        top: "50%",
                                        transform: `translate(-50%, -50%) rotate(-${90}deg)`,
                                        zIndex: 2,
                                    }}
                                >
                                    <Typography
                                        id="warMachineSkillsText"
                                        variant="body1"
                                        sx={{
                                            fontWeight: "fontWeightBold",
                                            color: (theme) => theme.factionTheme.secondary,
                                            letterSpacing: 1,
                                            transition: "all .2s",
                                            animation: trainingStage === MechAbilityStages.ExplainMA ? `${zoomEffect(1.35)} 2s infinite` : "unset",
                                        }}
                                    >
                                        SKILLS
                                    </Typography>
                                </Box>
                            </Box>
                        </>
                    )}

                    {warMachine.ownedByID === userID && <MoveCommandBT isAlive={isAlive} warMachine={warMachine} />}
                </Stack>
            </Stack>

            {isAlive && (
                <WarMachineAbilitiesPopoverBT
                    popoverRef={popoverRef}
                    open={popoverOpen}
                    togglePopoverOpen={togglePopoverOpen}
                    onClose={() => trainingStage !== MechAbilityStages.ExpandMA && togglePopoverOpen(false)}
                    warMachine={warMachine}
                    gameAbilities={trainingGameAbilities}
                    maxAbilityPriceMap={maxAbilityPriceMap}
                    getFaction={getFaction}
                    isPoppedout={isPoppedout}
                />
            )}

            {!isAlive && isDestroyedInfoOpen && (
                <WarMachineDestroyedInfoBT
                    warMachine={warMachine}
                    open={isDestroyedInfoOpen}
                    onClose={() => toggleIsDestroyedInfoOpen(false)}
                    getFaction={getFaction}
                />
            )}
        </>
    )
}
