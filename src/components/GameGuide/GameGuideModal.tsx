import { Box, Button, Modal, Skeleton, Stack, Tab, Tabs } from "@mui/material"
import { PrismicRichText, usePrismicDocumentsByType } from "@prismicio/react"
import { useEffect, useState } from "react"
import { useToggle } from "../../hooks"
import { colors } from "../../theme/theme"
import { PrismicHowToPlay, PrismicSliceType } from "../../types/prismic"
import { ClipThing } from "../Common/ClipThing"

const LoadingSkeleton = () => (
    <Box sx={{ width: "82rem", flex: 1, height: 0, pr: "1.2rem", py: "1.2rem" }}>
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
                    <Skeleton key={index} variant="text" width="10rem" height="5rem" />
                ))}
            </Stack>

            <Stack sx={{ width: "100%", mt: "1rem" }} spacing="0.5rem">
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

interface GameGuideModalProps {
    toggleClosed: (value: boolean) => void
    closed: boolean
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

export const GameGuideModal = ({ toggleClosed, closed }: GameGuideModalProps) => {
    const [value, setValue] = useState<number>(0)
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }
    const [document, { state }] = usePrismicDocumentsByType<PrismicHowToPlay>("how_to_play_v2")
    const [showSkeleton, toggleShowSkeleton] = useToggle(true)

    useEffect(() => {
        setTimeout(() => {
            toggleShowSkeleton(false)
        }, 1000)
    }, [])

    return (
        <Modal open={!closed} onClose={() => toggleClosed(true)}>
            <Stack
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: "82rem",
                    boxShadow: 24,
                }}
            >
                <ClipThing
                    clipSize="0"
                    border={{
                        isFancy: true,
                        borderColor: "#FFFFFF",
                        borderThickness: ".3rem",
                    }}
                    innerSx={{ position: "relative" }}
                >
                    <Stack
                        sx={{
                            height: "65vh",
                            pb: "2rem",
                            backgroundColor: `${colors.darkNavyBlue}`,
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
                                            height: "5rem",
                                            ".MuiTab-root.Mui-selected": { color: colors.neonBlue, opacity: 1 },
                                            ".MuiTabs-indicator": { backgroundColor: colors.neonBlue },
                                            ".MuiTab-root": {
                                                height: "5rem",
                                                p: 0,
                                                px: "2rem",
                                                fontSize: "1.6rem",
                                                opacity: 0.7,
                                                fontFamily: "Share Tech",
                                            },
                                        }}
                                    >
                                        {document &&
                                            document.results[0].data.body.map((item, i) => {
                                                return (
                                                    <Tab
                                                        label={`${
                                                            item.primary.section_title[0]
                                                                ? item.primary.section_title[0].text
                                                                : ""
                                                        }`}
                                                        key={i}
                                                    />
                                                )
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
                                            background: `${colors.neonBlue}`,
                                            borderRadius: 3,
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
                                                                        clipSize="0"
                                                                        border={{
                                                                            isFancy: true,
                                                                            borderColor: colors.offWhite,
                                                                            borderThickness: ".1rem",
                                                                        }}
                                                                        key={i}
                                                                    >
                                                                        <Box
                                                                            sx={{
                                                                                px: "2rem",
                                                                                py: "1.5rem",
                                                                                backgroundColor: colors.darkNavyBlue,
                                                                            }}
                                                                        >
                                                                            <Stack direction="row" spacing="1.3rem">
                                                                                <Box
                                                                                    sx={{
                                                                                        height: "3.2rem",
                                                                                        width: "3.2rem",
                                                                                        mt: ".2rem",
                                                                                        flexShrink: 0,
                                                                                        backgroundImage: `url(${
                                                                                            item.section_image_link
                                                                                                ? item
                                                                                                      .section_image_link
                                                                                                      .url
                                                                                                : ""
                                                                                        })`,
                                                                                        backgroundRepeat: "no-repeat",
                                                                                        backgroundPosition:
                                                                                            "top center",
                                                                                        backgroundSize: "contain",
                                                                                        border: `${"#FFFFFF"} 1px solid`,
                                                                                        borderRadius: 0.6,
                                                                                    }}
                                                                                />
                                                                                <Stack>
                                                                                    <PrismicRichText
                                                                                        field={
                                                                                            item.section_content_title
                                                                                        }
                                                                                    />
                                                                                    <PrismicRichText
                                                                                        field={
                                                                                            item.section_content_subheader
                                                                                        }
                                                                                    />
                                                                                    <PrismicRichText
                                                                                        field={
                                                                                            item.section_content_subsubheader
                                                                                        }
                                                                                    />
                                                                                    <PrismicRichText
                                                                                        field={
                                                                                            item.section_content_body
                                                                                        }
                                                                                    />
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

                        <Button
                            variant="outlined"
                            onClick={() => toggleClosed(true)}
                            sx={{
                                justifySelf: "flex-end",
                                mt: "auto",
                                ml: 3,
                                pt: ".7rem",
                                pb: ".4rem",
                                width: "9rem",
                                color: colors.neonBlue,
                                backgroundColor: colors.darkNavy,
                                borderRadius: 0.7,
                                fontFamily: "Nostromo Regular Bold",
                                border: `${colors.neonBlue} 1px solid`,
                                ":hover": {
                                    opacity: 0.8,
                                    border: `${colors.neonBlue} 1px solid`,
                                },
                            }}
                        >
                            Close
                        </Button>
                    </Stack>
                </ClipThing>
            </Stack>
        </Modal>
    )
}
