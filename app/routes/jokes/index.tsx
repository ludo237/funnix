import { LoaderFunction, useCatch, useLoaderData } from "remix";
import { db } from "~/libs/db.server";
import { JokeLoaderData } from "~/types";
import { getUserId } from "~/libs/session.server";
import { JokeDisplay } from "~/components/joke";

export const loader: LoaderFunction = async ({ request }) => {
  const count = await db.joke.count();
  const userId = await getUserId(request);
  if (count === 0) {
    throw new Response("No jokes", { status: 404 });
  }

  const randomRowNumber = Math.floor(Math.random() * count);
  const [joke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });

  const data: JokeLoaderData = {
    joke,
    isOwner: userId === joke.jokesterId,
  };

  return data;
};

export function ErrorBoundary () {
  return (
    <div className="error-container">
      I did a whoopsies.
    </div>
  );
}

export function CatchBoundary () {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        No jokes to display.
      </div>
    );
  }

  throw new Error(
    `Unexpected caught response with status: ${caught.status}`,
  );
}

export default function Jokes () {
  const data = useLoaderData<JokeLoaderData>();

  return (
    <JokeDisplay joke={data.joke} isOwner={data.isOwner} />
  );
}
