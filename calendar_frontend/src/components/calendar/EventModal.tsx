import { component$, useContext, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { EventsCtx } from "~/store/events";
import { toDateInputValue } from "~/lib/date-utils";

// PUBLIC_INTERFACE
export const EventModal = component$(() => {
  /**
   * Event modal for create/edit/delete with focus trap and keyboard ESC to close.
   */
  const ctx = useContext(EventsCtx);
  const open = ctx.state.modalOpen;
  const formRef = useSignal<HTMLFormElement>();
  const firstInputRef = useSignal<HTMLInputElement>();
  const dialogRef = useSignal<HTMLDivElement>();

  const isEdit = !!ctx.state.editing;
  const editing = ctx.state.editing;

  const date = isEdit ? editing!.date : ctx.state.selectedDate ?? toDateInputValue(new Date());
  const title = isEdit ? editing!.title : "";
  const start = isEdit ? editing!.start : "09:00";
  const end = isEdit ? editing!.end : "10:00";
  const description = isEdit ? editing!.description ?? "" : "";
  const color = isEdit ? editing!.color ?? "blue" : "blue";

  useVisibleTask$(({ cleanup }) => {
    const onKey = (e: KeyboardEvent) => {
      if (!dialogRef.value) return;
      if (e.key === "Escape") {
        const ev = new CustomEvent("modal-escape", { bubbles: true });
        dialogRef.value?.dispatchEvent(ev);
      }
    };
    window.addEventListener("keydown", onKey);
    cleanup(() => window.removeEventListener("keydown", onKey));
  });

  useVisibleTask$(() => {
    if (open && firstInputRef.value) {
      firstInputRef.value.focus();
    }
  });

  if (!open) return null as unknown as JSX.Element;

  return (
    <div
      class="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      onClick$={$((e, current) => {
        if (e.target === current) ctx.modalClose$();
      })}
    >
      <div
        class="modal"
        ref={dialogRef}
        onModal-escape$={$(() => {
          ctx.modalClose$();
        })}
      >
        <div class="modal-header">
          <div id="event-modal-title" style={{ fontWeight: 700 }}>
            {isEdit ? "Edit Event" : "Add Event"}
          </div>
          <button class="btn btn-ghost" onClick$={$(() => ctx.modalClose$())} aria-label="Close modal">
            ✕
          </button>
        </div>
        <form
          ref={formRef}
          class="modal-body"
          preventdefault:submit
          onSubmit$={$((_, el) => {
            const fd = new FormData(el as HTMLFormElement);
            const payload = {
              title: String(fd.get("title") || "").trim(),
              date: String(fd.get("date")),
              start: String(fd.get("start")),
              end: String(fd.get("end")),
              description: String(fd.get("description") || ""),
              color: String(fd.get("color") || "blue") as any,
            };
            if (!payload.title) return;
            if (isEdit && editing) {
              ctx.eventUpdate$({ id: editing.id, ...payload });
              ctx.modalClose$();
            } else {
              ctx.eventAdd$(payload);
              ctx.modalClose$();
            }
          })}
        >
          <div class="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label for="title" style={{ display: "block", fontSize: "12px", color: "var(--ocean-muted)", marginBottom: "6px" }}>
                Title
              </label>
              <input id="title" name="title" class="input" defaultValue={title} ref={firstInputRef} placeholder="Event title" required />
            </div>
            <div>
              <label for="date" style={{ display: "block", fontSize: "12px", color: "var(--ocean-muted)", marginBottom: "6px" }}>
                Date
              </label>
              <input id="date" name="date" type="date" class="input" defaultValue={date} required />
            </div>
            <div>
              <label for="start" style={{ display: "block", fontSize: "12px", color: "var(--ocean-muted)", marginBottom: "6px" }}>
                Start time
              </label>
              <input id="start" name="start" type="time" class="input" defaultValue={start} required />
            </div>
            <div>
              <label for="end" style={{ display: "block", fontSize: "12px", color: "var(--ocean-muted)", marginBottom: "6px" }}>
                End time
              </label>
              <input id="end" name="end" type="time" class="input" defaultValue={end} required />
            </div>
            <div>
              <label for="color" style={{ display: "block", fontSize: "12px", color: "var(--ocean-muted)", marginBottom: "6px" }}>
                Tag
              </label>
              <select id="color" name="color" class="select" defaultValue={color}>
                <option value="blue">Blue</option>
                <option value="amber">Amber</option>
                <option value="red">Red</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label for="description" style={{ display: "block", fontSize: "12px", color: "var(--ocean-muted)", marginBottom: "6px" }}>
                Description
              </label>
              <textarea id="description" name="description" class="textarea" rows={4} defaultValue={description} placeholder="Details" />
            </div>
          </div>
        </form>
        <div class="modal-footer">
          {isEdit && editing && (
            <button
              class="btn"
              style={{ borderColor: "var(--ocean-error)", color: "var(--ocean-error)" }}
              onClick$={$(() => {
                ctx.eventDeleteById$(editing.id);
                ctx.modalClose$();
              })}
            >
              Delete
            </button>
          )}
          <button class="btn" onClick$={$(() => ctx.modalClose$())}>
            Cancel
          </button>
          <button class="btn btn-primary" onClick$={$(() => formRef.value?.requestSubmit())}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
});
