import { useMemo } from "react"
import { timeSinceInWords } from "../../../../helpers"
import { General } from "./General"

export const Timeframe = ({ isGridView, endAt, soldAt }: { isGridView?: boolean; endAt: Date; soldAt?: Date }) => {
    const timeLeft = useMemo(() => timeSinceInWords(new Date(), endAt), [endAt])

    return <General isGridView={isGridView} title={soldAt ? "DATE SOLD" : "TIME LEFT"} text={soldAt ? soldAt.toUTCString() : timeLeft} />
}
