import { LoadingButton } from "@mui/lab"
import { Box, ButtonBase, Fade, Modal, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgGlobal, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../assets"
import { SocketState, useGameServerAuth, useGameServerWebsocket } from "../../containers"
import { useToggle } from "../../hooks"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { PlayerAbility } from "../../types"
import { ClipThing } from "../Common/ClipThing"
import { TooltipHelper } from "../Common/TooltipHelper"
import { AbilityCardProps } from "./SaleAbilityCard"

const activateModalWidth = 400

export const PlayerAbilityCard = ({ abilityID, ...props }: AbilityCardProps) => {
    const { user } = useGameServerAuth()
    const { state, send, subscribe } = useGameServerWebsocket()
    const [playerAbility, setPlayerAbility] = useState<PlayerAbility | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Purchasing
    const [showPurchaseModal, toggleShowActivateModal] = useToggle(false)
    const [activateLoading, setActivateLoading] = useState(false)
    const [activateError, setActivateError] = useState<string | null>(null)

    let abilityTypeIcon = <SvgQuestionMark />
    let abilityTypeDescription = "Miscellaneous ability type."
    switch (playerAbility?.location_select_type) {
        case "GLOBAL":
            abilityTypeDescription = "This ability will affect all units on the map."
            abilityTypeIcon = <SvgGlobal />
            break
        case "LOCATION_SELECT":
            abilityTypeDescription = "This ability will target a specific location on the map."
            abilityTypeIcon = <SvgTarget />
            break
        case "MECH_SELECT":
            abilityTypeDescription = "This ability will target a specific mech on the map."
            abilityTypeIcon = <SvgMicrochip />
    }

    const onActivate = async () => {
        try {
            setActivateLoading(true)

            toggleShowActivateModal(false)
        } catch (e) {
            if (e instanceof Error) {
                setActivateError(e.message)
            } else if (typeof e === "string") {
                setActivateError(e)
            }
        } finally {
            setActivateLoading(false)
        }
    }

    useEffect(() => {
        if (state !== SocketState.OPEN || !send || !subscribe || !user) return

        try {
            return subscribe<PlayerAbility>(
                GameServerKeys.PlayerAbilitySubscribe,
                (resp) => {
                    setPlayerAbility(resp)
                },
                {
                    ability_id: abilityID,
                },
            )
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message)
            } else if (typeof e === "string") {
                setError(e)
            }
        }
    }, [state, send, subscribe, user])

    if (!playerAbility) {
        return <Box>Loading...</Box>
    }

    return (
        <>
            <TooltipHelper text={playerAbility.description}>
                <ButtonBase
                    {...props}
                    onClick={() => toggleShowActivateModal(true)}
                    sx={{
                        display: "block",
                        textAlign: "left",
                        backgroundColor: colors.navy,
                        ":hover img": {
                            filter: "grayscale(0)",
                            transform: "scale(1.2)",
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
                                    zIndex: 1,
                                    position: "absolute",
                                    top: ".2rem",
                                    right: ".2rem",
                                }}
                            >
                                {abilityTypeIcon}
                            </Box>
                            <Box
                                component="img"
                                src={playerAbility.image_url}
                                alt={`Thumbnail image for ${playerAbility.label}`}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    filter: "grayscale(1)",
                                    transformOrigin: "center",
                                    transition: "transform .1s ease-out",
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
                            {playerAbility.label}
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
                            innerSx={{
                                padding: "1rem",
                                backgroundColor: colors.darkNavy,
                            }}
                            border={{
                                borderColor: colors.neonBlue,
                                borderThickness: ".15rem",
                                isFancy: true,
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    marginBottom: ".5rem",
                                    fontFamily: fonts.nostromoBold,
                                    textTransform: "uppercase",
                                }}
                            >
                                Activate {playerAbility.label || "Ability"}
                            </Typography>
                            <Stack direction="row" spacing="1rem">
                                <ClipThing
                                    innerSx={{
                                        position: "relative",
                                        minHeight: "100px",
                                        minWidth: "100px",
                                        background: `center center`,
                                        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, .8) 20%, rgba(255, 255, 255, 0.0)), url(${playerAbility.image_url})`,
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
                                </ClipThing>
                                <Box
                                    sx={{
                                        alignSelf: "stretch",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography>{playerAbility.description}</Typography>
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
                                loading={activateLoading}
                            >
                                <Typography variant="body2">Activate Ability</Typography>
                            </LoadingButton>
                            {activateError && <Typography color={colors.red}>Error: {activateError}</Typography>}
                            {error && <Typography color={colors.red}>Error: Something went wrong while loading this ability.</Typography>}
                        </ClipThing>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}
