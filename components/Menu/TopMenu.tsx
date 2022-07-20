import Sidebar from "./sidebar";
import styles from "../../styles/modules/Menu.module.css";
import UserAvatar from "./UserAvatar";

export default function TopMenu() {
  return (
    <div className={styles.container}>
      <UserAvatar></UserAvatar>
      <Sidebar></Sidebar>
    </div>
  );
}
