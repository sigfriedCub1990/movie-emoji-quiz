import { useRef, useEffect } from "react";
import {
  useLoaderData,
  useActionData,
  useTransition,
  Form,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { getClient, q } from "~/utils/db.server";

import styles from "~/styles/challenge.css";

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader = async ({ params, request }) => {
  const { id } = params;
  const client = await getClient(request);

  if (isNaN(id)) {
    throw new Response("Challenge not found", {
      status: 404,
    });
  }

  const challenge = await client.query(q.Call("getChallengeById", id));

  if (!challenge) {
    throw new Response("Challenge not found", {
      status: 404,
    });
  }

  return json(challenge);
};

export const action = async ({ params, request }) => {
  const { id } = params;
  const form = await request.formData();
  const guess = form.get("guess");
  const client = await getClient(request);
  const challenge = await client.query(q.Call("getChallengeById", id));

  const isCorrect = guess.toLowerCase() === challenge.title.toLowerCase();

  return json({
    guessed: isCorrect ? "correct" : "incorrect",
    message: isCorrect ? "Correct! ✅" : "Incorrect! ❌",
    answer: challenge.title,
  });
};

export default function Challenge() {
  const formRef = useRef();
  const transition = useTransition();
  const { emoji } = useLoaderData();
  const data = useActionData();

  useEffect(() => {
    if (transition.type === "normalLoad") {
      formRef.current && formRef.current.reset();
    }
  }, [transition]);

  return (
    <div>
      <span className="emoji">{emoji}</span>
      <Form method="post" autoComplete="off" ref={formRef}>
        <label htmlFor="guess">What movie is this?</label>
        <input
          id="guess"
          type="text"
          name="guess"
          placeholder="Enter movie title..."
          required
        />
        {data?.guessed ? (
          <p className={`message message--${data.guessed}`}>{data.message}</p>
        ) : null}
        <button className="submit-btn">Submit guess</button>
        {data?.guessed === "incorrect" ? (
          <div className="reveal">
            <button className="reveal-btn" type="button">
              Reveal answer
            </button>
            <span className="reveal-text">{data?.answer}</span>
          </div>
        ) : null}
      </Form>
    </div>
  );
}
