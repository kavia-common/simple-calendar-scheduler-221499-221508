import { component$ } from "@builder.io/qwik";
import { useEventsProvider } from "~/store/events";
import { CalendarHeader } from "./CalendarHeader";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { EventModal } from "./EventModal";

// PUBLIC_INTERFACE
export const CalendarPage = component$(() => {
  /**
   * Renders the full calendar page with header, current view, and modals.
   */
  const { state } = useEventsProvider();

  return (
    <div class="container">
      <div class="card" style={{ padding: "16px" }}>
        <CalendarHeader />
        {state.view === "month" && <MonthView />}
        {state.view === "week" && <WeekView />}
        {state.view === "day" && <DayView />}
      </div>
      <EventModal />
    </div>
  );
});
