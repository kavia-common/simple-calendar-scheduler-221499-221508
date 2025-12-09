import { component$, useContext, $ } from "@builder.io/qwik";
import { EventsCtx } from "~/store/events";
import { monthGrid, sameDay, fromDateInputValue, toDateInputValue } from "~/lib/date-utils";

// PUBLIC_INTERFACE
export const MonthView = component$(() => {
  const ctx = useContext(EventsCtx);
  const cursorDate = fromDateInputValue(ctx.state.cursor);
  const days = monthGrid(cursorDate);
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div>
      <div class="month-grid">
        {weekdays.map((w) => (
          <div class="weekday" key={`w-${w}`}>
            {w}
          </div>
        ))}
        {days.map((d, i) => {
          const isToday = sameDay(d, new Date());
          const inMonth = d.getMonth() === cursorDate.getMonth();
          const dateStr = toDateInputValue(d);
          const dayEvents = ctx.state.events.filter((e) => e.date === dateStr);
          return (
            <div
              key={`c-${i}`}
              class="cell"
              aria-label={`Day ${d.getDate()}`}
              style={{ opacity: inMonth ? "1" : "0.6" }}
              onDblClick$={$(() => ctx.modalOpenNewForDate$(dateStr))}
            >
              <div class={["date-label", isToday ? "today" : ""].join(" ")}>{d.getDate()}</div>
              {dayEvents.slice(0, 3).map((ev) => (
                <button
                  key={ev.id}
                  class="event-chip"
                  data-color={ev.color ?? "blue"}
                  onClick$={$(() => ctx.modalOpenEditForId$(ev.id))}
                  aria-label={`${ev.title} at ${ev.start}`}
                >
                  <span style={{ fontWeight: 600 }}>{ev.start}</span> {ev.title}
                </button>
              ))}
              {dayEvents.length > 3 && (
                <div class="badge" style={{ marginTop: "6px" }}>
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
        <button class="btn-primary btn" onClick$={$(() => ctx.modalOpenNewForDate$(ctx.state.cursor))} aria-haspopup="dialog">
          + Add Event
        </button>
      </div>
    </div>
  );
});
