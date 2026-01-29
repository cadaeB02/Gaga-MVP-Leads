import { CSLB_LICENSES } from '@/constants/licenses';

/**
 * Checks if a contractor with a given license is eligible for a specific trade type.
 * 
 * @param contractorLicense The license type of the contractor (e.g., 'C-10 (Electrical)')
 * @param requiredTradeType The trade type required for the lead (e.g., 'C-10 (Electrical)')
 * @returns boolean
 */
export function isEligible(contractorLicense: string, requiredTradeType: string): boolean {
    if (!contractorLicense || !requiredTradeType) return false;
    
    // Exact match is always eligible
    if (contractorLicense === requiredTradeType) return true;
    
    // Extract codes for more flexible matching
    const contractorCode = contractorLicense.split(' ')[0];
    const requiredCode = requiredTradeType.split(' ')[0];

    // General Building (B) is eligible for most things if it's a "standard" lead,
    // but in CA, B-licensed contractors can do electrical/plumbing ONLY if it's 
    // part of a project involving two or more unrelated trades.
    // For this platform, we'll allow B for all Standard leads for wider reach,
    // or keep it strict. Let's start strict but allow B for general remodel/addition labels.
    
    if (contractorCode === 'Class' && contractorLicense.includes('(B)')) {
        // Class B can see General Building leads
        if (requiredCode === 'Class' && requiredTradeType.includes('(B)')) return true;
        // B-2 can see
        if (requiredCode === 'B-2') return true;
    }

    if (contractorCode === 'B-2' && requiredCode === 'B-2') return true;

    return contractorCode === requiredCode;
}

/**
 * Gets the display label for a license class.
 */
export function getLicenseLabel(licenseClass: string): string {
    const found = Object.values(LICENSE_CONFIG).find(c => c.class === licenseClass || c.tradeType === licenseClass);
    return found ? found.label : licenseClass;
}
