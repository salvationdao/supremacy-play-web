import { Box, Stack, Typography } from "@mui/material"
import { getRarityDeets } from "../../../../helpers"
import { fonts } from "../../../../theme/theme"
import { AssetToSellStruct } from "../SellItem"

export const AssetItem = ({
    assetToSell,
    playVideo,
    onClick,
    orientation = "horizontal",
}: {
    assetToSell: AssetToSellStruct
    playVideo?: boolean
    onClick?: () => void
    orientation?: "horizontal" | "vertical"
}) => {
    const rarityDeets = assetToSell.tier ? getRarityDeets(assetToSell.tier) : undefined

    return (
        <Stack
            direction={orientation === "horizontal" ? "row" : "column"}
            spacing="1.5rem"
            alignItems="center"
            sx={{
                position: "relative",
                py: "1rem",
                px: "1rem",
                width: orientation === "horizontal" ? "unset" : "31rem",
                cursor: onClick ? "pointer" : "unset",
                ":hover": { backgroundColor: onClick ? "#FFFFFF15" : "unset" },
            }}
            onClick={onClick}
        >
            <Box
                component="video"
                sx={{
                    height: orientation === "horizontal" ? "7rem" : "28rem",
                    width: orientation === "horizontal" ? "7rem" : "100%",
                    overflow: "hidden",
                    objectFit: "contain",
                    objectPosition: "center",
                    borderRadius: 1,
                    border: "#FFFFFF18 2px solid",
                    boxShadow: "inset 0 0 12px 6px #00000040",
                    background: `radial-gradient(#FFFFFF20 10px, #00000080)`,
                }}
                loop
                muted
                autoPlay
                poster={`${assetToSell.imageUrl}`}
            >
                {playVideo && <source src={assetToSell.videoUrl} type="video/mp4" />}
            </Box>

            <Stack spacing=".3rem">
                {rarityDeets && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: rarityDeets.color,
                            fontFamily: fonts.nostromoBlack,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: orientation === "horizontal" ? 1 : 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {rarityDeets.label}
                    </Typography>
                )}
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: orientation === "horizontal" ? 1 : 2,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {assetToSell.label}
                </Typography>
                <Typography
                    sx={{
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: orientation === "horizontal" ? 1 : 2,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {assetToSell.description}
                </Typography>
            </Stack>
        </Stack>
    )
}
