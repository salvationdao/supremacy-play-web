import { Box, Modal, Stack, Theme, Typography, useTheme } from "@mui/material"
import { ClipThing } from ".."
import { FlamesPNG, GenericWarMachinePNG, SvgDamageCross, SvgDamageIcon, SvgSkull } from "../../assets"
import { colors } from "../../theme/theme"
import { DamageRecord, WarMachineDestroyedRecord, WarMachineState } from "../../types"

const WarMachineIcon = ({ color, imageUrl, isDead, size }: { color: string; imageUrl?: string; isDead?: boolean; size: number }) => {
    return (
        <Box sx={{ width: "fit-content" }}>
            <ClipThing
                border={{
                    isFancy: false,
                    borderThickness: ".2rem",
                    borderColor: color,
                }}
                clipSize="6px"
            >
                <Box sx={{ background: `linear-gradient(${color}, #000000)` }}>
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

const WarMachineBig = ({ warMachine, name, isDead }: { warMachine?: WarMachineState; name?: string; isDead?: boolean }) => {
    const color = warMachine ? warMachine.faction.theme.primary : colors.text
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

const WarMachineSmall = ({ warMachine, name, damagePercent }: { warMachine?: WarMachineState; name?: string; damagePercent: number }) => {
    const color = warMachine ? warMachine.faction.theme.primary : colors.text
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

const DamageList = ({ title, damageRecords, top = 2 }: { title: string; damageRecords: DamageRecord[]; top?: number }) => {
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
                        fontFamily: "Nostromo Regular Heavy",
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
    onClose,
    warMachineDestroyedRecord,
}: {
    open: boolean
    onClose: () => void
    warMachineDestroyedRecord: WarMachineDestroyedRecord
}) => {
    const theme = useTheme<Theme>()
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
        <Modal open={open} onClose={onClose} BackdropProps={{ sx: { opacity: "0.1 !important" } }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "63rem",
                    border: "none",
                    outline: "none",
                    boxShadow: 6,
                }}
            >
                <ClipThing
                    clipSize="0"
                    border={{
                        isFancy: true,
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".2rem",
                    }}
                >
                    <Box sx={{ position: "relative", backgroundColor: theme.factionTheme.background }}>
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

                        <Box
                            sx={{
                                px: "4rem",
                                py: "3.6rem",
                                zIndex: 1,
                            }}
                        >
                            <Stack spacing="3.04rem">
                                <Stack direction="row" alignItems="center">
                                    <WarMachineBig
                                        warMachine={killed_by_war_machine}
                                        name={killed_by_war_machine ? killed_by_war_machine.name || killed_by_war_machine.hash : killed_by}
                                    />

                                    <Stack alignItems="center" sx={{ flex: 1 }}>
                                        <SvgSkull size="12rem" sx={{ mb: ".8rem" }} />
                                        <Typography variant="h5" sx={{ fontFamily: "Nostromo Regular Heavy" }}>
                                            DESTROYED
                                        </Typography>
                                        <Typography sx={{ fontFamily: "Nostromo Regular Bold", color: colors.neonBlue }}>
                                            {killDamagePercent}% DAMAGE
                                        </Typography>
                                    </Stack>

                                    <WarMachineBig warMachine={destroyed_war_machine} name={destroyed_war_machine.name || destroyed_war_machine.hash} isDead />
                                </Stack>

                                <Stack direction="row">
                                    <DamageList title="TOP 2 ASSIST DAMAGE" damageRecords={assistDamageMechs} />
                                    <DamageList title="TOP 2 OTHER DAMAGE" damageRecords={assistDamageOthers} />
                                </Stack>
                            </Stack>
                        </Box>
                    </Box>
                </ClipThing>
            </Box>
        </Modal>
    )
}
