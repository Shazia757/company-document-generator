import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
} from "@react-pdf/renderer";

import { DocumentTemplate } from "@/types/document";
import { company } from "@/lib/company";

type DocumentPDFProps = {
    template?: DocumentTemplate;
    formData: Record<string, string>;
};

const styles = StyleSheet.create({
    page: {
        paddingTop: 50,
        paddingBottom: 60,
        paddingHorizontal: 60,
        fontFamily: "Helvetica",
        fontSize: 10,
        color: "#222222",
        lineHeight: 1.5,
    },

    header: {
        marginBottom: 25,
        paddingBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: company.primaryColor,
    },

    logoContainer: {
        width: 130,
    },

    logo: {
        width: 120,
        height: 60,
        objectFit: "contain",
    },

  content: {
    marginTop: 36,
    fontSize: 11,
    lineHeight: 1.8,
},

    paragraph: {
        marginBottom: 18,
        lineHeight: 1.8,
        fontSize: 11,
    },

    bold: {
        fontWeight: "bold",
    },

    signature: {
        marginTop: 80,
    },

    signatureName: {
        fontSize: 10,
        fontWeight: "bold",
    },

    signatureCompany: {
        marginTop: 3,
        fontSize: 9,
        color: "#666666",
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },

    infoLabel: {
        fontWeight: "bold",
    },

    invoiceHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 35,
    },

    billTo: {
        width: "50%",
    },

    invoiceInfo: {
        width: "40%",
        alignItems: "flex-end",
    },

    smallLabel: {
        fontSize: 8,
        fontWeight: "bold",
        color: "#888888",
        textTransform: "uppercase",
        marginBottom: 5,
    },

    customerName: {
        fontWeight: "bold",
        marginBottom: 4,
    },

    customerAddress: {
        fontSize: 9,
        color: "#555555",
    },

    table: {
        width: "100%",
        marginTop: 15,
    },

    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#CCCCCC",
        paddingBottom: 7,
        marginBottom: 2,
    },

    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
        paddingVertical: 7,
    },

    descriptionColumn: {
        flex: 1,
    },

    quantityColumn: {
        width: 45,
        textAlign: "center",
    },

    rateColumn: {
        width: 65,
        textAlign: "right",
    },

    amountColumn: {
        width: 70,
        textAlign: "right",
    },

    tableHeaderText: {
        fontSize: 8,
        fontWeight: "bold",
        color: "#555555",
    },

    totals: {
        width: 180,
        marginLeft: "auto",
        marginTop: 20,
    },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
    },

    grandTotal: {
        borderTopWidth: 1,
        borderTopColor: "#AAAAAA",
        marginTop: 5,
        paddingTop: 7,
        fontWeight: "bold",
        fontSize: 11,
    },

    sectionTitle: {
        fontSize: 9,
        fontWeight: "bold",
        marginBottom: 6,
    },

    secondaryText: {
        fontSize: 9,
        color: "#555555",
    },

    companyName: {
        fontSize: 14,
        fontWeight: "bold",
    },

    companyAddress: {
        marginTop: 4,
        fontSize: 8,
        color: "#666666",
        textAlign: "right",
    },

    companyContact: {
        marginTop: 2,
        fontSize: 8,
        color: "#666666",
        textAlign: "right",
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
    },

    companyInfo: {
        flex: 1,
        alignItems: "flex-end",
        marginLeft: 20,
    },

    documentTitle: {
        marginTop: 18,
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 1,
        textAlign: "center",
    },
});

function formatDate(value?: string) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function getSignatoryName(value?: string) {
    const signatories: Record<string, string> = {
        "managing-director": "Managing Director",
        "hr-manager": "HR Manager",
    };

    return value
        ? signatories[value] || value
        : "Authorized Signatory";
}

