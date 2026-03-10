import "./globals.css";

export const metadata = {
    title: "Honors & Minors Portal",
    description: "Official portal for Honors and Minors registration",
    icons: {
        icon: "/logo.jpeg",
        shortcut: "/logo.jpeg",
        apple: "/logo.jpeg",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
            </head>
            <body>{children}</body>
        </html>
    );
}