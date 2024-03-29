import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { FlamesPNG, GenericWarMachinePNG, SvgDamageCross, SvgDamageIcon, SvgSkull } from "../../../../assets"
import { useGlobalNotifications } from "../../../../containers"
import { GetMechDestroyedInfo } from "../../../../fetching"
import { truncateTextLines } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { DamageRecord, FactionWithPalette, WarMachineDestroyedRecord, WarMachineState } from "../../../../types"
import { NiceBoxThing } from "../../../Common/Nice/NiceBoxThing"
import { NiceModal } from "../../../Common/Nice/NiceModal"
import { TypographyTruncated } from "../../../Common/TypographyTruncated"

export const WarMachineDestroyedInfo = ({
    warMachine,
    open,
    onClose,
    getFaction,
}: {
    warMachine: WarMachineState
    open: boolean
    onClose: () => void
    getFaction: (factionID: string) => FactionWithPalette
}) => {
    const { newSnackbarMessage } = useGlobalNotifications()
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
                    <CircularProgress />
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
    }, [getFaction, warMachineDestroyedRecord])

    return (
        <NiceModal open={open} onClose={onClose} sx={{ position: "relative", width: "63rem", maxWidth: "unset" }}>
            <Box>
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
        </NiceModal>
    )
}

const WarMachineIcon = ({ color, imageUrl, isDead, size }: { color: string; imageUrl?: string; isDead?: boolean; size: number }) => {
    return (
        <NiceBoxThing border={{ color: `${color}60` }} background={{ colors: [color, "#000000"] }} sx={{ width: "fit-content" }}>
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
                        {isDead && <SvgDamageCross fill={colors.red} size={`${size * 1.3}rem`} sx={{ opacity: 0.6 }} />}
                    </Stack>

                    {!imageUrl && (
                        <SvgDamageIcon
                            size={`${size * 0.5}rem`}
                            fill={colors.grey}
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
        </NiceBoxThing>
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
    getFaction: (factionID: string) => FactionWithPalette
}) => {
    const color = getFaction(warMachine?.factionID || "").palette.primary || colors.text
    return (
        <Stack alignItems="center" spacing=".8rem" sx={{ width: "15rem" }}>
            {warMachine ? (
                <WarMachineIcon color={color} size={7.5} imageUrl={warMachine.imageAvatar || GenericWarMachinePNG} isDead={isDead} />
            ) : (
                <WarMachineIcon color={"#444444"} size={7.5} />
            )}
            <TypographyTruncated
                variant="h6"
                sx={{
                    textAlign: "center",
                    fontFamily: fonts.nostromoBlack,
                    ...truncateTextLines(2),
                    color,
                }}
            >
                {name}
            </TypographyTruncated>
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
    getFaction: (factionID: string) => FactionWithPalette
}) => {
    const color = getFaction(warMachine?.factionID || "").palette.primary || colors.text
    return (
        <Stack direction="row" alignItems="center" spacing=".96rem">
            {warMachine ? (
                <WarMachineIcon color={color} size={3.8} imageUrl={warMachine.imageAvatar || GenericWarMachinePNG} />
            ) : (
                <WarMachineIcon color={"#444444"} size={3.8} />
            )}

            <Stack>
                <TypographyTruncated
                    variant="body2"
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                        ...truncateTextLines(1),
                        color,
                    }}
                >
                    {name}
                </TypographyTruncated>
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
    getFaction: (factionID: string) => FactionWithPalette
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
