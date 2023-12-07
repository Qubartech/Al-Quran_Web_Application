import LeftBar from "@/components/LeftBar";

async function LeftLayout({ children }) {

  return (
    <div className="flex justify-between w-full">
      <div className="w-96 hidden md:block">
        <LeftBar />
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}

export default LeftLayout;
