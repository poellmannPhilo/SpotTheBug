import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";
import { slide as Menu } from "react-burger-menu";
import UserAvatar from "./UserAvatar";
//import styles  from "../../styles/modules/Menu.module.css";

interface SidebarProps {}

interface SignUpButtonProps {
  onClick: () => void;
}

interface LogoutButtonProps {
  onClick: () => void;
}

const styles = {
  bmBurgerButton: {
    position: "relative",
    width: "36px",
    height: "30px",
  },
  bmBurgerBars: {
    background: "grey",
    height: "4px",
    margin: "1px",
  },
  bmBurgerBarsHover: {
    background: "#a90000",
  },
  bmCrossButton: {
    display: "none",
  },
  bmCross: {
    background: "#bdc3c7",
  },
  bmMenuWrap: {
    position: "fixed",
    width: "10em",
    height: "20%",
    marginTop: "1em",
  },
  bmMenu: {
    background: "#ededed",
    border: "1px solid black",
    textAlign: "right",
    borderRadius: "1em",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    color: "#b8b7ad",
    padding: "0.8em",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  bmItem: {
    display: "inline-block",
  },
  bmOverlay: {
    width: "100%",
    display: "none",
  },
};

export function SignInButton({ onClick }: SignUpButtonProps) {
  return <button onClick={onClick}>Sign In</button>;
}

export function LogoutButton({ onClick }: LogoutButtonProps) {
  return <button onClick={onClick}>Log out</button>;
}

export default function Sidebar({ ...props }: SidebarProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    // Pass on our props
    <Menu {...props} styles={styles} right>
      {session && <LogoutButton onClick={() => signOut()} />}
      {!session && <SignInButton onClick={() => signIn("google")} />}
    </Menu>
  );
}
