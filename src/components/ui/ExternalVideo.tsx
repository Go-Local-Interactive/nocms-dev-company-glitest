import * as React from "react";

/**
 * Embed a YouTube or Vimeo video by URL. Ported verbatim from
 * `storage-theme-payload`'s ExternalVideo — same regex set, same iframe
 * shape, just dropped the `style.css` import (Tailwind-only here).
 *
 * Editor contract: root tagged `data-nocms-component="external-video"`.
 * The `<iframe>` carries `data-role="media"` so the editor can swap the
 * src.
 */
interface ExternalVideoProps {
  videoUrl: string;
  className?: string;
  title?: string;
}

function getVideoEmbed(url: string) {
  // YouTube — youtu.be/ID, youtube.com/watch?v=ID, /embed/ID, /v/ID
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return {
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
      aspectRatio: "16 / 9",
    };
  }

  // Vimeo — already in player.vimeo.com form
  const vimeoEmbedRegex = /player\.vimeo\.com\/(?:video\/)?([a-zA-Z0-9-]+)/;
  if (vimeoEmbedRegex.test(url)) {
    return { embedUrl: url, aspectRatio: "16 / 9" };
  }

  // Standard Vimeo — vimeo.com/123456
  const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      aspectRatio: "16 / 9",
    };
  }

  // Fallback — assume the URL is already iframe-ready
  return { embedUrl: url, aspectRatio: "16 / 9" };
}

export const ExternalVideo: React.FC<ExternalVideoProps> = ({
  videoUrl,
  className = "",
  title = "Video player",
}) => {
  const { embedUrl, aspectRatio } = getVideoEmbed(videoUrl);

  return (
    <div
      data-nocms-component="external-video"
      className={`relative w-full overflow-hidden rounded-lg ${className}`}
      style={{ aspectRatio }}
    >
      <iframe
        data-role="media"
        src={embedUrl}
        title={title}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};
