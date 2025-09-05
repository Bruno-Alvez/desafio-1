import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Hypesoft Dashboard",
  description: "Product Management System for Hypesoft Technical Challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex",
          inter.variable
        )}
      >
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-4 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-purple-600 p-2 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-cube"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" x2="12" y1="22.08" y2="12"></line>
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">Hypesoft Dashboard</span>
          </div>

          {/* BEGIN NAV REPLACEMENT */}
          <nav className="flex-grow">
            <ul className="space-y-1">
              <li>
                <Link href="/home" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/products" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" x2="12" y1="22.08" y2="12"></line>
                  </svg>
                  Gestão de Produtos
                </Link>
              </li>
              <li>
                <Link href="/categories" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M9 5H2v7l6.29-6.29A2 2 0 0 1 9 5Z"></path>
                    <path d="M6 9.01V9"></path>
                    <path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"></path>
                  </svg>
                  Sistema de Categorias
                </Link>
              </li>
            </ul>
          </nav>
          {/* END NAV REPLACEMENT */}

          {/* Footer placeholder */}
          <div className="mt-auto p-4" />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-gray-50">
          {/* Header */}
          <header className="w-full bg-white border-b p-4 flex items-center justify-between shadow-sm">
            <h1 className="text-lg font-semibold text-gray-800">Hypesoft Dashboard</h1>
            <div />
          </header>

                    {/* Page Content */}
          <div className="p-6 flex-1 overflow-y-auto">
                    <AuthProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthProvider>
          </div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
