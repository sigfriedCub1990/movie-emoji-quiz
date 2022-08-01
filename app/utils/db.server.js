import { getAuth } from "@clerk/remix/ssr.server";
import faunadb from "faunadb";

/*
 * Return a FaunaDB client in order to query the DB
 *
 * @param {Request} req - Current request
 *
 * @return {Promise<Client>} FaunaDB client
 */
export const getClient = async (req) => {
  // If request is authenticated retrieve userId and getToken function
  const { userId, getToken } = await getAuth(req);

  // If userId is not present then the request is NOT authenticated
  if (!userId) return null;

  // Extract secret from a template named "fauna" in Clerk
  const secret = await getToken({ template: "fauna" });

  // Finally return the client
  return new faunadb.Client({ secret });
};

export const q = faunadb.query;
