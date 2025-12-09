import { component$, $, useContext } from "@builder.io/qwik";
import { EventsCtx } from "~/store/events";
import { fromDateInputValue, formatDayTitle, formatMonthTitle, formatWeekTitle } from "~/lib/date-utils";

// PUBLIC_INTERFACE
export const CalendarHeader = component$(() => {
  const ctx = useContext(EventsCtx);

  const renderTitle = () => {
    const d = fromDateInputValue(ctx.state.cursor);
    if (ctx.state.view === "month") return formatMonthTitle(d);
    if (ctx.state.view === "week") return formatWeekTitle(d);
    return formatDayTitle(d);
  };

  return (
    <div class="calendar-header">
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          class="btn"
          aria-label="Previous"
          onClick$={$(() => {
            const current = fromDateInputValue(ctx.state.cursor);
            if (ctx.state.view === "month") current.setMonth(current.getMonth() - 1);
            else if (ctx.state.view === "week") current.setDate(current.getDate() - 7);
            else current.setDate(current.getDate() - 1);
            const next = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(
              current.getDate(),
            ).padStart(2, "0")}`;
            ctx.cursorSet$(next);
          })}
        >
          ‹
        </button>
        <button
          class="btn"
          onClick$={$(() => {
            const d = new Date();
            const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(
              2,
              "0",
            )}`;
            ctx.cursorSet$(next);
          })}
        >
          Today
        </button>
        <button
          class="btn"
          aria-label="Next"
          onClick$={$(() => {
            const current = fromDateInputValue(ctx.state.cursor);
            if (ctx.state.view === "month") current.setMonth(current.getMonth() + 1);
            else if (ctx.state.view === "week") current.setDate(current.getDate() + 7);
            else current.setDate(current.getDate() + 1);
            const next = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(
              current.getDate(),
            ).padStart(2, "0")}`;
            ctx.cursorSet$(next);
          })}
        >
          ›
        </button>
      </div>
      <div class="calendar-title" aria-live="polite">
        {renderTitle()}
      </div>
      <div class="calendar-view-switcher" role="tablist" aria-label="Change view">
        <button role="tab" aria-pressed={ctx.state.view === "month"} onClick$={$(() => ctx.viewSet$("month"))}>
          Month
        </button>
        <button role="tab" aria-pressed={ctx.state.view === "week"} onClick$={$(() => ctx.viewSet$("week"))}>
          Week
        </button>
        <button role="tab" aria-pressed={ctx.state.view === "day"} onClick$={$(() => ctx.viewSet$("day"))}>
          Day
        </button>
      </div>
    </div>
  );
});
