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
                <h2 className="text-2xl font-bold text-white">Registered Contractors</h2>
                <div className="text-sm text-gray-400">
                    {dummyContractors.length} contractor{dummyContractors.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Mobile: Card View */}
            <div className="block md:hidden space-y-4">
                {dummyContractors.map((contractor) => (
                    <div
                        key={contractor.id}
                        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                    >
                        <h3 className="text-lg font-bold text-white mb-4">{contractor.business_name}</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-400">License</p>
                                <p className="text-white font-semibold">{contractor.license_number}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Trade Type</p>
                                <p className="text-white font-semibold">{contractor.trade_type}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Phone</p>
                                <a href={`tel:${contractor.phone}`} className="text-orange-400 font-semibold hover:text-orange-300">
                                    {contractor.phone}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: Table View */}
            <div className="hidden md:block bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Business Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                License #
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Trade Type
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Phone
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {dummyContractors.map((contractor) => (
                            <tr key={contractor.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-white font-semibold">
                                    {contractor.business_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                    {contractor.license_number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                    {contractor.trade_type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a href={`tel:${contractor.phone}`} className="text-orange-400 hover:text-orange-300 font-semibold">
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
