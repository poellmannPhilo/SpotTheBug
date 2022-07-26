import Sidebar from "./sidebar";
import styles from "../../styles/modules/Menu.module.css";
import UserAvatar from "./UserAvatar";
import { useRouter } from "next/router";
import { IoMdArrowBack } from "react-icons/io";

export default function TopMenu() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      {router.asPath != "/" ? (
        <IoMdArrowBack
          className={styles.icon}
          onClick={() => router.back()}
        ></IoMdArrowBack>
      ) : (
        <div></div>
      )}
      <div className={styles.topNavigationRight}>
        <UserAvatar></UserAvatar>
        <Sidebar></Sidebar>
      </div>
    </div>
  );
}
