export interface LicenseOption {
    code: string;
    name: string;
    label: string;
}

export const CSLB_LICENSES: LicenseOption[] = [
    { code: 'Class A', name: 'General Engineering', label: 'Class A (General Engineering)' },
    { code: 'Class B', name: 'General Building', label: 'Class B (General Building)' },
    { code: 'B-2', name: 'Residential Remodeling', label: 'B-2 (Residential Remodeling)' },
    { code: 'C-2', name: 'Insulation & Acoustical', label: 'C-2 (Insulation & Acoustical)' },
    { code: 'C-4', name: 'Boiler/Steam', label: 'C-4 (Boiler/Steam)' },
    { code: 'C-5', name: 'Framing', label: 'C-5 (Framing)' },
    { code: 'C-6', name: 'Cabinetry', label: 'C-6 (Cabinetry)' },
    { code: 'C-7', name: 'Low Voltage', label: 'C-7 (Low Voltage)' },
    { code: 'C-8', name: 'Concrete', label: 'C-8 (Concrete)' },
    { code: 'C-9', name: 'Drywall', label: 'C-9 (Drywall)' },
    { code: 'C-10', name: 'Electrical', label: 'C-10 (Electrical)' },
    { code: 'C-11', name: 'Elevator', label: 'C-11 (Elevator)' },
    { code: 'C-12', name: 'Earthwork', label: 'C-12 (Earthwork)' },
    { code: 'C-13', name: 'Fencing', label: 'C-13 (Fencing)' },
    { code: 'C-15', name: 'Flooring', label: 'C-15 (Flooring)' },
    { code: 'C-16', name: 'Fire Protection', label: 'C-16 (Fire Protection)' },
    { code: 'C-17', name: 'Glazing', label: 'C-17 (Glazing)' },
    { code: 'C-20', name: 'HVAC', label: 'C-20 (HVAC)' },
    { code: 'C-21', name: 'Demolition', label: 'C-21 (Demolition)' },
    { code: 'C-23', name: 'Ornamental Metal', label: 'C-23 (Ornamental Metal)' },
    { code: 'C-27', name: 'Landscaping', label: 'C-27 (Landscaping)' },
    { code: 'C-28', name: 'Security Equipment', label: 'C-28 (Security Equipment)' },
    { code: 'C-29', name: 'Masonry', label: 'C-29 (Masonry)' },
    { code: 'C-31', name: 'Traffic Control', label: 'C-31 (Traffic Control)' },
    { code: 'C-32', name: 'Parking/Highway', label: 'C-32 (Parking/Highway)' },
    { code: 'C-33', name: 'Painting', label: 'C-33 (Painting)' },
    { code: 'C-34', name: 'Pipeline', label: 'C-34 (Pipeline)' },
    { code: 'C-35', name: 'Plastering', label: 'C-35 (Plastering)' },
    { code: 'C-36', name: 'Plumbing', label: 'C-36 (Plumbing)' },
    { code: 'C-38', name: 'Refrigeration', label: 'C-38 (Refrigeration)' },
    { code: 'C-39', name: 'Roofing', label: 'C-39 (Roofing)' },
    { code: 'C-42', name: 'Sanitation', label: 'C-42 (Sanitation)' },
    { code: 'C-43', name: 'Sheet Metal', label: 'C-43 (Sheet Metal)' },
    { code: 'C-45', name: 'Sign', label: 'C-45 (Sign)' },
    { code: 'C-46', name: 'Solar', label: 'C-46 (Solar)' },
    { code: 'C-47', name: 'Manufactured Housing', label: 'C-47 (Manufactured Housing)' },
    { code: 'C-50', name: 'Reinforcing Steel', label: 'C-50 (Reinforcing Steel)' },
    { code: 'C-51', name: 'Structural Steel', label: 'C-51 (Structural Steel)' },
    { code: 'C-53', name: 'Swimming Pool', label: 'C-53 (Swimming Pool)' },
    { code: 'C-54', name: 'Tile', label: 'C-54 (Tile)' },
    { code: 'C-55', name: 'Water Conditioning', label: 'C-55 (Water Conditioning)' },
    { code: 'C-57', name: 'Well Drilling', label: 'C-57 (Well Drilling)' },
    { code: 'C-60', name: 'Welding', label: 'C-60 (Welding)' },
    { code: 'C-61', name: 'Limited Specialty', name_alt: 'Limited Specialty', label: 'C-61 (Limited Specialty)' }
].map(opt => ({
    ...opt,
    searchString: `${opt.code} ${opt.name}`.toLowerCase()
}));
