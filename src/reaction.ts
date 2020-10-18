import { ReactionAddedEvent } from "./types/reaction-added";

export const get = (event: ReactionAddedEvent): string | null => {
  console.log({ event });
  return event.reaction;
};
