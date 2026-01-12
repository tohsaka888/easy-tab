import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoteIcon } from "@/components/icons";
      <CardHeader className="border-b border-[color:var(--card-border)] px-4 pt-4 pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-[color:var(--card-ink)]">
              className="rounded-lg border border-[color:var(--card-border)] bg-[color:var(--overlay-soft)] px-3 py-2 text-[color:var(--card-ink)] shadow-[0_12px_30px_rgba(0,0,0,0.2)]"
  "Refine grid snapping logic",
  "Prepare demo tiles",
  "Email design tokens to team",
];

export function NotesModule(_: ModuleRenderProps) {
  return (
    <Card className="h-full">
      <CardHeader className="px-4 pt-4">
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-[color:var(--ink-2)]">
            <NoteIcon className="h-4 w-4" />
          </span>
          Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2">
        <ul className="space-y-2 text-sm">
          {notes.map((note) => (
            <li
              key={note}
              className="rounded-lg border border-black/5 bg-white/70 px-3 py-2 text-[color:var(--ink-1)]"
            >
              {note}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
