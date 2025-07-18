// Yeh layout sirf dashboard pages ke liye hai.
export default function DashboardLayout({ children }) {
  return (
    <section className="bg-gray-100 min-h-screen w-full">
      {children}
    </section>
  );
}
