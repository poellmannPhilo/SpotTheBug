import { useSession } from "next-auth/react";
import style from "../../styles/modules/Menu.module.css";

export default function UserAvatar() {
  const { data: session } = useSession();
  const userName = session?.user?.name;

  if (userName) {
    return (
      <div className={style.userAvatarContainer}>
        <div>{userName[0]}</div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
