import LeftBar from "@/components/LeftBar";

async function LeftLayout({ children }) {
  return (
    <div className="flex justify-between gap-4 w-full my-5 text-gray-900 dark:text-gray-100">
      <div className="w-96 hidden md:block max-h-full overflow-hidden h-[calc(100vh-89px)] overflow-y-auto bg-white dark:bg-gray-900 rounded-md">
        <LeftBar />
      </div>
      <div className="w-full bg-white dark:bg-gray-800 rounded-md h-[calc(100vh-89px)] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default LeftLayout;
