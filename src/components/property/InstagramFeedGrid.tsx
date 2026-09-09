"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { InstagramIcon } from "@/components/ui/icons";

/** One item of a carousel post. Instagram calls them children. */
export type InstagramFeedChild = {
  id: string;
  mediaType?: string | null;
  displayUrl?: string | null;
  mediaUrl?: string | null;
  thumbnailUrl?: string | null;
};

export type InstagramFeedPost = {
  id: string;
  /** "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" — `isVideo` mirrors it, but a feed
   * that sends only one of the two should still be read correctly. */
  mediaType?: string | null;
  permalink?: string | null;
  displayUrl?: string | null;
  mediaUrl?: string | null;
  thumbnailUrl?: string | null;
  altText?: string | null;
  caption?: string | null;
  isVideo?: boolean;
  isCarousel?: boolean;
  children?: InstagramFeedChild[] | null;
  timestamp?: string | null;
  likeCount?: number | null;
  commentsCount?: number | null;
};

/**
 * The feed app's own appearance block, sent alongside the posts.
 *
 * Every field here is the workspace's setting, not a choice of ours — the
 * client asked for the band to look like the app's preview, so the preview's
 * numbers are the source of truth and the props below are only the fallback
 * for a feed that sends no config.
 */
export type InstagramFeedConfig = {
  /** "grid" or "carousel" — Ubud's workspace is set to carousel. */
  layout?: string;
  columns?: number;
  columnsMd?: number;
  columnsSm?: number;
  /** How many posts a small screen shows. Not the same as `columnsSm`: the
   * workspace sets both, and 2 columns × a 6-post feed is three rows of
   * phone-width squares where it asks for one. */
  limitSm?: number;
  gap?: string;
  radius?: string;
  aspectRatio?: string;
  showCaption?: "hover" | "always" | "never" | string;
  showStats?: boolean;
};

type InstagramFeedGridProps = {
  endpoint: string;
  instagramHref: string;
  limit?: number;
  columns?: 3 | 4 | 6;
  fallback?: React.ReactNode;
};

const DEFAULT_CONFIG: Required<
  Pick<InstagramFeedConfig, "gap" | "radius" | "aspectRatio">
> = {
  gap: "12px",
  radius: "24px",
  aspectRatio: "1 / 1",
};

/** `Aug 25, 2026` — the format the app prints under an opened post. */
function formatFeedDate(timestamp: string | null | undefined): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * The still to show for an item.
 *
 * `displayUrl` first and `mediaUrl` last is not arbitrary: on a `VIDEO` item
 * `mediaUrl` is the MP4 itself, which an `<img>` renders as a broken tile.
 */
function stillOf(item: InstagramFeedPost | InstagramFeedChild): string | undefined {
  return item.displayUrl || item.thumbnailUrl || item.mediaUrl || undefined;
}

/** True for a reel, and for the video items inside a carousel. */
function isVideoItem(item: InstagramFeedPost | InstagramFeedChild): boolean {
  if ("isVideo" in item && item.isVideo) return true;
  return (item.mediaType ?? "").toUpperCase() === "VIDEO";
}

/** The MP4 behind a video item. Instagram puts it in `mediaUrl`; a post whose
 * `mediaUrl` is the still (an ordinary photo) has none. */
function videoOf(item: InstagramFeedPost | InstagramFeedChild): string | undefined {
  if (!isVideoItem(item)) return undefined;
  return item.mediaUrl || undefined;
}

export type InstagramFrame = {
  src: string;
  /** Set when this frame is a reel or a video slide — the viewer plays it. */
  video?: string;
};

/** Every frame an opened post can page through: a carousel's children, or the
 * single frame of a plain post or reel. */
function framesOf(post: InstagramFeedPost): InstagramFrame[] {
  const children = (post.children ?? [])
    .map((child) => {
      const src = stillOf(child);
      return src ? { src, video: videoOf(child) } : null;
    })
    .filter(Boolean) as InstagramFrame[];
  if (children.length) return children;
  const src = stillOf(post);
  return src ? [{ src, video: videoOf(post) }] : [];
}

/** The play triangle the app puts on a reel, and the stack it puts on a
 * carousel. Drawn inline for the same reason as everything in ui/icons.tsx —
 * no icon-library dependency. */
