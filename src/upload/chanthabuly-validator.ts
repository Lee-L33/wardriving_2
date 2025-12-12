export const CHANTHABULY_REQUIRED_HEADERS = [
    "SSID",
    "BSSID",
    "latitude",
    "longitude"
];

export function validateChanthabuly(row: Record<string, any>): { ok: boolean; reason?: string } {
    // Check for required headers
    for (const h of CHANTHABULY_REQUIRED_HEADERS) {
        if (!(h in row)) {
            return { ok: false, reason: `Missing required column: ${h}` };
        }
    }

    // Validate BSSID format (MAC address: XX:XX:XX:XX:XX:XX)
    const bssidPattern = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    const bssid = String(row.BSSID || "").trim();
    if (!bssid || !bssidPattern.test(bssid)) {
        return { ok: false, reason: "Invalid BSSID format (expected XX:XX:XX:XX:XX:XX)" };
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

    // Skip records with 0.0, 0.0 coordinates (invalid GPS)
    if (lat === 0.0 && lon === 0.0) {
        return { ok: false, reason: "Invalid GPS coordinates (0.0, 0.0)" };
    }

    // Validate signal strength if present
    if (row.signal) {
        const signal = Number(row.signal);
        if (!isNaN(signal) && isFinite(signal)) {
            if (signal > 0 || signal < -120) {
                return { ok: false, reason: "Signal strength must be between -120 and 0 dBm" };
            }
        }
    }

    return { ok: true };
}
