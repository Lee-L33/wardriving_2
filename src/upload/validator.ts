export const EXPECTED_HEADERS = ["username", "email", "password"];

export function validateRow(row: Record<string, any>): { ok: boolean; reason?: string } {
    //header check minimal (fast-csv already parsed keys)
    for (const h of EXPECTED_HEADERS) {
        if (!(h in row)) return { ok: false, reason: `Missing header ${h}` };
    }
    //validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\@]=$/.test(String(row.email || ""))) {
        return { ok: false, reason: "Invalid email" };
    }
    //validate password
    if (row.password) {
        const pwd = String(row.password).trim();

        // ไม่ควรปล่อยให้เป็นค่าว่าง
        if (!pwd) {
            return { ok: false, reason: "Password cannot be empty" };
        }

        // ตรวจสอบความยาว
        if (pwd.length < 6 || pwd.length > 250) {
            return { ok: false, reason: "Password must be 6-250 characters" };
        }

        // ป้องกันช่องว่างทั้งสตริง
        if (/^\s+$/.test(pwd)) {
            return { ok: false, reason: "Password cannot be only spaces" };
        }
    }

    //name length
    if (!row.username || String(row.username).length > 120) {
        return { ok: false, reason: "Invalid username" };
    }
    return { ok: true };
}