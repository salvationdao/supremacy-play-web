import { Box, CircularProgress, IconButton, Modal, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { ClipThing } from ".."
import { FlamesPNG, GenericWarMachinePNG, SvgClose, SvgDamageCross, SvgDamageIcon, SvgSkull } from "../../assets"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { DamageRecord, Faction, WarMachineDestroyedRecord, WarMachineState } from "../../types"
import { useTheme } from "../../containers/theme"
import { useSnackbar } from "../../containers"
import { useParameterizedQuery } from "react-fetching-library"
import { GetMechDestroyedInfo } from "../../fetching"

export const WarMachineDestroyedInfo = ({
    warMachine,
    open,
    onClose,
    getFaction,
}: {
    warMachine: WarMachineState
    open: boolean
    onClose: () => void
    getFaction: (factionID: string) => Faction
}) => {
    const theme = useTheme()
    const { newSnackbarMessage } = useSnackbar()
    const { query: queryGetMechDestroyedInfo } = useParameterizedQuery(GetMechDestroyedInfo)
    const [warMachineDestroyedRecord, setWarMachineDestroyedRecord] = useState<WarMachineDestroyedRecord>()

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await queryGetMechDestroyedInfo(warMachine.id)
                if (resp.error || !resp.payload) return
                setWarMachineDestroyedRecord(resp.payload)
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to retrieve mech destroyed info.", "error")
                console.error(e)
            }
        })()
    }, [newSnackbarMessage, queryGetMechDestroyedInfo, warMachine.id])

    const content = useMemo(() => {
        if (!warMachineDestroyedRecord)
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "20rem" }}>
                    <CircularProgress size="1.8rem" sx={{ color: theme.factionTheme.primary }} />
                </Stack>
            )

        const { destroyed_war_machine, killed_by_war_machine, killed_by, damage_records } = warMachineDestroyedRecord

        const killDamagePercent =
            damage_records
                .filter(
                    (dr) =>
                        (dr.caused_by_war_machine && dr.caused_by_war_machine.participantID === killed_by_war_machine?.participantID) ||
                        dr.source_name == killed_by,
                )
                .reduce((acc, dr) => acc + dr.amount, 0) / 100

        const assistDamageMechs = damage_records
            .filter((dr) => dr.caused_by_war_machine && dr.caused_by_war_machine.participantID !== killed_by_war_machine?.participantID)
            .sort((a, b) => (b.amount > a.amount ? 1 : -1))

        const assistDamageOthers = damage_records.filter((dr) => !dr.caused_by_war_machine).sort((a, b) => (b.amount > a.amount ? 1 : -1))

        return (
            <Stack
                spacing="3.04rem"
                sx={{
                    px: "4rem",
                    py: "3.6rem",
                    zIndex: 1,
                }}
            >
                <Stack direction="row" alignItems="center">
                    <WarMachineBig
                        warMachine={killed_by_war_machine}
                        name={killed_by_war_machine ? killed_by_war_machine.name || killed_by_war_machine.hash : killed_by}
                        getFaction={getFaction}
                    />

                    <Stack alignItems="center" sx={{ flex: 1 }}>
                        <SvgSkull size="12rem" sx={{ mb: ".8rem" }} />
                        <Typography variant="h5" sx={{ fontFamily: fonts.nostromoHeavy }}>
                            DESTROYED
                        </Typography>
                        <Typography sx={{ fontFamily: fonts.nostromoBold, color: colors.neonBlue }}>{killDamagePercent}% DAMAGE</Typography>
                    </Stack>

                    <WarMachineBig
                        warMachine={destroyed_war_machine}
                        name={destroyed_war_machine.name || destroyed_war_machine.hash}
                        isDead
                        getFaction={getFaction}
                    />
                </Stack>

                <Stack direction="row">
                    <DamageList title="TOP 2 ASSIST DAMAGE" damageRecords={assistDamageMechs} getFaction={getFaction} />
                    <DamageList title="TOP 2 OTHER DAMAGE" damageRecords={assistDamageOthers} getFaction={getFaction} />
                </Stack>
            </Stack>
        )
    }, [getFaction, theme.factionTheme.primary, warMachineDestroyedRecord])

    return (
        <Modal open={open} onClose={onClose} sx={{ zIndex: siteZIndex.Modal }} BackdropProps={{ sx: { opacity: "0.1 !important" } }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "63rem",
                    border: "none",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={theme.factionTheme.background}
                    sx={{ position: "relative" }}
                >
                    <Box sx={{ position: "relative" }}>
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                opacity: 0.06,
                                backgroundImage: `url(${FlamesPNG})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                zIndex: 0,
                            }}
                        />

                        {content}
                    </Box>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}

const WarMachineIcon = ({ color, imageUrl, isDead, size }: { color: string; imageUrl?: string; isDead?: boolean; size: number }) => {
    return (
        <Box sx={{ width: "fit-content" }}>
            <ClipThing
                clipSize="6px"
                border={{
                    borderThickness: ".2rem",
                    borderColor: color,
                }}
                innerSx={{ background: `linear-gradient(${color}, #000000)` }}
            >
                <Box>
                    <Box
                        sx={{
                            position: "relative",
                            width: `${size}rem`,
                            height: `${size}rem`,
                            overflow: "hidden",
                            backgroundImage: `url(${imageUrl})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    >
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                px: "2.64rem",
                                width: "100%",
                                height: "100%",
                                background: "linear-gradient(#00000010, #00000080)",
                                opacity: isDead ? 1 : 0,
                                transition: "all .2s",
                            }}
                        >
                            {isDead && <SvgDamageCross fill="#FF1919" size={`${size * 1.3}rem`} sx={{ opacity: 0.6 }} />}
                        </Stack>

                        {!imageUrl && (
                            <SvgDamageIcon
                                size={`${size * 0.5}rem`}
                                fill="#8C8C8C"
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </ClipThing>
        </Box>
    )
}

const WarMachineBig = ({
    warMachine,
    name,
    isDead,
    getFaction,
}: {
    warMachine?: WarMachineState
    name?: string
    isDead?: boolean
    getFaction: (factionID: string) => Faction
}) => {
    const color = getFaction(warMachine?.factionID || "").primary_color || colors.text
    return (
        <Stack alignItems="center" spacing=".8rem" sx={{ width: "15rem" }}>
            {warMachine ? (
                <WarMachineIcon color={color} size={7.5} imageUrl={warMachine.imageAvatar || GenericWarMachinePNG} isDead={isDead} />
            ) : (
                <WarMachineIcon color={"#444444"} size={7.5} />
            )}
            <Typography
                variant="h6"
                sx={{
                    textAlign: "center",
                    fontFamily: fonts.nostromoBlack,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    color,
                }}
            >
                {name}
            </Typography>
        </Stack>
    )
}

const WarMachineSmall = ({
    warMachine,
    name,
    damagePercent,
    getFaction,
}: {
    warMachine?: WarMachineState
    name?: string
    damagePercent: number
    getFaction: (factionID: string) => Faction
}) => {
    const color = getFaction(warMachine?.factionID || "").primary_color || colors.text
    return (
        <Stack direction="row" alignItems="center" spacing=".96rem">
            {warMachine ? (
                <WarMachineIcon color={color} size={3.8} imageUrl={warMachine.imageAvatar || GenericWarMachinePNG} />
            ) : (
                <WarMachineIcon color={"#444444"} size={3.8} />
            )}

            <Stack>
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        color,
                    }}
                >
                    {name}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBold }}>
                    {damagePercent}%
                </Typography>
            </Stack>
        </Stack>
    )
}

const DamageList = ({
    title,
    damageRecords,
    top = 2,
    getFaction,
}: {
    title: string
    damageRecords: DamageRecord[]
    top?: number
    getFaction: (factionID: string) => Faction
}) => {
    return (
        <Box sx={{ flex: 1 }}>
            <Box
                sx={{
                    mx: "1rem",
                    mb: "1.04rem",
                    px: "1.6rem",
                    pt: "1.2rem",
                    pb: ".96rem",
                    backgroundColor: "#000000",
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        textAlign: "center",
                        fontFamily: fonts.nostromoHeavy,
                    }}
                >
                    {title}
                </Typography>
            </Box>

            <Stack spacing="1.04rem" sx={{ mx: "2rem" }}>
                {damageRecords && damageRecords.length > 0 ? (
                    damageRecords
                        .slice(0, top)
                        .map((dr, index) => (
                            <WarMachineSmall
                                key={`${dr.source_name}-${index}`}
                                warMachine={dr.caused_by_war_machine}
                                name={dr.caused_by_war_machine ? dr.caused_by_war_machine.name || dr.caused_by_war_machine.hash : dr.source_name}
                                damagePercent={dr.amount / 100}
                                getFaction={getFaction}
                            />
                        ))
                ) : (
                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBold }}>
                        Nothing to show...
                    </Typography>
                )}
            </Stack>
        </Box>
    )
}
