import "./globals.css"

export const metadata = {
  title: "Painel de Atendimentos",
  description: "Painel interno de atendimentos",
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className="min-h-screen bg-black text-white"
        style={{
          backgroundImage: "url('https://wallpapers-clan.com/wp-content/uploads/2024/12/wazowski-windows-desktop-wallpaper-4k-preview.jpg')",
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