function DocumentMeta({
    template,
    formData,
}: {
    template: DocumentTemplate;
    formData: Record<string, string>;
}) {
    let date = "";

    if (
        template.id === "experience-certificate" ||
        template.id === "internship-certificate"
    ) {
        date = formData.certificateDate || "";
    } else if (template.id === "invoice") {
        return null;
    } else {
        date = formData.date || "";
    }

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 28,
                marginBottom: 10,
            }}
        >
            <View>
                {date && (
                    <Text>
                        Date: {formatDate(date)}
                    </Text>
                )}
            </View>

            {formData.referenceNumber && (
                <Text>
                    Ref: {formData.referenceNumber}
                </Text>
            )}
        </View>
    );
}

function parseInvoiceItems(value?: string) {
    if (!value) {
        return [];
    }

    try {
        const items = JSON.parse(value);

        if (Array.isArray(items)) {
            return items;
        }
    } catch {
        return [];
    }

    return [];
}

function Signature({
    signatory,
}: {
    signatory?: string;
}) {
    return (
        <View style={styles.signature}>
            <View
                style={{
                    width: 140,
                    height: 35,
                    borderBottomWidth: 1,
                    borderBottomColor: "#999999",
                    marginBottom: 12,
                }}
            />

            <Text style={styles.signatureName}>
                {getSignatoryName(signatory)}
            </Text>

            <Text style={styles.signatureCompany}>
                Authorized Signatory
            </Text>

            <Text
                style={[
                    styles.signatureCompany,
                    { marginTop: 8 },
                ]}
            >
                {company.name}
            </Text>
        </View>
    );
}

function ExperienceCertificate({
    formData,
}: {
    formData: Record<string, string>;
}) {
    return (
        <>
            <Text style={styles.paragraph}>
                This is to certify that{" "}
                <Text style={styles.bold}>
                    {formData.employeeName}
                </Text>
                , working as{" "}
                <Text style={styles.bold}>
                    {formData.designation}
                </Text>{" "}
                in the{" "}
                <Text style={styles.bold}>
                    {formData.department}
                </Text>{" "}
                department, was employed with our organization.
            </Text>

            <Text style={styles.paragraph}>
                The employee joined the organization on{" "}
                <Text style={styles.bold}>
                    {formatDate(formData.joiningDate)}
                </Text>{" "}
                and worked with us until{" "}
                <Text style={styles.bold}>
                    {formatDate(formData.lastWorkingDate)}
                </Text>
                .
            </Text>


        </>
    );
}

function InternshipCertificate({
    formData,
}: {
    formData: Record<string, string>;
}) {
    return (
        <>
            <Text style={styles.paragraph}>
                This is to certify that{" "}
                <Text style={styles.bold}>
                    {formData.internName}
                </Text>{" "}
                successfully completed an internship as{" "}
                <Text style={styles.bold}>
                    {formData.internshipRole}
                </Text>{" "}
                in the{" "}
                <Text style={styles.bold}>
                    {formData.department}
                </Text>{" "}
                department.
            </Text>

            <Text style={styles.paragraph}>
                The internship period was from{" "}
                <Text style={styles.bold}>
                    {formatDate(formData.startDate)}
                </Text>{" "}
                to{" "}
                <Text style={styles.bold}>
                    {formatDate(formData.endDate)}
                </Text>
                .
            </Text>

            {formData.institution && (
                <Text style={styles.paragraph}>
                    Institution:{" "}
                    <Text style={styles.bold}>
                        {formData.institution}
                    </Text>
                </Text>
            )}

        </>
    );
}

function NOC({
    formData,
}: {
    formData: Record<string, string>;
}) {
    return (
        <>
            <Text style={styles.paragraph}>
                This is to certify that{" "}
                <Text style={styles.bold}>
                    {formData.employeeName}
                </Text>
                , working as{" "}
                <Text style={styles.bold}>
                    {formData.designation}
                </Text>
                , has no objection from the organization regarding
                the following purpose:
            </Text>

            <Text style={styles.paragraph}>
                <Text style={styles.bold}>
                    {formData.purpose}
                </Text>
            </Text>

            {formData.body && (
                <Text style={styles.paragraph}>
                    {formData.body}
                </Text>
            )}


        </>
    );
}

