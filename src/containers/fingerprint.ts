import { GetResult } from "@fingerprintjs/fingerprintjs"
import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"

export interface Fingerprint {
    visitor_id: string
    os_cpu?: string
    platform?: string
    timezone?: string
    confidence: number
    user_agent: string
}

export const FingerprintContainer = createContainer(() => {
    const [detailedFingerprint, setDetailedFingerprint] = useState<GetResult>()
    const [fingerprint, setFingerprint] = useState<Fingerprint>()

    useEffect(() => {
        const fpPromise = import("@fingerprintjs/fingerprintjs").then((FingerprintJS) => FingerprintJS.load())

        fpPromise
            .then((fp) => {
                return fp.get()
            })
            .then(async (result) => {
                setDetailedFingerprint(result)
                setFingerprint({
                    visitor_id: result.visitorId,
                    os_cpu: result.components.osCpu.value,
                    platform: result.components.platform.value,
                    timezone: result.components.timezone.value,
                    confidence: result.confidence.score,
                    user_agent: navigator.userAgent,
                })
            })
    }, [])

    return {
        fingerprint,
        detailedFingerprint,
    }
})

export const FingerprintProvider = FingerprintContainer.Provider
export const useFingerprint = FingerprintContainer.useContainer
