import { SignIn } from "@clerk/remix";
import Header from "../components/header";
import styles from "~/styles/index.css";

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function Index() {
  return (
    <div>
      <Header />
      <main>
        <div className="content">
          <SignIn />
        </div>
      </main>
    </div>
  );
}
