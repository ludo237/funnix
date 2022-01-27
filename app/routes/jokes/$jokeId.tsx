import { ActionFunction, LoaderFunction, MetaFunction, redirect, useCatch, useLoaderData, useParams } from "remix";
import { db } from "~/libs/db.server";
import { getUserId, requireUserId } from "~/libs/session.server";
import { JokeDisplay } from "~/components/joke";
import { JokeLoaderData } from "~/types";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });

  if (!joke) {
    throw new Response("What a joke! Not found.", {
      status: 404,
    });
  }
  const data: JokeLoaderData = {
    joke,
    isOwner: userId === joke.jokesterId,
  };

  return data;
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  if (formData.get("_method") === "delete") {
    const userId = await requireUserId(request);
    const joke = await db.joke.findUnique({
      where: {
        id: params.jokeId,
      },
    });
    if (!joke) {
      throw new Response("This joke does not exist", { status: 404 });
    }
    if (joke.jokesterId !== userId) {
      throw new Response("Pssh, nice try. That's not your joke", { status: 401 });
    }

    await db.joke.delete({ where: { id: params.jokeId } });
    return redirect("/jokes");
  }
};

export function ErrorBoundary () {
  const { jokeId } = useParams();
  return (
    <div className="error-container">
      {`There was an error loading joke by the id ${jokeId}. Sorry.`}
    </div>
  );
}

export function CatchBoundary () {
  const caught = useCatch();
  const params = useParams();
  switch (caught.status) {
    case 404: {
      return (
        <div className="error-container">
          Huh? What the heck is {params.jokeId}?
        </div>
      );
    }
    case 401: {
      return (
        <div className="error-container">
          Sorry, but {params.jokeId} is not your joke.
        </div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

export const meta: MetaFunction = ({ data }) => {
  return {
    title: data.joke.name,
    description: data.joke.content,
  };
};

export default function Joke () {
  const data = useLoaderData<JokeLoaderData>();

  return (
    <JokeDisplay joke={data.joke} isOwner={data.isOwner} />
  );
}
