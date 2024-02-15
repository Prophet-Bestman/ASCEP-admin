import {
  useGetAllProposalTopics,
  useGetProposalCommunityMembers,
  useGetProposalInfo,
} from "@/api/democracy/proposals";
import { FilterButtons, NotFound } from "@/components/Democracy";
import CreateTopicModal from "@/components/Democracy/proposals/CreateTopicModal";
import ProposalParticipantCard from "@/components/Democracy/proposals/ProposalParticipantCard";
import ProposalTopicCard from "@/components/Democracy/proposals/ProposalTopicCard";

import { PageLoader, CustomPagination } from "@/components/custom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useDisclosure from "@/hooks/useDisclosure";
import { proposalTopicFilterButtonOptions } from "@/utils/Democracy/Proposals";
import { formattedDate } from "@/utils/helper";
import { Messages1 } from "iconsax-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProposalCommuntityHomePage = () => {
  const { proposalId } = useParams();

  const { isOpen: isModalOpen, onClose, onOpen } = useDisclosure();

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("newest");

  const {
    data: proposal,
    isError: noProposalError,
    isLoading: isLoadingProposal,
  } = useGetProposalInfo(proposalId!);

  const {
    refetch: refetchProposalTopics,
    data: proposalTopicData,
    isLoading: isLoadingProposalTopics,
    isFetching: isFetchingProposalTopics,
  } = useGetAllProposalTopics(page, proposalId!, filter);

  const { data: communityMembers } = useGetProposalCommunityMembers(
    proposalId!
  );

  useEffect(() => {
    refetchProposalTopics();
  }, [page, filter]);

  return (
    <div className="page-wrapper">
      <h4 className="mb-10 text-xl font-semibold md:text-2xl text-primary">
        Proposal community
      </h4>

      {/* ERROR */}
      {noProposalError && !proposal && <NotFound message="No proposal found" />}

      {/* PROPOSAL INFO */}
      {proposal && (
        <div>
          <div className="mt-10">
            <h1 className="my-2 text-xl capitalize md:text-2xl text-dark">
              {proposal.title}
            </h1>
            <div className="flex flex-wrap items-center justify-start gap-6">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={
                    proposal.author.profile_picture
                      ? proposal.author.profile_picture
                      : undefined
                  }
                />
                <AvatarFallback className="uppercase font-[700]">
                  {proposal.author.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-dark text-[14px] -ml-4">
                {proposal.author.username}
              </h2>
              <p className="text-[12px] text-base-400 my-3 ">
                {formattedDate(proposal.createdAt)}
              </p>
              <div className="flex items-center gap-3 rounded-[10px] px-3 py-1 text-white bg-dark text-xs w-fit">
                <Messages1 size={20} />
                {proposal.total_comments_cache} Comments
              </div>
            </div>
          </div>
          <div className="flex flex-col xl:flex-row gap-10 my-11 max-w-[1000px]">
            <p className="text-xl text-justify md:text-2xl text-subtle_text">
              Participate in the community of this proposal. An active community
              can help to improve the content of the proposal and boost its
              dissemination to get more support.
            </p>
            <div className="flex flex-col gap-5">
              <h2 className="pb-2 pt-0 pl-0 border-b-4 text-[18px] font-medium border-primary w-fit">
                Participant
              </h2>

              <Button className="rounded-lg h-fit w-fit" onClick={onOpen}>
                Create Topic
              </Button>
            </div>
          </div>

          <Separator orientation="horizontal" className="mb-10 bg-base-500" />
        </div>
      )}

      {/* *********************************************************************** PROPOSAL TOPICS ********************************************************************************/}

      {isLoadingProposal && <PageLoader />}

      {/* FILTER BUTTONS */}
      {communityMembers?.length !== 0 && (
        <FilterButtons
          filterButtonOptions={proposalTopicFilterButtonOptions}
          filterByButton={(value) => setFilter(value)}
          defaultFilterButtonValue="newest"
          isFiltering={isFetchingProposalTopics}
        />
      )}

      {/* LOADING TOPICS */}
      {isLoadingProposalTopics && <PageLoader />}

      {/* TOPICS */}
      {proposalTopicData?.data && proposalTopicData?.data.length > 0 && (
        <div
          className={`${
            isFetchingProposalTopics
              ? "opacity-50 pointer-events-none"
              : "bg-opacity-100"
          } grid lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-4 my-8`}
        >
          {proposalTopicData.data.map((topic) => (
            <ProposalTopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}

      {proposalTopicData?.data.length === 0 && !noProposalError && (
        <h1 className="text-xl">
          No topics created, Create the first community topic
        </h1>
      )}

      {/* CustomPagination */}
      {proposalTopicData?.meta && proposalTopicData.data.length > 0 && (
        <CustomPagination
          page={page}
          setPage={setPage}
          paginationData={proposalTopicData.meta}
          isFetching={isFetchingProposalTopics}
        />
      )}
      {/* PARTICIPANTS */}
      <h2 className="pb-2 pt-0 pl-0 my-8 border-b-4 text-[18px] font-medium border-primary w-fit">
        Participant ({communityMembers?.length})
      </h2>

      {communityMembers && communityMembers?.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {communityMembers.map((member) => (
            <ProposalParticipantCard key={member.user_id} member={member} />
          ))}
        </div>
      ) : (
        <div>
          <h1 className="text-xl">No participant in this community</h1>
        </div>
      )}
      {/* CREATE TOPIC */}
      {proposal && (
        <CreateTopicModal
          isOpen={isModalOpen}
          onOpenChange={onClose}
          onClose={onClose}
          propsalId={proposal.id}
        />
      )}
    </div>
  );
};

export default ProposalCommuntityHomePage;
