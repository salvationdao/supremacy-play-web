import { Box, Modal, Stack, Typography } from '@mui/material'
import { ClipThing } from '..'
import { FlamesPNG, GenericWarMachinePNG, SvgDamageCross, SvgDamageIcon, SvgSkull } from '../../assets'
import { colors } from '../../theme/theme'
import { DamageRecord, WarMachineDestroyedRecord, WarMachineState } from '../../types'

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
        <Box sx={{ width: 'fit-content' }}>
            <ClipThing
                border={{
                    isFancy: false,
                    borderThickness: '3px',
                    borderColor: color,
                }}
                clipSize="6px"
            >
                <Box sx={{ background: `linear-gradient(${color}, #000000)` }}>
                    <Box
                        sx={{
                            position: 'relative',
                            width: size,
                            height: size,
                            overflow: 'hidden',
                            backgroundImage: `url(${imageUrl})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                        }}
                    >
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                px: 3.3,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(#00000010, #00000080)',
                                opacity: isDead ? 1 : 0,
                                transition: 'all .2s',
                            }}
                        >
                            {isDead && <SvgDamageCross fill="#FF1919" size={`${size * 1.3}px`} sx={{ opacity: 0.6 }} />}
                        </Stack>

                        {!imageUrl && (
                            <SvgDamageIcon
                                size={`${size * 0.5}px`}
                                fill="#8C8C8C"
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
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
                    imageUrl={warMachine.imageUrl || GenericWarMachinePNG}
                    isDead={isDead}
                />
            ) : (
                <WarMachineIcon color={'#333333'} size={75} />
            )}
            <Typography
                variant="h6"
                sx={{
                    textAlign: 'center',
                    fontFamily: 'Nostromo Regular Black',
                    display: '-webkit-box',
                    overflow: 'hidden',
                    overflowWrap: 'anywhere',
                    textOverflow: 'ellipsis',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    color,
                }}
            >
                {name}
            </Typography>
        </Stack>
    )
}

const WarMachineSmall = ({ warMachine, name }: { warMachine?: WarMachineState; name?: string }) => {
    // If warMachine is null, then use name and a generic picture
    return null
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
    return null
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
    const { destroyedWarMachine, killedByWarMachine, killedBy, damageRecords } = warMachineDestroyedRecord

    const killDamagePercent =
        damageRecords
            .filter(
                (dr) =>
                    (dr.causedByWarMachine &&
                        dr.causedByWarMachine.participantID == killedByWarMachine?.participantID) ||
                    dr.sourceName == killedBy,
            )
            .reduce((acc, dr) => acc + dr.amount, 0) / 100
    const assistDamageMechs = damageRecords
        .filter((dr) => dr.causedByWarMachine)
        .sort((a, b) => (b.amount > a.amount ? 1 : -1))
    const assistDamageOthers = damageRecords
        .filter((dr) => !dr.causedByWarMachine)
        .sort((a, b) => (b.amount > a.amount ? 1 : -1))

    return (
        <Modal open={open} onClose={() => toggleOpen(false)} BackdropProps={{ sx: { opacity: '0 !important' } }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    border: 'none',
                    outline: 'none',
                    borderRadius: 1,
                    backgroundColor: `${colors.darkNavyBlue}99`,
                    filter: 'drop-shadow(0 3px 6px #00000080)',
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            opacity: 0.3,
                            backgroundImage: `url(${FlamesPNG})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                        }}
                    />

                    <Box
                        sx={{
                            px: 5,
                            pt: 6,
                            pb: 5,
                        }}
                    >
                        <Stack>
                            <Stack direction="row" alignItems="center">
                                <WarMachineBig
                                    warMachine={killedByWarMachine}
                                    name={killedByWarMachine ? killedByWarMachine.name : killedBy}
                                />

                                <Stack alignItems="center" sx={{ flex: 1 }}>
                                    <SvgSkull fill="#FFFFFF" size="128px" sx={{ mb: 1 }} />
                                    <Typography
                                        sx={{
                                            fontFamily: 'Nostromo Regular Heavy',
                                            fontSize: '1.5rem',
                                            color: '#FFFFFF',
                                        }}
                                    >
                                        DESTROYED
                                    </Typography>
                                    <Typography sx={{ fontFamily: 'Nostromo Regular Bold', color: colors.neonBlue }}>
                                        {killDamagePercent}% DAMAGE
                                    </Typography>
                                </Stack>

                                <WarMachineBig
                                    warMachine={destroyedWarMachine}
                                    name={destroyedWarMachine.name}
                                    isDead
                                />
                            </Stack>

                            <Stack direction="row">
                                <DamageList title="ASSIST DAMAGE" damageRecords={assistDamageMechs} />
                                <DamageList title="WEAPON DAMAGE" damageRecords={assistDamageOthers} />
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}