function FormalLetter({
    formData,
}: {
    formData: Record<string, string>;
}) {
    return (
        <>


            {formData.recipientName && (
                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.bold}>
                        {formData.recipientName}
                    </Text>

                    {formData.recipientTitle && (
                        <Text>{formData.recipientTitle}</Text>
                    )}

                    {formData.recipientOrganization && (
                        <Text>
                            {formData.recipientOrganization}
                        </Text>
                    )}
                </View>
            )}

            <Text style={styles.paragraph}>
                {formData.salutation || "Dear Sir/Madam"},
            </Text>

            {formData.subject && (
                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>
                        Subject: {formData.subject}
                    </Text>
                </Text>
            )}

            <Text style={styles.paragraph}>
                {formData.body}
            </Text>

            <Text style={{ marginTop: 20 }}>
                Yours faithfully,
            </Text>
        </>
    );
}

function OfferLetter({
    formData,
}: {
    formData: Record<string, string>;
}) {
    return (
        <>

            <Text style={styles.paragraph}>
                Dear{" "}
                <Text style={styles.bold}>
                    {formData.candidateName}
                </Text>
                ,
            </Text>

            <Text style={styles.paragraph}>
                We are pleased to offer you the position of{" "}
                <Text style={styles.bold}>
                    {formData.designation}
                </Text>
                {formData.department
                    ? ` in the ${formData.department} department`
                    : ""}
                .
            </Text>

            {formData.joiningDate && (
                <Text style={styles.paragraph}>
                    Your proposed joining date is{" "}
                    <Text style={styles.bold}>
                        {formatDate(formData.joiningDate)}
                    </Text>
                    .
                </Text>
            )}

            {formData.salary && (
                <Text style={styles.paragraph}>
                    Compensation:{" "}
                    <Text style={styles.bold}>
                        {formData.salary}
                    </Text>
                </Text>
            )}

            {formData.employmentType && (
                <Text style={styles.paragraph}>
                    Employment Type:{" "}
                    <Text style={styles.bold}>
                        {formData.employmentType}
                    </Text>
                </Text>
            )}

            {formData.body && (
                <Text style={styles.paragraph}>
                    {formData.body}
                </Text>
            )}
        </>
    );
}

function Invoice({
    formData,
}: {
    formData: Record<string, string>;
}) {
    const items = parseInvoiceItems(formData.items);

    const subtotal = items.reduce(
        (total: number, item: any) => {
            const quantity = Number(item.quantity) || 0;
            const rate = Number(item.rate) || 0;

            return total + quantity * rate;
        },
        0
    );

    const taxRate = Number(formData.tax) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    return (
        <>
            <View style={styles.invoiceHeader}>
                <View style={styles.billTo}>
                    <Text style={styles.smallLabel}>
                        Bill To
                    </Text>

                    <Text style={styles.customerName}>
                        {formData.customerName}
                    </Text>

                    {formData.customerAddress && (
                        <Text style={styles.customerAddress}>
                            {formData.customerAddress}
                        </Text>
                    )}
                </View>

                <View style={styles.invoiceInfo}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Invoice No:
                        </Text>

                        <Text>
                            {formData.invoiceNumber}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                            Date:
                        </Text>

                        <Text>
                            {formatDate(formData.invoiceDate)}
                        </Text>
                    </View>

                    {formData.dueDate && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>
                                Due Date:
                            </Text>

                            <Text>
                                {formatDate(formData.dueDate)}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text
                        style={[
                            styles.descriptionColumn,
                            styles.tableHeaderText,
                        ]}
                    >
                        Description
                    </Text>

                    <Text
                        style={[
                            styles.quantityColumn,
                            styles.tableHeaderText,
                        ]}
                    >
                        Qty
                    </Text>

                    <Text
                        style={[
                            styles.rateColumn,
                            styles.tableHeaderText,
                        ]}
                    >
                        Rate
                    </Text>

                    <Text
                        style={[
                            styles.amountColumn,
                            styles.tableHeaderText,
                        ]}
                    >
                        Amount
                    </Text>
                </View>

                {items.map((item: any, index: number) => {
                    const quantity = Number(item.quantity) || 0;
                    const rate = Number(item.rate) || 0;
                    const amount = quantity * rate;

                    return (
                        <View
                            key={index}
                            style={styles.tableRow}
                        >
                            <Text style={styles.descriptionColumn}>
                                {item.description}
                            </Text>

                            <Text style={styles.quantityColumn}>
                                {quantity}
                            </Text>

                            <Text style={styles.rateColumn}>
                                {rate.toFixed(2)}
                            </Text>

                            <Text style={styles.amountColumn}>
                                {amount.toFixed(2)}
                            </Text>
                        </View>
                    );
                })}
            </View>

            <View style={styles.totals}>
                <View style={styles.totalRow}>
                    <Text>Subtotal</Text>
                    <Text>{subtotal.toFixed(2)}</Text>
                </View>

                <View style={styles.totalRow}>
                    <Text>
                        Tax ({taxRate}%)
                    </Text>

                    <Text>
                        {taxAmount.toFixed(2)}
                    </Text>
                </View>

                <View
                    style={[
                        styles.totalRow,
                        styles.grandTotal,
                    ]}
                >
                    <Text>Total</Text>
                    <Text>{total.toFixed(2)}</Text>
                </View>
            </View>

            {formData.paymentTerms && (
                <View style={{ marginTop: 30 }}>
                    <Text style={styles.sectionTitle}>
                        Payment Terms
                    </Text>

                    <Text style={styles.secondaryText}>
                        {formData.paymentTerms}
                    </Text>
                </View>
            )}

            {formData.notes && (
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.sectionTitle}>
                        Notes
                    </Text>

                    <Text style={styles.secondaryText}>
                        {formData.notes}
                    </Text>
                </View>
            )}
        </>
    );
}

