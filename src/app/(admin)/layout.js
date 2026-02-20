export default function AdminLayout({ children }) {
  return (
    <>
      <div>
        <main className="w-full h-full">{children}</main>
      </div>
    </>
  );
}