import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo } from "react"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../../assets"
import { useMiniMapPixi } from "../../../../containers"
import { TruncateTextLines } from "../../../../theme/styles"
import { colors } from "../../../../theme/theme"
import { LocationSelectType, AnyAbility } from "../../../../types"
import { FancyButton } from "../../../Common/Deprecated/FancyButton"
import { NiceTooltip } from "../../../Common/Nice/NiceTooltip"

export const SupportAbilityCard = ({ supportAbility }: { supportAbility: AnyAbility }) => {
    const { useAnyAbility } = useMiniMapPixi()

    const abilityTypeIcon = useMemo(() => {
        switch (supportAbility.location_select_type) {
            case LocationSelectType.Global:
                return <SvgGlobal size="1.5rem" />
            case LocationSelectType.LocationSelect:
                return <SvgTarget size="1.5rem" />
            case LocationSelectType.MechSelect:
                return <SvgMicrochip size="1.5rem" />
            case LocationSelectType.MechSelectAllied:
                return <SvgMicrochip size="1.5rem" />
            case LocationSelectType.MechSelectOpponent:
                return <SvgMicrochip size="1.5rem" />
            case LocationSelectType.LineSelect:
                return <SvgLine size="1.5rem" />
        }
        return <SvgQuestionMark size="1.5rem" />
    }, [supportAbility])

    const onActivate = useCallback(() => {
        useAnyAbility.current({ ...supportAbility, isSupportAbility: true })
    }, [supportAbility, useAnyAbility])

    return (
        <NiceTooltip color={supportAbility.colour} text={supportAbility.description} placement="bottom">
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
                    border: { borderColor: supportAbility.colour, borderThickness: "1.5px" },
                    sx: { position: "relative", px: ".4rem", py: ".3rem" },
                }}
                sx={{
                    color: supportAbility.colour,
                    p: 0,
                    minWidth: 0,
                    height: "100%",
                }}
                onClick={onActivate}
            >
                <Stack
                    spacing=".3rem"
                    sx={{
                        height: "100%",
                        ":hover img": {
                            transform: "scale(1.2)",
                            filter: "brightness(2)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            pt: "100%", // 1:1 width-height ratio
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: ".5rem",
                                left: ".5rem",
                                zIndex: 2,
                            }}
                        >
                            {abilityTypeIcon}
                        </Box>

                        <Box
                            component="img"
                            src={supportAbility.image_url}
                            alt={`Thumbnail image for ${supportAbility.label}`}
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
                            ...TruncateTextLines(2),
                            fontWeight: "fontWeightBold",
                        }}
                    >
                        {supportAbility.label}
                    </Typography>
                </Stack>
            </FancyButton>
        </NiceTooltip>
    )
}
