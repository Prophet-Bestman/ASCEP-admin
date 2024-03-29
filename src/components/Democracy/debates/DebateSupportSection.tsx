import { Dislike, Like1 } from "iconsax-react";

export default function DebateSupportSection({ data }: { data: DebateType }) {
  return (
    <>
      <h3 className="text-xl ">Support</h3>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center justify-center w-[90px] h-[90px] gap-2 text-sm text-green-600 bg-green-100 rounded-2xl">
          <Like1 />
          {data.likePercentage}% ({data.likes})
        </div>
        <div className="flex flex-col items-center justify-center w-[90px] h-[90px] gap-2 text-sm text-red-600 bg-red-100 rounded-2xl">
          <Dislike />
          {data.likePercentage}% ({data.likes})
        </div>

        <div className="px-4 py-[6px] text-sm underline cursor-pointer rounded-xl bg-black/10">
          View Votes
        </div>
      </div>
    </>
  );
}
