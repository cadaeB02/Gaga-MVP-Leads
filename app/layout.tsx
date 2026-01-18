import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "The Digital Mechanic - I catch lost customers",
    description: "Find a local pro in seconds",
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

