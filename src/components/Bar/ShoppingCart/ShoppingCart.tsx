import { Stack, Box, IconButton, Badge } from "@mui/material"
import { SvgShop } from "../../../assets"
import { useFiat } from "../../../containers/fiat"

export const ShoppingCart = () => {
    const { itemsCount } = useFiat()

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    mx: "1.2rem",
                    height: "100%",
                }}
            >
                <Box>
                    <Badge
                        badgeContent={itemsCount}
                        color="error"
                        sx={{
                            "& .MuiBadge-badge": {
                                top: 10,
                                right: 6,
                                height: 14,
                                minWidth: 14,
                                fontSize: "1.5rem",
                                fontWeight: "fontWeightBold",
                            },
                        }}
                    >
                        <IconButton>
                            {/* TODO: Get shopping cart item later. */}
                            <SvgShop size="2.2rem" />
                        </IconButton>
                    </Badge>
                </Box>
            </Stack>
        </>
    )
}
