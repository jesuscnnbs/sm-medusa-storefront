import React from "react"
import ReactMarkdown from "react-markdown"
import { twMerge } from "tailwind-merge"

interface MarkdownComponentProps {
  content: string
  className?: string
  variant?: "default" | "admin" | "menu"
}

/**
 * Reusable Markdown component with consistent styling across the app
 *
 * @param content - The markdown string to render
 * @param className - Additional CSS classes to apply to the container
 * @param variant - Predefined styling variants: "default", "admin", or "menu"
 */
export const MarkdownComponent: React.FC<MarkdownComponentProps> = ({
  content,
  className,
  variant = "default",
}) => {
  // Variant-specific styles
  const variantStyles = {
    default: {
      container: "prose prose-sm max-w-none",
      p: "mb-3 text-gray-700",
      strong: "font-bold text-gray-900",
      em: "italic",
      ul: "mb-3 ml-4 list-disc text-gray-700",
      ol: "mb-3 ml-4 list-decimal text-gray-700",
      li: "mb-1",
      h1: "mb-3 text-2xl font-bold text-gray-900",
      h2: "mb-2 text-xl font-bold text-gray-900",
      h3: "mb-2 text-lg font-bold text-gray-900",
      code: "px-1 py-0.5 bg-gray-100 rounded text-sm font-mono",
    },
    admin: {
      container: "prose prose-sm max-w-none",
      p: "mb-3 text-dark-sm",
      strong: "font-bold text-dark-sm",
      em: "italic text-dark-sm",
      ul: "list-disc list-inside mb-3 text-dark-sm",
      ol: "list-decimal list-inside mb-3 text-dark-sm",
      li: "mb-1 text-dark-sm",
      h1: "text-2xl font-bold mb-3 text-dark-sm",
      h2: "text-xl font-bold mb-2 text-dark-sm",
      h3: "text-lg font-bold mb-2 text-dark-sm",
      code: "px-1 py-0.5 bg-grey-sm/20 rounded text-sm font-mono text-dark-sm",
    },
    menu: {
      container: "prose prose-sm max-w-none",
      p: "mb-3 text-gray-600",
      strong: "font-bold text-gray-800",
      em: "italic",
      ul: "mb-3 ml-4 list-disc text-gray-600",
      ol: "mb-3 ml-4 list-decimal text-gray-600",
      li: "mb-1",
      h1: "mb-2 text-xl font-bold text-gray-800",
      h2: "mb-2 text-lg font-bold text-gray-800",
      h3: "mb-2 text-base font-bold text-gray-800",
      code: "px-1 py-0.5 bg-gray-100 rounded text-sm",
    },
  }

  const styles = variantStyles[variant]

  return (
    <div className={twMerge(styles.container, className)}>
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => (
            <p className={styles.p} {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className={styles.strong} {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className={styles.em} {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className={styles.ul} {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className={styles.ol} {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className={styles.li} {...props} />
          ),
          h1: ({ node, ...props }) => (
            <h1 className={styles.h1} {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className={styles.h2} {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className={styles.h3} {...props} />
          ),
          code: ({ node, ...props }) => (
            <code className={styles.code} {...props} />
          ),
          // Blockquote styling
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="pl-4 border-l-4 border-gray-300 italic my-3"
              {...props}
            />
          ),
          // Link styling
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
        }}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownComponent
