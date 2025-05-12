export default function Page({
    params,
    searchParams,
  }: {
    params: Promise<{ notionId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {
    return <h1>My Page</h1>
  }