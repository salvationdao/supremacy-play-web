import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer"
import { FiatOrder } from "../../types/fiat"

const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "#E4E4E4",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
})

interface Props {
    order: FiatOrder
}

export const PDFInvoice = ({ order }: Props) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
                <Text>Section #2</Text>
            </View>
        </Page>
    </Document>
)
