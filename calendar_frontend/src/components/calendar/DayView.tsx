import { component$, useContext, $ } from "@builder.io/qwik";
import { EventsCtx } from "~/store/events";
import { fromDateInputValue, timeToMinutes } from "~/lib/date-utils";

// PUBLIC_INTERFACE
export const DayView = component$(() => {
  const ctx = useContext(EventsCtx);
  const selected = fromDateInputValue(ctx.state.cursor);
  const dayStr = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, "0")}-${String(
    selected.getDate(),
  ).padStart(2, "0")}`;
  const events = ctx.state.events.filter((e) => e.date === dayStr);
  const hours = Array.from({ length: 24 }).map((_, i) => `${String(i).padStart(2, "0")}:00`);

  return (
    <div class="timeline">
      <div class="hours">
        {hours.map((h) => (
          <div key={h} class="h">
            {h}
          </div>
        ))}
      </div>
      <div class="slots" onDblClick$={$(() => ctx.modalOpenNewForDate$(dayStr))}>
        {hours.map((h, i) => (
          <div key={h} class="row" style={{ gridRowStart: i + 1 }} />
        ))}
        {events.map((ev) => {
          const start = timeToMinutes(ev.start);
          const end = timeToMinutes(ev.end);
          const height = Math.max(28, ((end - start) / 60) * 60); // 60px per hour
          return (
            <button
              key={ev.id}
              class="event-block"
              style={{ top: `${(start / 60) * 60}px`, height: `${height}px` }}
              onClick$={$(() => ctx.modalOpenEditForId$(ev.id))}
              aria-label={`${ev.title} ${ev.start}-${ev.end}`}
            >
              <div style={{ fontWeight: 700, marginBottom: "4px" }}>{ev.title}</div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>
                {ev.start} – {ev.end}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});
