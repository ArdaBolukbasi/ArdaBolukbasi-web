export interface Certificate {
    id: string;
    title: string;
    title_tr?: string;
    issuer: string;
    issuer_tr?: string;
    date: string;
    date_tr?: string;
    image: string;
    credentialUrl?: string;
    order?: number;
}

import certificatesData from "@/data/certificates.json";

export const initialCertificates: Certificate[] = certificatesData as Certificate[];
