import { LoadingButton } from "@mui/lab"
import { Box, ButtonBase, ButtonBaseProps, Fade, IconButton, Modal, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgClose, SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../assets"
import { useConsumables } from "../../containers/consumables"
import { useToggle } from "../../hooks"
import { colors, fonts } from "../../theme/theme"
import { LocationSelectType, PlayerAbility } from "../../types"
import { ClipThing } from "../Common/ClipThing"
import { TooltipHelper } from "../Common/TooltipHelper"

interface PlayerAbilityCardProps extends ButtonBaseProps {
    playerAbility: PlayerAbility
}

const activateModalWidth = 400

export const PlayerAbilityCard = ({ playerAbility, ...props }: PlayerAbilityCardProps) => {
    const { setPlayerAbility: submitPlayerAbility } = useConsumables()
    const [abilityTypeIcon, setAbilityTypeIcon] = useState<JSX.Element>(<SvgQuestionMark />)
    const [abilityTypeDescription, setAbilityTypeDescription] = useState("Miscellaneous ability type.")

    // Activating
    const [showPurchaseModal, toggleShowActivateModal] = useToggle(false)

    useEffect(() => {
        switch (playerAbility.ability.location_select_type) {
            case LocationSelectType.GLOBAL:
                setAbilityTypeDescription("This ability will affect all units on the map.")
                setAbilityTypeIcon(<SvgGlobal />)
                break
            case LocationSelectType.LOCATION_SELECT:
                setAbilityTypeDescription("This ability will target a specific location on the map.")
                setAbilityTypeIcon(<SvgTarget />)
                break
            case LocationSelectType.MECH_SELECT:
                setAbilityTypeDescription("This ability will target a specific mech on the map.")
                setAbilityTypeIcon(<SvgMicrochip />)
                break
            case LocationSelectType.LINE_SELECT:
                setAbilityTypeDescription("This ability will target a straight line on the map.")
                setAbilityTypeIcon(<SvgLine />)
                break
        }
    }, [playerAbility])

    const onActivate = () => {
        if (!playerAbility) return
        submitPlayerAbility(playerAbility)
        toggleShowActivateModal(false)
    }

    return (
        <>
            <TooltipHelper text={playerAbility.ability.description}>
                <ButtonBase
                    {...props}
                    onClick={() => toggleShowActivateModal(true)}
                    sx={{
                        display: "block",
                        textAlign: "left",
                        backgroundColor: colors.navy,
                        ":hover img": {
                            transform: "scale(1.2)",
                            filter: "brightness(2)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            padding: ".3rem",
                        }}
                    >
                        <Box
                            sx={{
                                overflow: "hidden",
                                position: "relative",
                                width: "100%",
                                paddingTop: "100%", // 1:1 width-height ratio
                            }}
                        >
                            <Box
                                sx={{
                                    zIndex: 2,
                                    position: "absolute",
                                    top: ".2rem",
                                    right: ".2rem",
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
                                    variant="caption"
                                    sx={{
                                        color: colors.gold,
                                        fontWeight: "fontWeightBold",
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
                                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, .6) 20%, rgba(255, 255, 255, 0.0))`,
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
                    </Box>
                    <Box
                        sx={{
                            padding: ".2rem",
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                overflowX: "hidden",
                                width: "100%",
                                whiteSpace: "nowrap",
                                textDecoration: "ellipsis",
                            }}
                        >
                            {playerAbility.ability.label}
                        </Typography>
                    </Box>
                </ButtonBase>
            </TooltipHelper>

            <Modal open={showPurchaseModal} onClose={() => toggleShowActivateModal(false)} closeAfterTransition>
                <Fade in={showPurchaseModal}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: `50%`,
                            left: `50%`,
                            transform: "translate(-50%, -50%)",
                            width: "100%",
                            maxWidth: activateModalWidth,
                        }}
                    >
                        <ClipThing
                            border={{
                                borderColor: playerAbility.ability.colour,
                                borderThickness: ".15rem",
                                isFancy: true,
                            }}
                            backgroundColor={colors.darkNavy}
                            sx={{ position: "relative" }}
                        >
                            <IconButton size="small" onClick={() => toggleShowActivateModal(false)} sx={{ position: "absolute", top: ".2rem", right: ".2rem" }}>
                                <SvgClose size="1.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                            </IconButton>
                            <Box sx={{ px: "2rem", py: "1.5rem" }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        marginBottom: ".5rem",
                                        fontFamily: fonts.nostromoBold,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Activate {playerAbility.ability.label || "Ability"}
                                </Typography>
                                <Stack direction="row" spacing="1rem">
                                    <ClipThing sx={{ flexShrink: 0 }} backgroundColor={colors.darkNavy}>
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
                                            <TooltipHelper text={abilityTypeDescription} placement="top-start">
                                                <Box
                                                    sx={{
                                                        zIndex: 1,
                                                        position: "absolute",
                                                        bottom: ".2rem",
                                                        right: ".2rem",
                                                    }}
                                                >
                                                    {abilityTypeIcon}
                                                </Box>
                                            </TooltipHelper>
                                        </Box>
                                    </ClipThing>
                                    <Box
                                        sx={{
                                            alignSelf: "stretch",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography>{playerAbility.ability.description}</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                alignSelf: "end",
                                            }}
                                        >
                                            Remaining:
                                            <Box
                                                component="span"
                                                sx={{
                                                    ml: ".5rem",
                                                    color: colors.offWhite,
                                                }}
                                            >
                                                {playerAbility.count}
                                            </Box>
                                        </Typography>
                                    </Box>
                                </Stack>
                                <LoadingButton
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        width: "100%",
                                        minWidth: 0,
                                        mt: "1rem",
                                        mb: ".5rem",
                                        px: ".8rem",
                                        py: ".6rem",
                                        fontWeight: "fontWeightBold",
                                        color: colors.offWhite,
                                        lineHeight: 1,
                                        textTransform: "uppercase",
                                        backgroundColor: colors.green,
                                        border: `${colors.green} 1px solid`,
                                        borderRadius: 0.3,
                                        ":hover": {
                                            backgroundColor: `${colors.green}90`,
                                        },
                                    }}
                                    onClick={() => onActivate()}
                                >
                                    <Typography variant="body2">Activate Ability</Typography>
                                </LoadingButton>
                            </Box>
                        </ClipThing>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}
