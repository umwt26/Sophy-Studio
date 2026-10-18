import type { SongData } from "../types";
import { CalendarIcon, ClockIcon, UserIcon } from "./icons";

interface SongDetailsProps {
  song: SongData;
}

export function SongDetails({ song }: SongDetailsProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-[var(--color-app-border)] p-6 sm:flex-row">
      <img
        src={song.coverUrl}
        alt={`${song.title} cover art`}
        className="h-40 w-40 shrink-0 self-center rounded-md border border-[var(--color-app-border)] object-cover sm:self-start"
      />

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-bold text-[var(--color-text-primary)]">{song.title}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
            <UserIcon className="h-4 w-4 shrink-0" />
            {song.artist}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4" />
            {song.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4" />
            {song.createdAt}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {song.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
