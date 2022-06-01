import { Box, Modal, Skeleton, Stack, Tab, Tabs, Typography } from "@mui/material"
import { PrismicRichText, usePrismicDocumentsByType } from "@prismicio/react"
import { useEffect, useState } from "react"
import { FancyButton } from "../.."
import { useTheme } from "../../../containers/theme"
import { useToggle } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { PrismicHowToPlay, PrismicSliceType } from "../../../types/prismic"
import { ClipThing } from "../../Common/ClipThing"

export const GameGuideModal = ({ onClose }: { onClose: () => void }) => {
    const theme = useTheme()
    const [value, setValue] = useState<number>(0)
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }
    const [document, { state }] = usePrismicDocumentsByType<PrismicHowToPlay>("how_to_play_v2")
    const [showSkeleton, toggleShowSkeleton] = useToggle(true)

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    useEffect(() => {
        const timeout = setTimeout(() => {
            toggleShowSkeleton(false)
        }, 1000)

        return () => clearTimeout(timeout)
    }, [toggleShowSkeleton])

    return (
        <Modal open onClose={() => onClose()}>
            <Stack
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: "82rem",
                    boxShadow: 6,
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: primaryColor,
                        borderThickness: ".3rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={backgroundColor}
                >
                    <Stack
                        sx={{
                            height: "65vh",
                            pb: "2rem",
                        }}
                    >
                        {(state === "loading" || showSkeleton) && <LoadingSkeleton />}

                        {state === "loaded" && !showSkeleton && (
                            <Stack sx={{ flex: 1, height: 0 }}>
                                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        sx={{
                                            height: "4.5rem",
                                            ".MuiTab-root.Mui-selected": { color: primaryColor, opacity: 1 },
                                            ".MuiTabs-indicator": { backgroundColor: primaryColor },
                                            ".MuiTab-root": {
                                                height: "4.5rem",
                                                p: 0,
                                                px: "2rem",
                                                fontSize: "1.6rem",
                                                fontWeight: "fontWeightBold",
                                                opacity: 0.7,
                                                fontFamily: fonts.shareTech,
                                            },
                                        }}
                                    >
                                        {document &&
                                            document.results[0].data.body.map((item, i) => {
                                                return <Tab label={`${item.primary.section_title[0] ? item.primary.section_title[0].text : ""}`} key={i} />
                                            })}
                                    </Tabs>
                                </Box>
                                <Box
                                    sx={{
                                        flex: 1,
                                        height: 0,
                                        overflowY: "scroll",
                                        scrollbarWidth: "none",
                                        scrollBehavior: "smooth",
                                        display: "flex",
                                        flexDirection: "column",
                                        mr: ".8rem",
                                        mt: "1rem",
                                        mb: "2rem",
                                        px: "3rem",
                                        pt: "1.5rem",
                                        pb: "1rem",
                                        "::-webkit-scrollbar": {
                                            width: ".4rem",
                                        },
                                        "::-webkit-scrollbar-track": {
                                            background: "#FFFFFF15",
                                            borderRadius: 3,
                                        },
                                        "::-webkit-scrollbar-thumb": {
                                            background: `${primaryColor}`,
                                            borderRadius: 3,
                                        },
                                        a: {
                                            color: colors.neonBlue,
                                        },
                                    }}
                                >
                                    {document &&
                                        document.results[0].data.body.map((item, i) => {
                                            return (
                                                <TabPanel value={value} index={i} key={i}>
                                                    <Stack spacing={2}>
                                                        <PrismicRichText field={item.primary.section_header} />
                                                        <PrismicRichText field={item.primary.section_content} />
                                                        {item.slice_type === PrismicSliceType.MultiContent &&
                                                            item.items.map((item, i) => {
                                                                return (
                                                                    <ClipThing
                                                                        key={i}
                                                                        clipSize="4px"
                                                                        border={{
                                                                            isFancy: true,
                                                                            borderColor: colors.offWhite,
                                                                            borderThickness: ".15rem",
                                                                        }}
                                                                        opacity={0.6}
                                                                        backgroundColor={backgroundColor}
                                                                    >
                                                                        <Box
                                                                            sx={{
                                                                                px: "2rem",
                                                                                py: "1.5rem",
                                                                            }}
                                                                        >
                                                                            <Stack direction="row" spacing="1.3rem">
                                                                                <Box
                                                                                    sx={{
                                                                                        mt: ".2rem",
                                                                                        p: ".5rem",
                                                                                        alignSelf: "flex-start",
                                                                                        flexShrink: 0,
                                                                                        backgroundColor: `${colors.lightNeonBlue}20`,
                                                                                        borderRadius: 0.6,
                                                                                    }}
                                                                                >
                                                                                    <Box
                                                                                        sx={{
                                                                                            height: "3.2rem",
                                                                                            width: "3.2rem",
                                                                                            backgroundImage: `url(${
                                                                                                item.section_image_link ? item.section_image_link.url : ""
                                                                                            })`,
                                                                                            backgroundRepeat: "no-repeat",
                                                                                            backgroundPosition: "center",
                                                                                            backgroundSize: "contain",
                                                                                        }}
                                                                                    />
                                                                                </Box>

                                                                                <Stack>
                                                                                    <PrismicRichText field={item.section_content_title} />
                                                                                    <PrismicRichText field={item.section_content_subheader} />
                                                                                    <PrismicRichText field={item.section_content_subsubheader} />
                                                                                    <PrismicRichText field={item.section_content_body} />
                                                                                </Stack>
                                                                            </Stack>
                                                                        </Box>
                                                                    </ClipThing>
                                                                )
                                                            })}
                                                    </Stack>
                                                </TabPanel>
                                            )
                                        })}
                                </Box>
                            </Stack>
                        )}

                        <FancyButton
                            excludeCaret
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: backgroundColor,
                                opacity: 1,
                                border: { borderColor: primaryColor, borderThickness: "1.5px" },
                                sx: { position: "relative", width: "10rem", ml: "2.6rem", mt: "auto" },
                            }}
                            sx={{ px: "1.6rem", py: ".6rem", color: primaryColor }}
                            onClick={() => onClose()}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: primaryColor,
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                CLOSE
                            </Typography>
                        </FancyButton>
                    </Stack>
                </ClipThing>
            </Stack>
        </Modal>
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props

    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} {...other}>
            {value === index && <Box>{children}</Box>}
        </div>
    )
}