function MediaBadge({ post }: { post: InstagramFeedPost }) {
  if (post.isCarousel) {
    return (
      <span
        aria-hidden
        className="pointer-events-none absolute top-2.5 right-2.5 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="7.5" y="3.5" width="13" height="13" rx="2.5" />
          <path d="M16.5 20.5H6a2.5 2.5 0 0 1-2.5-2.5V7.5" />
        </svg>
      </span>
    );
  }
  if (post.isVideo) {
    return (
      <span
        aria-hidden
        className="pointer-events-none absolute top-2.5 right-2.5 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M8 5.5v13l11-6.5-11-6.5Z" />
        </svg>
      </span>
    );
  }
  return null;
}

/** One position in the viewer: a post, and which of its frames is showing. */
type ViewerStep = { post: number; frame: number };

/** Every frame of every post, in order — the sequence the arrows walk.
 *
 * The app's own viewer steps through *frames first*: from a reel it goes to a
 * carousel's first picture, then its second, then its third, then on to the
 * next post. Arrows that only moved between posts skipped the carousel
 * pictures the dots were advertising; arrows that only moved between frames
 * trapped the visitor inside one post. Flattening the feed is what makes one
 * pair of arrows do both, exactly as the app does. */
function stepsOf(posts: InstagramFeedPost[]): ViewerStep[] {
  return posts.flatMap((post, index) =>
    framesOf(post).map((_, frame) => ({ post: index, frame })),
  );
}

/** The caption, clamped to two lines behind a "Show more".
 *
 * Its own component so the expanded/collapsed state resets when the viewer
 * moves to another post — a `key` on the element, rather than a `setState`
 * inside an effect (`react-hooks/set-state-in-effect`, the trap documented for
 * `BookingSearchBar`).
 *
 * The toggle appears only when the text is genuinely cut off, measured once on
 * mount: `ReadMore` follows the same rule for the same reason, and the reason
 * it must be measured rather than guessed from a character count is that the
 * caption's own line breaks decide how many lines it takes.
 */
