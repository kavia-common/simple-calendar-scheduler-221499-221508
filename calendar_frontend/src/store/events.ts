import { $, createContextId, useContextProvider, useStore } from "@builder.io/qwik";

export type EventColor = "blue" | "amber" | "red";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // yyyy-mm-dd
  start: string; // HH:MM
  end: string; // HH:MM
  description?: string;
  color?: EventColor;
}

export interface CalendarState {
  view: "month" | "week" | "day";
  cursor: string; // yyyy-mm-dd of current context date
  events: CalendarEvent[];
  selectedDate?: string;
  modalOpen: boolean;
  editing?: CalendarEvent | null;
}

export const EventsCtx = createContextId<{
  state: CalendarState;
  // Primitive-only mutators
  viewSet$: (v: CalendarState["view"]) => void;
  cursorSet$: (date: string) => void;
  modalOpenNewForDate$: (date: string) => void;
  modalOpenEditForId$: (id: string) => void;
  modalClose$: () => void;
  eventAdd$: (ev: Omit<CalendarEvent, "id">) => void;
  eventUpdate$: (ev: CalendarEvent) => void;
  eventDeleteById$: (id: string) => void;
}>("events.ctx");

// PUBLIC_INTERFACE
export function useEventsProvider() {
  /**
   * Provides a reactive store for calendar events and UI state.
   * In-memory events; API hooks are placeholders using VITE_API_BASE.
   */
  const initialDate = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const today = `${initialDate.getFullYear()}-${pad(initialDate.getMonth() + 1)}-${pad(initialDate.getDate())}`;

  const state = useStore<CalendarState>({
    view: "month",
    cursor: today,
    events: [
      {
        id: "e1",
        title: "Design sync",
        date: today,
        start: "09:00",
        end: "10:00",
        description: "Discuss UI polish",
        color: "blue",
      },
      {
        id: "e2",
        title: "Client call",
        date: today,
        start: "13:00",
        end: "13:45",
        description: "Review milestones",
        color: "amber",
      },
    ],
    selectedDate: today,
    modalOpen: false,
    editing: null,
  });

  const API_BASE = import.meta.env.VITE_API_BASE as string | undefined;

  // Placeholder API calls wrapped in $ but not exposed
  const persistCreate$ = $(async () => {
    if (!API_BASE) return;
  });
  const persistUpdate$ = $(async () => {
    if (!API_BASE) return;
  });
  const persistDelete$ = $(async () => {
    if (!API_BASE) return;
  });

  // Exposed mutators (no function values passed around)
  const viewSet$ = $((v: CalendarState["view"]) => {
    state.view = v;
  });
  const cursorSet$ = $((date: string) => {
    state.cursor = date;
  });

  const eventAdd$ = $((ev: Omit<CalendarEvent, "id">) => {
    const id =
      typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function"
        ? (crypto as any).randomUUID()
        : `${Date.now()}`;
    state.events = [...state.events, { id, ...ev }];
    persistCreate$();
  });

  const eventUpdate$ = $((ev: CalendarEvent) => {
    state.events = state.events.map((e) => (e.id === ev.id ? ev : e));
    persistUpdate$();
  });

  const eventDeleteById$ = $((id: string) => {
    state.events = state.events.filter((e) => e.id !== id);
    persistDelete$();
  });

  const modalOpenNewForDate$ = $((date: string) => {
    state.selectedDate = date;
    state.editing = null;
    state.modalOpen = true;
  });
  const modalOpenEditForId$ = $((id: string) => {
    const found = state.events.find((e) => e.id === id) || null;
    state.selectedDate = found?.date ?? state.cursor;
    state.editing = found;
    state.modalOpen = true;
  });
  const modalClose$ = $(() => {
    state.modalOpen = false;
    state.editing = null;
  });

  useContextProvider(EventsCtx, {
    state,
    viewSet$,
    cursorSet$,
    modalOpenNewForDate$,
    modalOpenEditForId$,
    modalClose$,
    eventAdd$,
    eventUpdate$,
    eventDeleteById$,
  });

  return { state };
}
