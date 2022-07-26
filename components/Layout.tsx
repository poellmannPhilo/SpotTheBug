import TopMenu from "./Menu/TopMenu";

interface TopMenuProps {
  children: JSX.Element;
}
export default function Layout({ children }: TopMenuProps) {
  return (
    <>
      <main>
        <TopMenu></TopMenu>
        {children}
      </main>
    </>
  );
}