export default function DocumentPDF({
    template,
    formData,
}: DocumentPDFProps) {
    if (!template) {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <Text>No document selected.</Text>
                </Page>
            </Document>
        );
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Company Header */}
                <View style={styles.header}>
                    <View style={styles.headerRow}>

                        {/* Logo */}
                        <View style={styles.logoContainer}>
                            <Image
                                src={company.logo}
                                style={styles.logo}
                            />
                        </View>

                        {/* Company Information */}
                        <View style={styles.companyInfo}>
                            <Text
                                style={[
                                    styles.companyName,
                                    {
                                        color: company.primaryColor,
                                    },
                                ]}
                            >
                                {company.name}
                            </Text>

                            <Text style={styles.companyAddress}>
                                {company.address}
                            </Text>

                            <Text style={styles.companyContact}>
                                {company.phone}
                            </Text>

                            <Text style={styles.companyContact}>
                                {company.email}
                            </Text>

                            <Text style={styles.companyContact}>
                                {company.website}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Date / Reference */}
                <DocumentMeta
                    template={template}
                    formData={formData}
                />

                {/* Document Title */}
                <Text
                    style={[
                        styles.documentTitle,
                        {
                            color: company.primaryColor,
                        },
                    ]}
                >
                    {template.name}
                </Text>

                {/* Small Title Divider */}
                <View
                    style={{
                        width: 48,
                        height: 1,
                        backgroundColor: company.primaryColor,
                        alignSelf: "center",
                        marginTop: 12,
                    }}
                />

                {/* Document Content */}
                <View style={styles.content}>

                    {template.id === "experience-certificate" && (
                        <ExperienceCertificate
                            formData={formData}
                        />
                    )}

                    {template.id === "internship-certificate" && (
                        <InternshipCertificate
                            formData={formData}
                        />
                    )}

                    {template.id === "noc" && (
                        <NOC
                            formData={formData}
                        />
                    )}

                    {template.id === "formal-letter" && (
                        <FormalLetter
                            formData={formData}
                        />
                    )}

                    {template.id === "offer-letter" && (
                        <OfferLetter
                            formData={formData}
                        />
                    )}

                    {template.id === "invoice" && (
                        <Invoice
                            formData={formData}
                        />
                    )}

                    {/* Signature */}
                    <Signature
                        signatory={formData.signatory}
                    />

                </View>
            </Page>
        </Document>
    );
}