const LoadingSkeleton = () => (
    <Box sx={{ width: "82rem", maxWidth: "80vw", flex: 1, height: 0, pr: "1.2rem", py: "1.2rem" }}>
        <Stack
            sx={{
                overflowY: "scroll",
                width: "100%",
                px: "1.5rem",
                height: "100%",
                scrollbarWidth: "none",
                scrollBehavior: "smooth",
                "::-webkit-scrollbar": {
                    width: ".4rem",
                },
                "::-webkit-scrollbar-track": {
                    background: "#FFFFFF15",
                    borderRadius: 3,
                },
                "::-webkit-scrollbar-thumb": {
                    background: `${colors.neonBlue}`,
                    borderRadius: 3,
                },
            }}
        >
            <Stack direction="row" spacing="1.5rem" sx={{}}>
                {new Array(3).fill(0).map((_, index) => (
                    <Skeleton key={index} variant="text" width="10rem" height="4rem" />
                ))}
            </Stack>

            <Stack sx={{ width: "100%" }} spacing="0.5rem">
                <Box>
                    <Skeleton variant="text" width="15rem" height="4rem" />
                    {new Array(6).fill(0).map((_, index) => (
                        <Skeleton variant="text" width="100%" height="2.6rem" key={index} />
                    ))}
                </Box>

                <Box>
                    <Skeleton variant="text" width="25rem" height="4rem" />
                    {new Array(10).fill(0).map((_, index) => (
                        <Skeleton variant="text" width="100%" height="2.6rem" key={index} />
                    ))}
                </Box>
            </Stack>
        </Stack>
    </Box>
)
