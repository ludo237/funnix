import { Link, Form } from "remix";
import type { Joke } from "@prisma/client";

export type JokeProps = {
  joke: Pick<Joke, "content" | "name">;
  isOwner: boolean;
  canDelete?: boolean;
};

export function JokeDisplay ({ joke, isOwner, canDelete = true }: JokeProps) {
  return (
    <div>
      <p>Here your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to=".">{joke.name} Permalink</Link>
      {isOwner ? (
        <Form method="post">
          <input
            type="hidden"
            name="_method"
            value="delete"
          />
          <button
            type="submit"
            className="button"
            disabled={!canDelete}
          >
            Delete
          </button>
        </Form>
      ) : null}
    </div>
  );
}
