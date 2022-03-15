import { Box, Modal, Stack, Typography } from "@mui/material"
import { ClipThing } from ".."
import { FlamesPNG, GenericWarMachinePNG, SvgDamageCross, SvgDamageIcon, SvgSkull } from "../../assets"
import { colors } from "../../theme/theme"
import { DamageRecord, WarMachineDestroyedRecord, WarMachineState } from "../../types"

const WarMachineIcon = ({
    color,
    imageUrl,
    isDead,
    size,
}: {
    color: string
    imageUrl?: string
    isDead?: boolean
    size: number
}) => {
    return (
        <Box sx={{ width: "fit-content" }}>
            <ClipThing
                border={{
                    isFancy: false,
                    borderThickness: "3px",
                    borderColor: color,
                }}
                clipSize="6px"
            >
                <Box sx={{ background: `linear-gradient(${color}, #000000)` }}>
                    <Box
                        sx={{
                            position: "relative",
                            width: size,
                            height: size,
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
                                px: 3.3,
                                width: "100%",
                                height: "100%",
                                background: "linear-gradient(#00000010, #00000080)",
                                opacity: isDead ? 1 : 0,
                                transition: "all .2s",
                            }}
                        >
                            {isDead && <SvgDamageCross fill="#FF1919" size={`${size * 1.3}px`} sx={{ opacity: 0.6 }} />}
                        </Stack>

                        {!imageUrl && (
                            <SvgDamageIcon
                                size={`${size * 0.5}px`}
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
}: {
    warMachine?: WarMachineState
    name?: string
    isDead?: boolean
}) => {
    const color = warMachine ? warMachine.faction.theme.primary : colors.text
    return (
        <Stack alignItems="center" spacing={1} sx={{ width: 150 }}>
            {warMachine ? (
                <WarMachineIcon
                    color={color}
                    size={75}
                    imageUrl={warMachine.imageAvatar || GenericWarMachinePNG}
                    isDead={isDead}
                />
            ) : (
                <WarMachineIcon color={"#444444"} size={75} />
            )}
            <Typography
                variant="h6"
                sx={{
                    textAlign: "center",
                    fontFamily: "Nostromo Regular Black",
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
}: {
    warMachine?: WarMachineState
    name?: string
    damagePercent: number
}) => {
    const color = warMachine ? warMachine.faction.theme.primary : colors.text
    return (
        <Stack direction="row" alignItems="center" spacing={1.2}>
            {warMachine ? (
                <WarMachineIcon color={color} size={38} imageUrl={warMachine.imageAvatar || GenericWarMachinePNG} />
            ) : (
                <WarMachineIcon color={"#444444"} size={38} />
            )}

            <Stack spacing={0}>
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: "Nostromo Regular Black",
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
                <Typography variant="body2" sx={{ fontFamily: "Nostromo Regular Bold" }}>
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
}: {
    title: string
    damageRecords: DamageRecord[]
    top?: number
}) => {
    return (
        <Box sx={{ flex: 1 }}>
            <Box sx={{ mx: 0.8, mb: 1.3, px: 2, pt: 1.5, pb: 1.2, backgroundColor: "#00000090" }}>
                <Typography
                    variant="body2"
                    sx={{
                        textAlign: "center",
                        fontFamily: "Nostromo Regular Heavy",
                    }}
                >
                    {title}
                </Typography>
            </Box>

            <Stack spacing={1.3} sx={{ mx: 2 }}>
                {damageRecords && damageRecords.length > 0 ? (
                    damageRecords
                        .slice(0, top)
                        .map((dr, index) => (
                            <WarMachineSmall
                                key={`${dr.source_name}-${index}`}
                                warMachine={dr.caused_by_war_machine}
                                name={
                                    dr.caused_by_war_machine
                                        ? dr.caused_by_war_machine.name || dr.caused_by_war_machine.hash
                                        : dr.source_name
                                }
                                damagePercent={dr.amount / 100}
                            />
                        ))
                ) : (
                    <Typography variant="body2" sx={{ fontFamily: "Nostromo Regular Bold" }}>
                        Nothing to show...
                    </Typography>
                )}
            </Stack>
        </Box>
    )
}

export const WarMachineDestroyedInfo = ({
    open,
    toggleOpen,
    warMachineDestroyedRecord,
}: {
    open: boolean
    toggleOpen: any
    warMachineDestroyedRecord: WarMachineDestroyedRecord
}) => {
    const { destroyed_war_machine, killed_by_war_machine, killed_by, damage_records } = warMachineDestroyedRecord

    const killDamagePercent =
        damage_records
            .filter(
                (dr) =>
                    (dr.caused_by_war_machine &&
                        dr.caused_by_war_machine.participantID === killed_by_war_machine?.participantID) ||
                    dr.source_name == killed_by,
            )
            .reduce((acc, dr) => acc + dr.amount, 0) / 100

    const assistDamageMechs = damage_records
        .filter(
            (dr) =>
                dr.caused_by_war_machine &&
                dr.caused_by_war_machine.participantID !== killed_by_war_machine?.participantID,
        )
        .sort((a, b) => (b.amount > a.amount ? 1 : -1))
    const assistDamageOthers = damage_records
        .filter((dr) => !dr.caused_by_war_machine)
        .sort((a, b) => (b.amount > a.amount ? 1 : -1))

    return (
        <Modal open={open} onClose={() => toggleOpen(false)} BackdropProps={{ sx: { opacity: "0 !important" } }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 630,
                    border: "none",
                    outline: "none",
                    borderRadius: 1,
                    backgroundColor: `${colors.darkNavyBlue}99`,
                    filter: "drop-shadow(0 3px 6px #00000080)",
                }}
            >
                <Box sx={{ position: "relative" }}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            opacity: 0.15,
                            backgroundImage: `url(${FlamesPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            zIndex: -1,
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: `${colors.darkNavyBlue}40`,
                            zIndex: -2,
                        }}
                    />

                    <Box
                        sx={{
                            px: 5,
                            py: 4.5,
                        }}
                    >
                        <Stack spacing={3.8}>
                            <Stack direction="row" alignItems="center">
                                <WarMachineBig
                                    warMachine={killed_by_war_machine}
                                    name={
                                        killed_by_war_machine
                                            ? killed_by_war_machine.name || killed_by_war_machine.hash
                                            : killed_by
                                    }
                                />

                                <Stack alignItems="center" sx={{ flex: 1 }}>
                                    <SvgSkull size="120px" sx={{ mb: 1 }} />
                                    <Typography variant="h5" sx={{ fontFamily: "Nostromo Regular Heavy" }}>
                                        DESTROYED
                                    </Typography>
                                    <Typography sx={{ fontFamily: "Nostromo Regular Bold", color: colors.neonBlue }}>
                                        {killDamagePercent}% DAMAGE
                                    </Typography>
                                </Stack>

                                <WarMachineBig
                                    warMachine={destroyed_war_machine}
                                    name={destroyed_war_machine.name || destroyed_war_machine.hash}
                                    isDead
                                />
                            </Stack>

                            <Stack direction="row">
                                <DamageList title="TOP 2 ASSIST DAMAGE" damageRecords={assistDamageMechs} />
                                <DamageList title="TOP 2 OTHER DAMAGE" damageRecords={assistDamageOthers} />
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}
