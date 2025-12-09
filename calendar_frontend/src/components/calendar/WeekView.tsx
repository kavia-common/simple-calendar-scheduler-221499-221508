import { component$, useContext, $ } from "@builder.io/qwik";
import { EventsCtx } from "~/store/events";
import { addDays, fromDateInputValue, startOfWeek, timeToMinutes, toDateInputValue } from "~/lib/date-utils";

// PUBLIC_INTERFACE
export const WeekView = component$(() => {
  const ctx = useContext(EventsCtx);
  const base = startOfWeek(fromDateInputValue(ctx.state.cursor));
  const days = Array.from({ length: 7 }).map((_, i) => addDays(base, i));
  const hours = Array.from({ length: 24 }).map((_, i) => `${String(i).padStart(2, "0")}:00`);

  const allWeekEvents = ctx.state.events.filter((e) => days.some((d) => toDateInputValue(d) === e.date));

  return (
    <div class="timeline">
      <div class="hours">
        {hours.map((h) => (
          <div key={h} class="h">
            {h}
          </div>
        ))}
      </div>
      <div class="slots">
        {hours.map((h, i) => (
          <div key={h} class="row" style={{ gridRowStart: i + 1 }} />
        ))}
        {allWeekEvents.map((ev) => {
          const end = timeToMinutes(ev.end);
          const start = timeToMinutes(ev.start);
          const height = Math.max(28, ((end - start) / 60) * 60); // 60px per hour
          const dayIdx = days.findIndex((d) => toDateInputValue(d) === ev.date);
          const leftOffset = dayIdx * (100 / 7);
          const width = 100 / 7;

          return (
            <button
              key={ev.id}
              class="event-block"
              style={{
                top: `${(start / 60) * 60}px`,
                height: `${height}px`,
                left: `calc(${leftOffset}% + 0px)`,
                width: `calc(${width}% - 16px)`,
              }}
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
