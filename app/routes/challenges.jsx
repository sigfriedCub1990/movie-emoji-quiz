import { Outlet, useLoaderData } from "@remix-run/react";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import styles from "~/styles/index.css";

import { getClient, q } from "../utils/db.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const client = await getClient(request);

  if (!client) return null;

  const { data } = await client.query(q.Call("getChallenges"));

  return json(data);
};

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function Challenges() {
  const data = useLoaderData();

  return (
    <div>
      <Header />
      <main>
        <Sidebar data={data} />
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
