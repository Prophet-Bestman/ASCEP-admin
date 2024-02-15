import { Button } from "@/components/ui/button";
import { CloseCircle } from "iconsax-react";
import { useState } from "react";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { FormInput, IconWrapper } from "@/components/custom";
import { useClickAway } from "@uidotdev/usehooks";
import {
  useGetProposalCommentResponses,
  usePublishProposalComment,
  useVoteProposalComment,
} from "@/api/democracy/proposals";
import { proposalCommentSchema } from "@/schemas/ProposalSchema";
import { Separator } from "@/components/ui/separator";
import CommentCard from "../common/CommentCard";
import ProposalCommentResponse from "./ProposalCommentResponse";

interface ProposalCommentCardProps {
  comment: CommentType;
}
const ProposalCommentCard: React.FC<ProposalCommentCardProps> = ({
  comment,
}) => {
  const [dynamicPadding] = useState(20);

  const { proposalId } = useParams();

  const [showResponse, setShowResponse] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const { mutateAsync: publishResponse, isLoading: isPublishingComment } =
    usePublishProposalComment();

  const {
    data: Data,
    isRefetching: isLoadingResponses,
    refetch: getResponses,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetProposalCommentResponses(comment.id);

  const { mutate: voteComment, isLoading: isVotingComment } =
    useVoteProposalComment();

  // CLose responses on click away
  const ref = useClickAway<HTMLDivElement>(() => {
    setTimeout(() => {
      setIsReplying(false);
      setShowResponse(false);
    }, 500);
  });

  const form = useForm<z.infer<typeof proposalCommentSchema>>({
    resolver: zodResolver(proposalCommentSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
      proposal_id: "",
      comment_reference: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  async function onSubmit(values: z.infer<typeof proposalCommentSchema>) {
    await publishResponse({
      ...values,
      proposal_id: proposalId!,
      comment_reference: comment.id,
    });
    closeResponse();
  }

  //close response
  const closeResponse = () => {
    reset();
    setIsReplying(false);
  };

  // like comment
  const handleLike = () => {
    voteComment({ type: "like", comment_id: comment.id });
  };

  // dislike comment
  const handleDislike = () => {
    voteComment({ type: "dislike", comment_id: comment.id });
  };

  return (
    <div className="bg-[#fff] p-6 rounded-xl" ref={ref}>
      <CommentCard
        comment={comment}
        // setIsReplying={setIsReplying}
        setShowResponse={setShowResponse}
        showResponse={showResponse}
        getResponses={getResponses}
        isLoadingResponses={isLoadingResponses}
        isVotingComment={isVotingComment}
        handleLike={handleLike}
        handleDislike={handleDislike}
      />

      {/* REPLY INPUT */}
      {isReplying && (
        <div>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormInput
                label="Leave a response"
                control={control}
                name="content"
                errors={errors}
                className="h-8 rounded-full focus-visible:ring-primary focus-visible:ring-1 focus-visible:ring-offset-0"
              />

              <div className="flex items-center justify-between">
                <Button
                  type="submit"
                  className="w-full max-w-[200px] h-10"
                  isLoading={isPublishingComment}
                  disabled={isPublishingComment}
                >
                  Publish response
                </Button>
                <IconWrapper
                  className="p-0 cursor-pointer text-dark"
                  onClick={closeResponse}
                >
                  <CloseCircle size={20} />
                </IconWrapper>
              </div>
            </form>
          </Form>
        </div>
      )}

      <div
        className={`${showResponse ? "" : "h-0  overflow-hidden"} ${
          isLoadingResponses && "opacity-50 pointer-events-none"
        }`}
      >
        {Data?.pages.map((commentsData, i) => (
          <div key={i}>
            {commentsData.comments.map((response) => (
              <ProposalCommentResponse
                key={response.id}
                response={response}
                paddingLeft={dynamicPadding + 20}
                refetchParentResponses={getResponses}
              />
            ))}
          </div>
        ))}
        <Separator orientation="horizontal" className="my-1 bg-base-500" />
        {Data?.pages[Data.pages.length - 1].meta.next_page_url && (
          <Button
            className="w-full py-4 -mb-5 bg-transparent h-fit hover:bg-transparent"
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
          >
            Load more
          </Button>
        )}
      </div>
    </div>
  );
};
export default ProposalCommentCard;
