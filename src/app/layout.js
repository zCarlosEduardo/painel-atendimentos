import "./globals.css"

export const metadata = {
  title: "Painel de Atendimentos",
  description: "Painel interno de atendimentos",
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className="min-h-screen bg-black text-white"
        style={{
          // backgroundImage: "url('https://wallpapers-clan.com/wp-content/uploads/2024/12/wazowski-windows-desktop-wallpaper-4k-preview.jpg')",
          backgroundImage: "url('https://wallpaper.forfun.com/fetch/5b/5b31561588fece9b8c355be3fb6f4020.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {children}
      </body>
    </html>
  )
}