import { createFileRoute } from "@tanstack/react-router";
import { LoamGame } from "@/components/loam-game";

export const Route = createFileRoute("/")({
  component: LoamGame,
});
