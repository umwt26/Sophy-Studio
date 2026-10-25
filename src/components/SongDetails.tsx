import type { SongData } from "../types";
import { CalendarIcon, ClockIcon, UserIcon } from "./icons";

interface SongDetailsProps {
  song: SongData;
}

export function SongDetails({ song }: SongDetailsProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-[var(--color-app-border)] p-6 sm:flex-row items-center sm:items-start">
      <img
        src={song.coverUrl}
        alt={`${song.title} cover`}
        className="h-36 w-36 shrink-0 rounded-lg border border-[var(--color-app-border)] object-cover shadow-sm"
      />

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 text-center sm:text-left">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-[var(--color-text-primary)]">
            {song.title}
          </h2>
          <p className="mt-1 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <UserIcon className="h-3.5 w-3.5 shrink-0" />
            <span>{song.artist}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1.5 font-mono">
            <ClockIcon className="h-3.5 w-3.5" />
            {song.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5" />
            {song.createdAt}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
          {song.genres.map((genre) => (
            <span key={genre} className="chip text-[0.6875rem]">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
