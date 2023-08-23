import LeftBar from "@/components/LeftBar";

function LeftLayout({ children }) {
  return (
    <div className="flex w-full">
      <div className="w-96 hidden md:block">
        <LeftBar />
      </div>
      <div>{children}</div>
    </div>
  );
}

export default LeftLayout;
