// src/app/dashboard/admin/labors/[laborId]/page.js

import { getLaborProfileDataAction } from "@/app/dashboard/admin/actions";
import LaborProfileClientPage from "@/components/dashboard/LaborProfileClientPage";
import { redirect } from 'next/navigation';
import Link from 'next/link';

// Yeh ek Server Component hai jo data fetch karega
export default async function LaborProfilePage({ params }) {
    const { laborId } = await params;

    // Yahaan hum check karenge ki URL se laborId mila ya nahi
    if (!laborId) {
        // Agar ID nahi hai, to error ke saath wapas bhej denge
        return redirect('/dashboard/admin/labors?error=invalid_id');
    }

    const result = await getLaborProfileDataAction(laborId);

    // Agar action se koi error aata hai
    if (result.error) {
        return (
            <div className="p-8 text-center">
                <p className="font-bold text-red-600">Error: {result.error}</p>
                <Link href="/dashboard/admin/labors" className="text-blue-600 hover:underline mt-4 inline-block">
                    &larr; Go back to Manage Labors
                </Link>
            </div>
        );
    }
    
    // Agar data nahi milta
    if (!result.data || !result.data.labor) {
        return (
             <div className="p-8 text-center">
                <p className="text-gray-600">Could not find data for this labor.</p>
                <Link href="/dashboard/admin/labors" className="text-blue-600 hover:underline mt-4 inline-block">
                    &larr; Go back to Manage Labors
                </Link>
            </div>
        );
    }

    // Sab kuch theek hai to data ko Client Component mein pass kar denge
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <LaborProfileClientPage initialProfileData={result.data} />
        </div>
    );
}