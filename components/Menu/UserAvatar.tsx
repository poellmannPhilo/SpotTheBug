import { useSession } from "next-auth/react";
import style from "../../styles/modules/Menu.module.css";
import classNames from "classnames";
import Link from "next/link";

export default function UserAvatar() {
  const { data: session } = useSession();
  const userName = session?.user?.name;

  if (userName) {
    return (
      <Link href="/profile">
        <div
          className={classNames(style.userAvatarContainer, {
            large: true,
          })}
        >
          <div className={style.userAvatarText}>{userName[0]}</div>
        </div>
      </Link>
    );
  } else {
    return <div></div>;
  }
}
