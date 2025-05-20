import type { MDXComponents } from "mdx/types"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ className, ...props }) => <h1 className={cn("mt-8 mb-4 text-3xl font-bold", className)} {...props} />,
    h2: ({ className, ...props }) => <h2 className={cn("mt-6 mb-3 text-2xl font-bold", className)} {...props} />,
    h3: ({ className, ...props }) => <h3 className={cn("mt-4 mb-2 text-xl font-bold", className)} {...props} />,
    p: ({ className, ...props }) => <p className={cn("my-4 leading-7", className)} {...props} />,
    ul: ({ className, ...props }) => <ul className={cn("my-4 ml-6 list-disc", className)} {...props} />,
    ol: ({ className, ...props }) => <ol className={cn("my-4 ml-6 list-decimal", className)} {...props} />,
    li: ({ className, ...props }) => <li className={cn("mt-1", className)} {...props} />,
    blockquote: ({ className, ...props }) => (
      <blockquote className={cn("mt-6 border-l-2 pl-4 italic", className)} {...props} />
    ),
    img: ({ className, alt, ...props }) => (
      // @ts-ignore
      <Image className={cn("rounded-md", className)} alt={alt} {...props} />
    ),
    hr: ({ ...props }) => <hr className="my-6 border-gray-700" {...props} />,
    table: ({ className, ...props }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className={cn("w-full", className)} {...props} />
      </div>
    ),
    tr: ({ className, ...props }) => <tr className={cn("m-0 border-t border-gray-700 p-0", className)} {...props} />,
    th: ({ className, ...props }) => (
      <th className={cn("border border-gray-700 px-4 py-2 text-left font-bold", className)} {...props} />
    ),
    td: ({ className, ...props }) => (
      <td className={cn("border border-gray-700 px-4 py-2 text-left", className)} {...props} />
    ),
    pre: ({ className, ...props }) => (
      <pre className={cn("mt-6 mb-4 overflow-x-auto rounded-lg bg-gray-800 p-4", className)} {...props} />
    ),
    code: ({ className, ...props }) => (
      <code
        className={cn("relative rounded bg-gray-800 px-[0.3rem] py-[0.2rem] font-mono text-sm", className)}
        {...props}
      />
    ),
    ...components,
  }
}

