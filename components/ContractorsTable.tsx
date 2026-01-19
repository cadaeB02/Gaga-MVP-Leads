interface ContractorsTableProps {
    contractors?: Array<{
        id: number;
        business_name: string;
        license_number: string;
        trade_type: string;
        phone: string;
    }>;
}

export default function ContractorsTable({ contractors }: ContractorsTableProps) {
    // Dummy data for now
    const dummyContractors = contractors || [
        {
            id: 1,
            business_name: "Bay Area Electric Co.",
            license_number: "C-10 #987654",
            trade_type: "Electrical (C-10)",
            phone: "(415) 555-0123"
        },
        {
            id: 2,
            business_name: "Golden Gate Plumbing",
            license_number: "C-36 #876543",
            trade_type: "Plumbing (C-36)",
            phone: "(415) 555-0456"
        },
        {
            id: 3,
            business_name: "SF Roofing Pros",
            license_number: "C-39 #765432",
            trade_type: "Roofing (C-39)",
            phone: "(415) 555-0789"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Registered Contractors</h2>
                <div className="text-sm text-gray-600">
                    {dummyContractors.length} contractor{dummyContractors.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Mobile: Card View */}
            <div className="block md:hidden space-y-4">
                {dummyContractors.map((contractor) => (
                    <div
                        key={contractor.id}
                        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{contractor.business_name}</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500">License</p>
                                <p className="text-gray-900 font-semibold">{contractor.license_number}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Trade Type</p>
                                <p className="text-gray-900 font-semibold">{contractor.trade_type}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <a href={`tel:${contractor.phone}`} className="text-cyan-600 font-semibold hover:text-cyan-700">
                                    {contractor.phone}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: Table View */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Business Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                License #
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Trade Type
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Phone
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {dummyContractors.map((contractor) => (
                            <tr key={contractor.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-semibold">
                                    {contractor.business_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                    {contractor.license_number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                    {contractor.trade_type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a href={`tel:${contractor.phone}`} className="text-cyan-600 hover:text-cyan-700 font-semibold">
                                        {contractor.phone}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
