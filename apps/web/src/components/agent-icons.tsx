import type { ImgHTMLAttributes, SVGProps } from "react";
import { cn } from "@/lib/utils";

type IconProps = SVGProps<SVGSVGElement>;

type BrandImgProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> & {
  className?: string;
};

/** Brand marks matching fumadocs ViewOptionsPopover (page-actions.js). */
export function CursorIcon(props: IconProps) {
  return (
    <svg
      fill="currentColor"
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Cursor</title>
      <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
    </svg>
  );
}

function BrandImg({
  src,
  alt,
  className,
  ...props
}: BrandImgProps & { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={14}
      height={14}
      className={cn("size-3.5 shrink-0 rounded-[3px] object-cover", className)}
      {...props}
    />
  );
}

/** Official Claude / Anthropic starburst mark. */
export function ClaudeIcon({ className, ...props }: BrandImgProps) {
  return (
    <BrandImg
      src="/brands/claude.png"
      alt="Claude"
      className={className}
      {...props}
    />
  );
}

/** Official OpenAI Codex mark. */
export function CodexIcon({ className, ...props }: BrandImgProps) {
  return (
    <BrandImg
      src="/brands/codex.png"
      alt="Codex"
      className={className}
      {...props}
    />
  );
}

/** Official Visual Studio Code mark. */
export function VsCodeIcon({ className, ...props }: BrandImgProps) {
  return (
    <BrandImg
      src="/brands/vscode.png"
      alt="VS Code"
      className={className}
      {...props}
    />
  );
}
