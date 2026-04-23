import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Employee Hire Manager",
  description: "Internal employee management system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-blue-700">HireManager</h1>
          <nav className="flex gap-4 text-sm">
            <a href="/" className="hover:text-blue-600">Dashboard</a>
            <a href="/employees" className="hover:text-blue-600">Employees</a>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
