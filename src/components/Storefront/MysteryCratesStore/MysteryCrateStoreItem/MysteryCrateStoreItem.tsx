import { Box, IconButton, Modal, Skeleton, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { ClipThing, FancyButton } from "../../.."
import { SafePNG, SvgClose, SvgSupToken } from "../../../../assets"
import { useSnackbar } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { numberCommaFormatter, supFormatterNoFixed } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"
import { MysteryCrate } from "../../../../types"

interface MysteryCrateStoreItemProps {
    enlargedView?: boolean
    crate: MysteryCrate
}

export const MysteryCrateStoreItem = ({ enlargedView, crate }: MysteryCrateStoreItemProps) => {
    const theme = useTheme()
    const [mysteryCrate, setMysteryCrate] = useState<MysteryCrate>(crate)
    const [confirmModalOpen, toggleConfirmModalOpen] = useToggle()

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    useGameServerSubscriptionFaction<MysteryCrate>(
        {
            URI: `/crate/${crate.id}`,
            key: GameServerKeys.SubMysteryCrate,
        },
        (payload) => {
            if (!payload) return
            setMysteryCrate(payload)
        },
    )

    return (
        <>
            <Box
                sx={{
                    height: enlargedView ? "88%" : "100%",
                    minHeight: "60rem",
                    width: "100%",
                    transition: "all .15s",
                    ":hover": {
                        transform: "translateY(-.4rem)",
                    },
                }}
            >
                <ClipThing
                    clipSize="12px"
                    border={{
                        borderColor: primaryColor,
                        borderThickness: enlargedView ? ".3rem" : ".2rem",
                    }}
                    opacity={0.9}
                    backgroundColor={backgroundColor}
                    sx={{ height: "100%" }}
                >
                    <Stack spacing={enlargedView ? "2.5rem" : "1.5rem"} justifyContent="center" sx={{ height: "100%", p: enlargedView ? "3rem" : "1.5rem" }}>
                        <Box
                            sx={{
                                position: "relative",
                                flex: enlargedView ? 1 : "unset",
                                px: enlargedView ? "5rem" : ".8rem",
                                py: enlargedView ? "8rem" : "2rem",
                                borderRadius: 1,
                                boxShadow: "inset 0 0 12px 6px #00000040",
                                background: `radial-gradient(#FFFFFF20 10px, ${backgroundColor})`,
                                border: "#00000060 1px solid",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: enlargedView ? "100%" : "22rem",
                                    background: `url(${mysteryCrate.image_url || SafePNG})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "contain",
                                }}
                            />

                            <Box
                                sx={{
                                    position: "absolute",
                                    right: enlargedView ? "1.4rem" : ".5rem",
                                    bottom: enlargedView ? ".6rem" : ".2rem",
                                    px: ".2rem",
                                    py: ".5rem",
                                    backgroundColor: "#00000095",
                                }}
                            >
                                <Typography
                                    sx={{
                                        lineHeight: 1,
                                        fontSize: enlargedView ? "1.5rem" : "1.22rem",
                                        fontFamily: fonts.nostromoBold,
                                        span: {
                                            fontFamily: "inherit",
                                            color: mysteryCrate.amount_sold >= mysteryCrate.amount ? colors.red : colors.neonBlue,
                                        },
                                    }}
                                >
                                    <span>{numberCommaFormatter(mysteryCrate.amount - mysteryCrate.amount_sold)}</span> /{" "}
                                    {numberCommaFormatter(mysteryCrate.amount)}
                                </Typography>
                            </Box>

                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing=".1rem"
                                sx={{ position: "absolute", left: enlargedView ? "1.4rem" : ".5rem", bottom: enlargedView ? ".6rem" : ".2rem" }}
                            >
                                <SvgSupToken size={enlargedView ? "2.3rem" : "1.6rem"} fill={colors.yellow} />
                                <Typography sx={{ fontSize: enlargedView ? "1.9rem" : "1.6rem", fontWeight: "fontWeightBold" }}>
                                    {supFormatterNoFixed(mysteryCrate.price, 2)}
                                </Typography>
                            </Stack>
                        </Box>

                        <Stack alignItems={enlargedView ? "center" : "flex-start"} sx={{ flex: enlargedView ? "unset" : 1, px: ".4rem", py: ".3rem" }}>
                            <Typography
                                variant={enlargedView ? "h4" : "h6"}
                                sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack, textAlign: enlargedView ? "center" : "start" }}
                            >
                                {mysteryCrate.label}
                            </Typography>

                            <Typography sx={{ fontSize: enlargedView ? "2.1rem" : "1.6rem", textAlign: enlargedView ? "center" : "start" }}>
                                {mysteryCrate.description}
                            </Typography>

                            <Stack alignItems="center" sx={{ mt: "auto", pt: ".8rem", alignSelf: "stretch" }}>
                                <FancyButton
                                    excludeCaret
                                    onClick={() => toggleConfirmModalOpen(true)}
                                    clipThingsProps={{
                                        clipSize: "5px",
                                        backgroundColor: primaryColor,
                                        opacity: 1,
                                        border: { isFancy: true, borderColor: primaryColor, borderThickness: "1.5px" },
                                        sx: { position: "relative", mt: "1rem", width: enlargedView ? "50%" : "100%" },
                                    }}
                                    sx={{ px: "1.6rem", py: enlargedView ? "1.1rem" : ".6rem" }}
                                >
                                    <Typography
                                        variant={enlargedView ? "body1" : "caption"}
                                        sx={{ fontFamily: fonts.nostromoBlack, color: theme.factionTheme.secondary }}
                                    >
                                        BUY NOW
                                    </Typography>
                                </FancyButton>
                            </Stack>
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>

            {confirmModalOpen && <ConfirmModal mysteryCrate={mysteryCrate} onClose={() => toggleConfirmModalOpen(false)} />}
        </>
    )
}

export const MysteryCrateStoreItemLoadingSkeleton = () => {
    const theme = useTheme()

    return (
        <Box sx={{ p: "1.2rem", width: "30rem" }}>
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".2rem",
                }}
                opacity={0.5}
                backgroundColor={theme.factionTheme.background}
            >
                <Stack spacing=".7rem" sx={{ px: "1.8rem", py: "1.6rem" }}>
                    <Skeleton variant="rectangular" width="100%" height="12rem" sx={{ mb: ".3rem !important" }} />
                    <Skeleton variant="rectangular" width="80%" height="2.2rem" />
                    <Skeleton variant="rectangular" width="100%" height="1.5rem" />
                    <Skeleton variant="rectangular" width="100%" height="1.5rem" />
                    <Skeleton variant="rectangular" width="100%" height="1.5rem" />
                    <Skeleton variant="rectangular" width="100%" height="4rem" sx={{ mt: "1rem !important" }} />
                </Stack>
            </ClipThing>
        </Box>
    )
}

const ConfirmModal = ({ mysteryCrate, onClose }: { mysteryCrate: MysteryCrate; onClose: () => void }) => {
    const theme = useTheme()
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(false)
    const [buyError, setBuyError] = useState<string>()

    const { mystery_crate_type, price } = mysteryCrate
    const formattedPrice = supFormatterNoFixed(price, 2)

    const confirmBuy = useCallback(async () => {
        try {
            setIsLoading(true)
            const resp = await send<MysteryCrate[]>(GameServerKeys.PurchaseMysteryCrate, {
                type: mystery_crate_type,
            })

            if (!resp) return
            newSnackbarMessage(`Successfully purchased ${mystery_crate_type} crate.`, "success")
            onClose()
        } catch (err) {
            setBuyError(typeof err === "string" ? err : "Failed to purchase item.")
            console.debug(err)
        } finally {
            setIsLoading(false)
        }
    }, [send, mystery_crate_type, newSnackbarMessage, onClose])

    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "48rem",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".2rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={theme.factionTheme.background}
                >
                    <Stack
                        spacing="1.2rem"
                        sx={{
                            position: "relative",
                            px: "2.5rem",
                            py: "2.4rem",
                            span: {
                                color: colors.neonBlue,
                                fontWeight: "fontWeightBold",
                            },
                        }}
                    >
                        <Typography variant="h5" sx={{ lineHeight: 1, fontFamily: fonts.nostromoBlack }}>
                            CONFIRMATION
                        </Typography>
                        <Typography variant="h6">
                            Do you wish to purchase a <strong>{mystery_crate_type}</strong> crate for <span>{formattedPrice}</span> SUPS?
                        </Typography>
                        <Stack direction="row" spacing="1rem" sx={{ pt: ".4rem" }}>
                            <FancyButton
                                loading={isLoading}
                                excludeCaret
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: colors.green,
                                    border: { borderColor: colors.green, borderThickness: "2px" },
                                    sx: { flex: 2, position: "relative" },
                                }}
                                sx={{ pt: 0, pb: 0, minWidth: "5rem" }}
                                onClick={confirmBuy}
                            >
                                <Stack direction="row" justifyContent="center">
                                    <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                        CONFIRM (
                                    </Typography>
                                    <SvgSupToken size="1.8rem" />
                                    <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                        {formattedPrice})
                                    </Typography>
                                </Stack>
                            </FancyButton>

                            <FancyButton
                                excludeCaret
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: colors.red,
                                    border: { borderColor: colors.red, borderThickness: "2px" },
                                    sx: { flex: 2, position: "relative" },
                                }}
                                sx={{ pt: 0, pb: 0, minWidth: "5rem" }}
                                onClick={onClose}
                            >
                                <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                    CANCEL
                                </Typography>
                            </FancyButton>
                        </Stack>

                        {buyError && (
                            <Typography
                                sx={{
                                    mt: ".3rem",
                                    color: "red",
                                }}
                            >
                                {buyError}
                            </Typography>
                        )}
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
