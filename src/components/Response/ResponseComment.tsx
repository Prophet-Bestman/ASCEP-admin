import React from "react";

import CommentResponses from "./CommentResponses";

interface ResponseCommentProps {
  comment: ReportComment;
  reportId: string;
}

const ResponseComment = ({ comment, reportId }: ResponseCommentProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[24px] space-y-4 shadow-sm p-4 md:p-8">
        <div className="flex items-center justify-between gap-8 md:justify-start">
          <div className="flex items-center gap-2">
            <img
              src={comment.author.profile_picture}
              className="w-10 h-10 rounded-full"
              alt=""
            />
            <p className="text-lg font-bold md:text-xl text-dark">
              {comment.author.username}
            </p>
          </div>

          <p className="text-sm md:text-base text-subtle_text">
            {new Date(comment.createdAt).toDateString()}
          </p>
        </div>

        <p className="text-sm text-dark">{comment.content}</p>

        {comment.comment_response_cache > 0 && (
          <CommentResponses comment={comment} reportId={reportId} />
        )}
        <div className="border-[1px] border-dark/10"></div>
      </div>
    </div>
  );
};

export default React.memo(ResponseComment);
