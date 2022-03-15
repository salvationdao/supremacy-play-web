import { Typography } from "@mui/material"
import { getMutiplierDeets } from "../../helpers"
import { MultiplierGuide } from "../../types"

const MultiplierGuideComponent = ({ multiplierType, description, title }: MultiplierGuide) => {
    return (
        <>
            <br />
            <Typography
                variant="h5"
                sx={{
                    display: "flex",
                    gap: ".5em",
                    alignItems: "center",
                    "& img": { width: "1.5rem", height: "1.5rem" },
                }}
            >
                <img src={getMutiplierDeets(multiplierType).image} alt={multiplierType} /> {title}:
            </Typography>
            <Typography sx={{ ml: "2.5rem" }}>{description}</Typography>
        </>
    )
}

export default MultiplierGuideComponent
