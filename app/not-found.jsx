import Link from "next/link";

export const metadata = {
  title: `404 Page Not Found`,
};

function NotFound() {
  return (
    <>
      <section className="flex items-center h-full p-16 dark:bg-gray-900 dark:text-gray-100 md:h-[calc(100vh-8rem)]">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
          <div className="max-w-lg text-center">
            <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-400">
              <span className="sr-only">Error</span>404
            </h2>
            <p className="text-2xl font-semibold md:text-3xl">
              Sorry, we couldn&apos;t find this page.
            </p>
            <p className="mt-4 mb-8 dark:text-gray-400">
              But dont worry, you can find plenty of other things on our
              homepage.
            </p>
            <Link href="/">
              <button
                type="button"
                className=" bg-gradient-to-r from-primary-light via-primary to-primary-dark hover:bg-gradient-to-bl font-medium rounded-3xl text-sm px-5 md:px-9 py-3.5 text-center mr-2 mb-2 text-white   "
              >
                Back to home
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFound;
