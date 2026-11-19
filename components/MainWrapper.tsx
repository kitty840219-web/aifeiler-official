export default function MainWrapper({ children }: { children: React.ReactNode }) {
  return <main className="site-content flex-1 bg-night-dark pb-20">{children}</main>;
}
