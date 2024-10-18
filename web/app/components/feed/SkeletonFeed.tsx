export const SkeletonFeed = () => {
  const skeletonItems = Array(3).fill(null)

  return (
    <main className="w-full flex items-center justify-center bg-gray-50">
      <section className="w-full p-4 py-[70px] max-w-[500px] h-full relative min-h-screen">
        <ul className="flex flex-col gap-4">
          {skeletonItems.map((_, index) => (
            <li
              key={index}
              className="flex flex-col gap-2 bg-white rounded-lg shadow-sm p-4"
            >
              <article>
                <header className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="min-w-[42px] w-[42px] h-[42px] bg-gray-200 rounded-full animate-pulse" />
                    <div className="flex flex-col gap-1">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 rounded-md animate-pulse" />
                </header>
                <div className="mt-2 h-20 bg-gray-200 rounded-lg animate-pulse" />
                <ul className="flex flex-col gap-2 mt-2">
                  {[1, 2].map((subtask) => (
                    <li
                      key={subtask}
                      className="flex items-center gap-3 w-full"
                    >
                      <span className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" />
                      <div className="h-8 bg-gray-200 rounded-lg w-full animate-pulse" />
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
