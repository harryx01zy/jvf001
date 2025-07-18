// src/components/dashboard/FinancialTimeline.js
"use client";

// Yeh component payment aur material history, dono ko timeline format mein dikhayega.
export default function FinancialTimeline({
  history,
  title,
  type = "payment",
}) {
  // Config object waisa hi rahega.
  const config = {
    payment: {
      icon: (
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375m18 0h-4.5M3.75 18h14.25a1.125 1.125 0 001.125-1.125V6.375a1.125 1.125 0 00-1.125-1.125H3.75A1.125 1.125 0 002.625 6.375v10.5A1.125 1.125 0 003.75 18z"
          />
        </svg>
      ),
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
      amountColor: "text-green-600",
    },
    material: {
      icon: (
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      ),
      iconBg: "bg-orange-100",
      iconColor: "text-orange-700",
      amountColor: "text-orange-600",
    },
  };
  const currentConfig = config[type];

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="p-4 text-gray-500">No records found.</p>
      </div>
    );
  }

  const groupedByDate = history.reduce((acc, entry) => {
    const entryDate = (entry.date || entry.purchase_date).split("T")[0];
    (acc[entryDate] = acc[entryDate] || []).unshift(entry);
    return acc;
  }, {});
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 sm:p-6 border-b">
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <div className="max-h-[24rem] overflow-y-auto p-4 sm:p-6">
        {/* === YAHAN SE CHANGES HAIN === */}
        <ul className="relative border-l border-gray-200 pl-2">
          {Object.keys(groupedByDate).map((date) => (
            <li key={date} className="mb-8 ml-6">
              {/* Icon ka size ab 6x6 (24px) hai, bilkul attendance jaisa */}
              <span
                className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ${currentConfig.iconBg} ${currentConfig.iconColor}`}
              >
                {currentConfig.icon}
              </span>
              {/* Date ka font size ab 'text-base' hai */}
              <h4 className="text-base font-semibold text-gray-900">
                {new Date(date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h4>
              <div className="mt-2 space-y-4">
                {groupedByDate[date].map((entry) => (
                  <div
                    key={entry.id}
                    className="pb-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex justify-between items-start text-sm mb-1">
                      <p className="font-medium text-gray-800">
                        {type === "payment"
                          ? entry.labors?.full_name
                          : entry.item_name}
                      </p>
                      <p
                        className={`font-bold text-base text-right ${currentConfig.amountColor}`}
                      >
                        ₹{Number(entry.amount).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* === YAHI HAI NAYA BADLAAV === */}
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        Mode:{" "}
                        <span className="font-semibold">
                          {entry.payment_mode || "N/A"}
                        </span>
                      </span>
                      <span>
                        Paid by: {entry.profiles?.full_name || "Admin"}
                      </span>
                    </div>

                    {/* Remarks sirf tabhi dikhenge jab woh maujood hon */}
                    {entry.remarks && (
                      <div className="mt-2 text-xs italic bg-yellow-50 text-yellow-800 p-2 rounded-md">
                        "{entry.remarks}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
