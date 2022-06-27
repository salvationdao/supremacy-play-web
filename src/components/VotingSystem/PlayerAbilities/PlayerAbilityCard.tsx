import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../assets"
import { useMiniMap } from "../../../containers"
import { useToggle } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { LocationSelectType, PlayerAbility } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { ConfirmModal } from "../../Common/ConfirmModal"
import { FancyButton } from "../../Common/FancyButton"
import { TooltipHelper } from "../../Common/TooltipHelper"

export const PlayerAbilityCard = ({ playerAbility }: { playerAbility: PlayerAbility }) => {
    const { setPlayerAbility } = useMiniMap()
    const [abilityTypeIcon, setAbilityTypeIcon] = useState<JSX.Element>(<SvgQuestionMark size="1.7rem" />)
    const [abilityTypeDescription, setAbilityTypeDescription] = useState("Miscellaneous ability type.")
    const [showPurchaseModal, toggleShowActivateModal] = useToggle(false)

    useEffect(() => {
        switch (playerAbility.ability.location_select_type) {
            case LocationSelectType.GLOBAL:
                setAbilityTypeDescription("This ability will affect all units on the map.")
                setAbilityTypeIcon(<SvgGlobal size="1.7rem" />)
                break
            case LocationSelectType.LOCATION_SELECT:
                setAbilityTypeDescription("This ability will target a specific location on the map.")
                setAbilityTypeIcon(<SvgTarget size="1.7rem" />)
                break
            case LocationSelectType.MECH_SELECT:
                setAbilityTypeDescription("This ability will target a specific mech on the map.")
                setAbilityTypeIcon(<SvgMicrochip size="1.7rem" />)
                break
            case LocationSelectType.LINE_SELECT:
                setAbilityTypeDescription("This ability will target a straight line on the map.")
                setAbilityTypeIcon(<SvgLine size="1.7rem" />)
                break
        }
    }, [playerAbility])

    const onActivate = useCallback(() => {
        if (!playerAbility) return
        setPlayerAbility(playerAbility)
        toggleShowActivateModal(false)
    }, [playerAbility, setPlayerAbility, toggleShowActivateModal])

    return (
        <>
            <TooltipHelper text={playerAbility.ability.description} placement="bottom">
                <FancyButton
                    clipThingsProps={{
                        clipSize: "6px",
                        clipSlantSize: "0px",
                        corners: {
                            topLeft: true,
                            topRight: true,
                            bottomLeft: true,
                            bottomRight: true,
                        },
                        backgroundColor: colors.darkNavy,
                        opacity: 1,
                        border: { borderColor: playerAbility.ability.colour, borderThickness: "1px" },
                        sx: { position: "relative", px: ".4rem", py: ".3rem" },
                    }}
                    sx={{ color: playerAbility.ability.colour, p: 0 }}
                    onClick={() => toggleShowActivateModal(true)}
                >
                    <Stack
                        spacing=".3rem"
                        sx={{
                            ":hover img": {
                                transform: "scale(1.2)",
                                filter: "brightness(2)",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                overflow: "hidden",
                                position: "relative",
                                width: "100%",
                                pt: "100%", // 1:1 width-height ratio
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: ".2rem",
                                    right: ".2rem",
                                    zIndex: 2,
                                }}
                            >
                                {abilityTypeIcon}
                            </Box>

                            <Box
                                sx={{
                                    zIndex: 2,
                                    position: "absolute",
                                    top: ".2rem",
                                    left: ".2rem",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: fonts.nostromoBold,
                                    }}
                                >
                                    {playerAbility.count}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    zIndex: 1,
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: `center center`,
                                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, .4) 15%, rgba(255, 255, 255, 0.0))`,
                                    backgroundSize: "cover",
                                }}
                            />

                            <Box
                                component="img"
                                src={playerAbility.ability.image_url}
                                alt={`Thumbnail image for ${playerAbility.ability.label}`}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transformOrigin: "center",
                                    transition: "transform .1s ease-out, filter .1s ease-out",
                                }}
                            />
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{
                                lineHeight: 1.2,
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                fontWeight: "fontWeightBold",
                            }}
                        >
                            {playerAbility.ability.label}
                        </Typography>
                    </Stack>
                </FancyButton>
            </TooltipHelper>

            {showPurchaseModal && (
                <ConfirmModal
                    title={`Activate ${playerAbility.ability.label || "Ability"}`}
                    onConfirm={onActivate}
                    onClose={() => toggleShowActivateModal(false)}
                >
                    <Stack spacing="1rem">
                        <Stack direction="row" spacing="1.5rem">
                            <ClipThing
                                clipSize="8px"
                                border={{
                                    borderColor: "#FF0000",
                                    borderThickness: ".3rem",
                                }}
                                opacity={0.5}
                                backgroundColor="#333333"
                                sx={{ height: "100%", flexShrink: 0 }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        height: "60px",
                                        width: "60px",
                                        background: `center center`,
                                        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, .8) 20%, rgba(255, 255, 255, 0.0)), url(${playerAbility.ability.image_url})`,
                                        backgroundSize: "cover",
                                    }}
                                >
                                    <TooltipHelper text={abilityTypeDescription} placement="bottom">
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                right: ".4rem",
                                                bottom: ".2rem",
                                                zIndex: 1,
                                            }}
                                        >
                                            {abilityTypeIcon}
                                        </Box>
                                    </TooltipHelper>
                                </Box>
                            </ClipThing>

                            <Typography variant="h6">{playerAbility.ability.description}</Typography>
                        </Stack>

                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: fonts.nostromoBold,
                                alignSelf: "end",
                            }}
                        >
                            Remaining: {playerAbility.count}
                        </Typography>
                    </Stack>
                </ConfirmModal>
            )}
        </>
    )
}
