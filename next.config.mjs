import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: ['placeholder.com', 'via.placeholder.com'],
  },
}

const withMDX = createMDX({
  // 可以在這裡添加markdown插件
})

export default withMDX(nextConfig)

