import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "GagaLeads - Find Local Contractors",
    description: "Connect with licensed contractors in your area",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
