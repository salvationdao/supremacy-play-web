import * as prismic from "@prismicio/client"
import { PRISMIC_ACCESS_TOKEN } from "../constants"

export const prismicRepoName = "supremacy-news"
const endpoint = prismic.getRepositoryEndpoint(prismicRepoName)

export const prismicClient = prismic.createClient(endpoint, {
    accessToken: PRISMIC_ACCESS_TOKEN,
})
