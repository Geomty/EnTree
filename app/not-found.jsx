export const metadata = {
  title: {
    absolute: "404 – EnTree"
  }
};

export default function NotFound() {
  return (
    <div className="w-screen h-screen bg-neutral-950 select-none">
      <div className="absolute top-1/2 left-1/2 -translate-1/2 flex justify-center items-center gap-14">
        <div className="flex justify-center items-center">
          {("404").split("").map((value, index) => {
            let color;
            switch (index) {
              case 0:
                color = "text-banana-500";
                break;
              case 1:
                color = "text-olive-500";
                break;
              default:
                color = "text-slate-500";
                break;
            }
            return <p key={index} className={"text-9xl " + color}>{value}</p>;
          })}
        </div>
        <p className="text-8xl text-neutral-300">:/</p>
      </div>
    </div>
  )
}