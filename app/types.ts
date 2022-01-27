import { Joke, User } from "@prisma/client";

export type LoginForm = {
  username: string;
  password: string;
};

export type JokeLoaderData = {
  joke: Joke,
  isOwner: boolean
};

export type JokesLoaderData = {
  user: User | null;
  jokeListItems: Array<{ id: string; name: string }>;
};

export type FormDataAction = {
  formError?: string;
  fieldErrors?: {}
  fields?: {}
};
