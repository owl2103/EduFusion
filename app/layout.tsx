import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EduFusion - Admin Portal",
  description: "Quality Education Admin Dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <Script
          id="disable-v0-devtools"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  // Block v0 devtools injection
                  const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                      mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                          const el = node;
                          // Check if className is a string before calling includes
                          const className = typeof el.className === 'string' ? el.className : (el.className?.baseVal || '');
                          if ((el.id && typeof el.id === 'string' && el.id.includes('v0')) || 
                              (className && typeof className === 'string' && className.includes('v0'))) {
                            el.remove();
                          }
                        }
                      });
                    });
                  });
                  observer.observe(document.body, { childList: true, subtree: true });
                  
                  // Prevent v0 devtools from attaching
                  Object.defineProperty(window, '__v0_devtools', {
                    value: undefined,
                    writable: false,
                    configurable: false
                  });
                }
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  )
}