function Caption({ text }: { text: string }) {
  // Instagram captions separate their paragraphs with a *blank* line. Rendered
  // literally, that empty line eats one of the two the caption is clamped to,
  // so a two-line caption reads as clipped and gets a "Show more" the app
  // never shows. Collapsing the run is what puts the hashtags directly under
  // the sentence, exactly as the app prints them.
  const body = text.replace(/\n{2,}/g, "\n").trim();
  const [expanded, setExpanded] = useState(false);
  const [clipped, setClipped] = useState(false);
  const ref = useCallback((node: HTMLParagraphElement | null) => {
    if (node) setClipped(node.scrollHeight > node.clientHeight + 1);
  }, []);

  if (!body) return null;
  return (
    // 14px, not the site's 15px body size: the caption column is fixed and a
    // post's hashtag block runs ~100 characters, which at 15px wraps to a
    // third line and puts a "Show more" on captions the app shows whole.
    <div className="mt-4 text-[14px] leading-relaxed font-light text-white">
      <p
        ref={ref}
        className={expanded ? "whitespace-pre-line" : "line-clamp-2 whitespace-pre-line"}
      >
        {body}
      </p>
      {clipped ? (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="font-body mt-1 text-[14px] font-semibold text-white transition-opacity duration-300 hover:opacity-75"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
}

/**
 * The opened post, matching the app's own viewer.
 *
 * Everything here is that viewer's behaviour rather than a design of ours: the
 * media centred on a dimmed page with the close button set outside its top
 * corner, round arrows on either side, dots under a carousel, the caption
 * clamped behind "Show more", and the date and Instagram link on one closing
 * row.
 *
 * Three things it does that a plainer lightbox would not:
 *
 * - **The arrows walk frames, then posts** (see `stepsOf`).
 * - **A reel plays.** Instagram puts the MP4 in `mediaUrl` and the still in
 *   `displayUrl`, so a video frame renders a `<video controls>` with the still
 *   as its poster — the play badge on the tile leads to something that plays.
 *   It starts muted because browsers block autoplay with sound, and a video
 *   that refuses to start is worse than one the visitor unmutes.
 * - **Changing frame cross-fades.** Swapping the media outright is what the
 *   client saw as the content jumping.
 *
 * Closes on Escape, on the backdrop and on the ×; the arrow keys page. Body
 * scroll is locked while it is open, the same way `MobileNavOverlay` locks it.
 */
function Lightbox({
  posts,
  startIndex,
  onClose,
  instagramHref,
}: {
  posts: InstagramFeedPost[];
  startIndex: number;
  onClose: () => void;
  instagramHref: string;
}) {
  const steps = useMemo(() => stepsOf(posts), [posts]);
  const [cursor, setCursor] = useState(() =>
    Math.max(0, steps.findIndex((step) => step.post === startIndex)),
  );

  const go = useCallback(
    (by: number) => setCursor((current) => (current + by + steps.length) % steps.length),
    [steps.length],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [go, onClose]);

  const step = steps[cursor];
  if (!step) return null;
  const post = posts[step.post];
  const frames = framesOf(post);
  const current = frames[step.frame];
  const caption = post.caption?.trim() || "";
  const date = formatFeedDate(post.timestamp);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Instagram post"
      className="fixed inset-0 z-[300] flex items-center justify-center bg-ink/80 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-2xl flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative w-full">
          {/* Keyed on the cursor so every step fades in rather than snapping,
              and so a video is torn down instead of playing on underneath. */}
          <div key={cursor} className="animate-fade-in flex justify-center">
            {current?.video ? (
              <video
                src={current.video}
                poster={current.src}
                controls
                autoPlay
                muted
                playsInline
                loop
                className="max-h-[70vh] w-auto max-w-full rounded-xl bg-ink object-contain"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element -- expiring
                 signed URLs must not be cached by the image optimizer. */
              <img
                src={current?.src}
                alt={post.altText || caption.slice(0, 120) || "Instagram post"}
                className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain"
              />
            )}
          </div>

          {/* Outside the picture's top-right corner, light on the dimmed page —
              where the app puts it, and clear of the media so it never covers
              the first thing the visitor came to look at. */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute -top-1 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-lg leading-none text-ink transition-colors duration-300 hover:bg-white"
          >
            &times;
          </button>

          {steps.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous"
                className="absolute top-1/2 left-0 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/35"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.5 5 8 12l6.5 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next"
                className="absolute top-1/2 right-0 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/35"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9.5 5 16 12l-6.5 7" />
                </svg>
              </button>
            </>
          ) : null}
        </div>

        {frames.length > 1 ? (
          <div className="mt-3 flex justify-center gap-1.5">
            {frames.map((item, dot) => (
              <button
                key={item.src}
                type="button"
                onClick={() =>
                  setCursor(
                    steps.findIndex((s) => s.post === step.post && s.frame === dot),
                  )
                }
                aria-label={`Image ${dot + 1}`}
                aria-current={dot === step.frame}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  dot === step.frame ? "bg-white" : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        ) : null}

        <div key={`caption-${step.post}`} className="animate-fade-in w-full">
          <Caption text={caption} />

          <div className="mt-4 flex items-center justify-between gap-4 text-[13px] text-white/70">
            <span>{date}</span>
            <a
              href={post.permalink || instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white transition-colors duration-300 hover:text-primary"
            >
              View on Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The live Instagram band.
 *
 * **Fetched on mount, never prerendered.** The feed hands back Instagram's own
 * CDN links and those are signed with an expiry a few days out; every route
 * here is statically generated, so a server-fetched grid would bake today's
 * signatures into HTML served for weeks. The tiles are plain `<img>` for the
 * same reason — the optimizer would cache a transform against a URL that is
 * about to die, and it would mean allow-listing `*.fbcdn.net`.
 *
 * **Its appearance comes from the feed, not from this file.** Columns per
 * breakpoint, gap, corner radius, aspect ratio, whether captions and stats
 * show — all of it is the `config` block the workspace publishes, so what the
 * band renders is what the app's own preview shows. That includes rounded
 * corners, which is the one place this site departs from its square-cornered
 * card rule: the client asked for the app's look applied as-is, and the radius
 * is the app's own setting. Change it in the workspace, not here.
 */
export function InstagramFeedGrid({
  endpoint,
  instagramHref,
  limit = 9,
  columns = 3,
  fallback = null,
}: InstagramFeedGridProps) {
  const [posts, setPosts] = useState<InstagramFeedPost[] | null>(null);
  const [config, setConfig] = useState<InstagramFeedConfig | null>(null);
  const [failed, setFailed] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!endpoint) return;
    const controller = new AbortController();

    fetch(endpoint, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data: { posts?: InstagramFeedPost[]; config?: InstagramFeedConfig }) => {
        setPosts(Array.isArray(data?.posts) ? data.posts : []);
        setConfig(data?.config ?? null);
      })
      .catch((error) => {
        if ((error as Error).name === "AbortError") return;
        setFailed(true);
      });

    return () => controller.abort();
  }, [endpoint]);

  if (!endpoint || failed || posts === null || posts.length === 0) {
    return <>{fallback}</>;
  }

  const visible = posts.slice(0, limit);
  const gap = config?.gap || DEFAULT_CONFIG.gap;
  const radius = config?.radius || DEFAULT_CONFIG.radius;
  const aspectRatio = config?.aspectRatio || DEFAULT_CONFIG.aspectRatio;
  const showCaption = config?.showCaption ?? "hover";
  const showStats = config?.showStats ?? false;

  const isCarousel = (config?.layout ?? "grid") === "carousel";
  // How many posts a phone shows — a grid only. The workspace sends `limitSm`
  // alongside `columnsSm`, and they are not the same thing: two columns of a
  // six-post feed is three rows of phone-width squares (a 2400px band at
  // `columnsSm: 1`), where the app shows one row. The extras stay in the markup
  // and are hidden under `md`, so one render serves both breakpoints.
  //
  // A carousel ignores it: capping a scrolling row at two items leaves nothing
  // to scroll, which is the one thing a carousel is for. There `columnsSm` sets
  // how many are in view and the rest are a swipe away.
  const smallLimit = isCarousel ? visible.length : (config?.limitSm ?? visible.length);

  // Columns are inline custom properties, not Tailwind classes: they are
  // numbers that arrive at runtime, and Tailwind can only compile class names
  // it can see in the source (constraint 1). The media queries live in the
  // `grid-cols-[…]` / `basis-[…]` arbitrary values below, which are literal.
  const columnStyle = {
    "--ig-cols": String(config?.columnsSm ?? 3),
    "--ig-cols-md": String(config?.columnsMd ?? 3),
    "--ig-cols-lg": String(config?.columns ?? columns),
    "--ig-gap": gap,
    gap,
  } as React.CSSProperties;

  // A carousel is one scrolling row: each tile takes a whole column's width and
  // the row scrolls, rather than wrapping. `scroll-snap` is what makes a swipe
  // land on a tile instead of halfway between two.
  const trackClassName = isCarousel
    ? "mt-8 flex snap-x snap-mandatory overflow-x-auto pb-2 md:mt-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    : "mt-8 grid grid-cols-[repeat(var(--ig-cols),minmax(0,1fr))] md:mt-10 md:grid-cols-[repeat(var(--ig-cols-md),minmax(0,1fr))] lg:grid-cols-[repeat(var(--ig-cols-lg),minmax(0,1fr))]";

  const itemClassName = isCarousel
    ? "w-[calc((100%-var(--ig-cols)*var(--ig-gap)+var(--ig-gap))/var(--ig-cols))] shrink-0 snap-start md:w-[calc((100%-var(--ig-cols-md)*var(--ig-gap)+var(--ig-gap))/var(--ig-cols-md))] lg:w-[calc((100%-var(--ig-cols-lg)*var(--ig-gap)+var(--ig-gap))/var(--ig-cols-lg))]"
    : "";

  return (
    <>
      <div className={trackClassName} style={columnStyle}>
        {visible.map((post, index) => {
          const src = stillOf(post);
          if (!src) return null;
          const caption = post.caption?.trim() || "";
          return (
            <Reveal
              key={post.id}
              delay={index * 60}
              className={`${itemClassName} ${index >= smallLimit ? "hidden md:block" : ""}`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={post.altText || caption.slice(0, 80) || "Open Instagram post"}
                className="group/insta relative block w-full overflow-hidden"
                style={{ aspectRatio, borderRadius: radius }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- see
                    the note on this component. */}
                <img
                  src={src}
                  alt={post.altText || caption.slice(0, 120) || "Instagram post"}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/insta:scale-110"
                />

                <MediaBadge post={post} />

                <span
                  aria-hidden
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/0 p-4 text-center opacity-0 transition-all duration-300 group-hover/insta:bg-ink/55 group-hover/insta:opacity-100"
                >
                  {showCaption === "hover" && caption ? (
                    <span className="line-clamp-3 text-[13px] leading-snug font-light text-white">
                      {caption}
                    </span>
                  ) : (
                    <InstagramIcon className="h-6 w-6 text-white" />
                  )}
                  {showStats ? (
                    <span className="flex items-center gap-3 text-[12px] font-light text-white/90">
                      <span className="flex items-center gap-1">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                          <path d="M12 20.5 4.5 13a4.6 4.6 0 0 1 6.5-6.5l1 1 1-1A4.6 4.6 0 0 1 19.5 13L12 20.5Z" />
                        </svg>
                        {post.likeCount ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M20 12a7.5 7.5 0 0 1-10.9 6.7L4 20l1.3-4.6A7.5 7.5 0 1 1 20 12Z" />
                        </svg>
                        {post.commentsCount ?? 0}
                      </span>
                    </span>
                  ) : null}
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>

      {openIndex !== null ? (
        <Lightbox
          posts={visible}
          startIndex={openIndex}
          onClose={() => setOpenIndex(null)}
          instagramHref={instagramHref}
        />
      ) : null}
    </>
  );
}
