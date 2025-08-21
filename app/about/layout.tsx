export const metadata = {
  title: 'About Us',
  description: 'Learn how to use the codegen tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div>
        {children}
      </div>
  )
}
