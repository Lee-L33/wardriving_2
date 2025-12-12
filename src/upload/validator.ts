export const EXPECTED_HEADERS = [
    "district_id",
    "user_id",
    "ssid",
    "bssid",
    "manufacturer",
    "signal_strength",
    "authentication",
    "encryption",
    "radio_type",
    "channel",
    "latitude",
    "longitude",
    "scan_timestamp",
    "network_identifier",
    "frequency"
];

export function validateRow(row: Record<string, any>): { ok: boolean; reason?: string } {
    // Header check minimal (fast-csv already parsed keys)
    for (const h of EXPECTED_HEADERS) {
        if (!(h in row)) return { ok: false, reason: `Missing header ${h}` };
    }

    // Validate numeric fields
    const numericFields = ["district_id", "user_id", "signal_strength", "channel", "frequency"];
    for (const field of numericFields) {
        const val = Number(row[field]);
        if (isNaN(val) || !isFinite(val)) {
            return { ok: false, reason: `Invalid ${field}: must be a number` };
        }
    }

    // Validate latitude (-90 to 90)
    const lat = Number(row.latitude);
    if (isNaN(lat) || !isFinite(lat) || lat < -90 || lat > 90) {
        return { ok: false, reason: "Invalid latitude: must be between -90 and 90" };
    }

    // Validate longitude (-180 to 180)
    const lon = Number(row.longitude);
    if (isNaN(lon) || !isFinite(lon) || lon < -180 || lon > 180) {
        return { ok: false, reason: "Invalid longitude: must be between -180 and 180" };
    }

    // Validate required string fields
    const stringFields = ["ssid", "bssid", "manufacturer", "authentication", "encryption", "radio_type", "network_identifier"];
    for (const field of stringFields) {
        if (!row[field] || String(row[field]).trim().length === 0) {
            return { ok: false, reason: `${field} cannot be empty` };
        }
    }

    // Validate BSSID format (MAC address: XX:XX:XX:XX:XX:XX)
    const bssidPattern = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (!bssidPattern.test(String(row.bssid))) {
        return { ok: false, reason: "Invalid BSSID format (expected XX:XX:XX:XX:XX:XX)" };
    }

    // Validate scan_timestamp (should be a valid date)
    const timestamp = new Date(row.scan_timestamp);
    if (isNaN(timestamp.getTime())) {
        return { ok: false, reason: "Invalid scan_timestamp: must be a valid date" };
    }

    return { ok: true };
}