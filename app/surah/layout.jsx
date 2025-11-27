import LeftBar from "@/components/LeftBar";

async function LeftLayout({ children }) {
  return (
    <div className="flex justify-between gap-4 w-full my-8 text-gray-900 dark:text-gray-100">
      <div className="w-96 hidden md:block max-h-full overflow-hidden h-[calc(100vh-100px)] overflow-y-auto rounded-md glass">
        <LeftBar />
      </div>
      <div className="w-full rounded-md h-[calc(100vh-100px)] overflow-y-auto scroll-smooth duration-700 glass">
        {children}
      </div>
    </div>
  );
}

export default LeftLayout;
