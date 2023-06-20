export interface QrCode {
    id: number;
    order_item_id: number;
    qr_code: string;
    qr_code_decoded: string;
    qr_code_scan: null | string;
    created_at: string;
}