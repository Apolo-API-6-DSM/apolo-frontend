// app/(admin)/chamados/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Apolo - Chamados",
};

export default function ChamadosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}