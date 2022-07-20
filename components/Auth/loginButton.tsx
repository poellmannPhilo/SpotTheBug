import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  console.log(process.env.GOOGLE_CLIENT_ID);

  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </>
  );
}
