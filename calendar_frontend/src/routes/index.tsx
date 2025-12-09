import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { CalendarPage } from "~/components/calendar/CalendarPage";

// PUBLIC_INTERFACE
export default component$(() => {
  return <CalendarPage />;
});

export const head: DocumentHead = {
  title: "Calendar Scheduler",
  meta: [
    {
      name: "description",
      content: "Modern calendar scheduler with month/week/day views and event management.",
    },
  ],
};
