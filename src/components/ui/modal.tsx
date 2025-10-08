export function Modal({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  if (!show) return null;

  return (
    <div className=" fixed grid place-items-center grid-cols-1 p-4 top-0 left-0 w-full h-full min-h-screen z-40 overflow-hidden overflow-y-auto bg-black/50 backdrop-blur-sm transition-opacity">
      <div className=" p-4 flex flex-col justify-start w-full max-w-full md:max-w-lg md:p-7 bg-gray-900 rounded-xl shadow-lg">
        {children}
      </div>
    </div>
  );
}
