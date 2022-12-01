import { Stack, SxProps, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { useGameServerSubscriptionSecured } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { pulseEffect } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { RepairStatus } from "../../../types/jobs"

export const RepairBlocks = ({
    defaultBlocks,
    remainDamagedBlocks,
    showNumber,
    size = 8.4,
    pulsateEffectPercent,
    sx,
}: {
    defaultBlocks?: number
    remainDamagedBlocks: number
    showNumber?: boolean
    size?: number
    pulsateEffectPercent?: number // Out of 100
    sx?: SxProps
}) => {
    const remainDamagedBlocksFix = Math.max(remainDamagedBlocks, 0)
    return (
        <Stack direction="row" alignItems="center" spacing=".5rem" sx={{ width: "100%", ...sx }}>
            <Stack
                direction="row"
                flexWrap="wrap"
                alignItems="center"
                sx={{
                    "& > div": {
                        p: `${size * 0.36}px`,
                        ".single-block": {
                            overflow: "hidden",
                            position: "relative",
                            height: `${size}px`,
                            width: `${size}px`,
                            backgroundColor: defaultBlocks ? colors.red : "#FFFFFF35",
                        },
                    },

                    [`& > div:nth-of-type(-n+${defaultBlocks ? defaultBlocks - remainDamagedBlocksFix : 0})`]: {
                        ".single-block": {
                            backgroundColor: colors.green,
                        },
                    },

                    // Pulsate effect
                    ...(pulsateEffectPercent && pulsateEffectPercent > 0
                        ? {
                              [`& > div:nth-of-type(${defaultBlocks ? Math.max(defaultBlocks - remainDamagedBlocksFix + 1, 1) : 1})`]: {
                                  ".single-block": {
                                      animation: `${pulseEffect} 3s infinite`,

                                      "::after": {
                                          content: '""',
                                          position: "absolute",
                                          top: "-3px",
                                          left: 0,
                                          bottom: "-3px",
                                          width: `${pulsateEffectPercent}%`,
                                          backgroundColor: colors.green,
                                      },
                                  },
                              },
                          }
                        : {}),
                }}
            >
                {new Array(defaultBlocks || remainDamagedBlocksFix).fill(0).map((_, index) => (
                    <div key={index}>
                        <div className="single-block" />
                    </div>
                ))}

                {showNumber && defaultBlocks && remainDamagedBlocksFix > 0 && (
                    <Typography
                        variant="caption"
                        sx={{
                            ml: ".5rem",
                            pt: ".8px",
                            lineHeight: 1,
                            fontFamily: fonts.nostromoBlack,
                            color: remainDamagedBlocksFix > 0 ? colors.red : colors.green,
                        }}
                    >
                        {remainDamagedBlocksFix || defaultBlocks}
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}

export const MechRepairBlocks = React.memo(function MechRepairBlocks({
    mechID,
    defaultBlocks,
    damagedBlocks,
    showNumber,
    pulsateEffectPercent,
    size,
    sx,
}: {
    mechID?: string
    defaultBlocks?: number
    damagedBlocks?: number
    showNumber?: boolean
    pulsateEffectPercent?: number
    size?: number
    sx?: SxProps
}) {
    const repairStatus = useGameServerSubscriptionSecured<RepairStatus>({
        URI: `/mech/${mechID}/repair_case`,
        key: GameServerKeys.SubMechRepairStatus,
        ready: damagedBlocks === undefined && !!mechID,
    })

    const remainDamagedBlocks = useMemo(() => {
        if (damagedBlocks) {
            return damagedBlocks
        } else if (repairStatus) {
            return repairStatus.blocks_required_repair - repairStatus.blocks_repaired
        }

        return 0
    }, [damagedBlocks, repairStatus])

    return (
        <RepairBlocks
            defaultBlocks={defaultBlocks}
            remainDamagedBlocks={remainDamagedBlocks}
            showNumber={showNumber}
            pulsateEffectPercent={pulsateEffectPercent}
            size={size}
            sx={sx}
        />
    )
})
