import "./globals.css"

export const metadata = {
  title: "Painel de Atendimentos",
  description: "Painel interno de atendimentos",
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}