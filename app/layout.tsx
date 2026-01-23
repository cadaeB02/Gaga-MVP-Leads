'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Footer from '@/components/Footer';
import "./globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    useEffect(() => {
        // Set up auth state listener for persistence
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
        });

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen">
                <main className="flex-grow">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
