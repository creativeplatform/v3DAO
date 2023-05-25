import { useCallback, useEffect, useState } from 'react';
import { RiErrorWarningLine, RiTimeLine } from 'react-icons/ri/index.js';
import { useParams, Link as RouterLink } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import {
  AccountProfile,
  charLimit,
  formatShortDateTimeFromSeconds,
} from '@daohaus/utils';
import { Keychain, ValidNetwork } from '@daohaus/keychain-utils';

import { MolochV3Proposal } from '@daohaus/moloch-v3-data';
import {
  Button,
  ParLg,
  ParMd,
  useBreakpoint,
  widthQuery,
  Tooltip,
  ParSm,
  Theme,
  Icon,
  MemberCard,
  MemberCardExplorerLink,
  DropdownLinkStyles,
  MemberCardItem,
  MemberCardCopyAddress,
} from '@daohaus/ui';

import { fetchProfile } from '../utils/cacheProfile';
import { getProposalTypeLabel } from '../utils/general';
import { SENSITIVE_PROPOSAL_TYPES } from '../utils/constants';

const OverviewBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.1rem;
  height: 100%;
  .title {
    margin-bottom: 2rem;
  }
  .description {
    word-break: break-word;
    margin-bottom: auto;
  }
  @media ${widthQuery.md} {
    .description {
      margin-bottom: 2rem;
    }
  }
`;

const SubmittedContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2rem;
  .submitted-by {
    margin-right: 1rem;
  }
  @media ${widthQuery.sm} {
    flex-direction: column;
  }
`;

const StyledRouterLink = styled(RouterLink)`
  ${DropdownLinkStyles}
  :hover {
    text-decoration: none;
  }
`;

type ProposalCardOverviewProps = {
  loading: boolean;
  proposal: MolochV3Proposal;
};

export const ProposalCardOverview = ({
  loading,
  proposal,
}: ProposalCardOverviewProps) => {
  const { daochain, daoid } = useParams();
  const theme = useTheme();
  const isMobile = useBreakpoint(widthQuery.sm);
  const isMd = useBreakpoint(widthQuery.md);
  const [submitterProfile, setSubmitterProfile] = useState<AccountProfile>();

  const fetchMemberProfile = useCallback(
    async (address: string, setter: typeof setSubmitterProfile) => {
      const profile = await fetchProfile(address, daochain as ValidNetwork);
      setter(profile);
    },
    [daochain]
  );

  useEffect(() => {
    if (!submitterProfile) {
      fetchMemberProfile(proposal.createdBy, setSubmitterProfile);
    }
  }, [
    fetchMemberProfile,
    proposal.createdBy,
    submitterProfile,
    setSubmitterProfile,
  ]);

  return (
    <OverviewBox>
      <OverviewHeader loading={loading} proposal={proposal} />
      <ParLg className="title">{proposal.title}</ParLg>
      <ParMd className="description" color={theme.secondary.step11}>
        {charLimit(proposal.description, 145)}
      </ParMd>
      {isMd && (
        <StyledRouterLink
          to={`/molochV3/${daochain}/${daoid}/proposals/${proposal.proposalId}`}
        >
          <Button
            color="secondary"
            size="sm"
            fullWidth={isMobile}
            disabled={loading}
          >
            View Details
          </Button>
        </StyledRouterLink>
      )}
      <SubmittedContainer>
        <ParMd color={theme.secondary.step11} className="submitted-by">
          Submitted by
        </ParMd>
        <MemberCard
          variant="ghost"
          profile={
            submitterProfile || {
              address: proposal.createdBy,
            }
          }
        >
          <MemberCardItem asChild>
            <StyledRouterLink
              to={`/molochv3/${daochain}/${daoid}/members/${proposal.createdBy}`}
            >
              View Profile
            </StyledRouterLink>
          </MemberCardItem>
          <MemberCardExplorerLink
            explorerNetworkId={daochain as keyof Keychain}
            profileAddress={submitterProfile?.address || proposal.createdBy}
          >
            View on Etherscan
          </MemberCardExplorerLink>
          <MemberCardCopyAddress
            profileAddress={submitterProfile?.address || proposal.createdBy}
          >
            Copy Address
          </MemberCardCopyAddress>
        </MemberCard>
        {proposal.proposedBy && proposal.proposedBy !== proposal.createdBy && (
          <>
            <ParMd color={theme.secondary.step11} className="submitted-by">
              through
            </ParMd>
            <MemberCard
              variant="ghost"
              profile={{
                address: proposal.proposedBy,
              }}
            >
              <MemberCardItem asChild>
                <StyledRouterLink
                  to={`/molochv3/${daochain}/${daoid}/members/${proposal.proposedBy}`}
                >
                  View Profile
                </StyledRouterLink>
              </MemberCardItem>
              <MemberCardExplorerLink
                explorerNetworkId={daochain as keyof Keychain}
                profileAddress={proposal.proposedBy}
              >
                View on Etherscan
              </MemberCardExplorerLink>
              <MemberCardCopyAddress profileAddress={proposal.proposedBy}>
                Copy Address
              </MemberCardCopyAddress>
            </MemberCard>
          </>
        )}
      </SubmittedContainer>
    </OverviewBox>
  );
};

const OverviewContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  @media ${widthQuery.md} {
    align-items: center;
    margin-bottom: 2rem;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
`;

const StyledPropType = styled.span`
  color: ${({ theme, warning }: { theme: Theme; warning: boolean }) =>
    warning && theme.warning.step9};
`;

const WarningIcon = styled(RiErrorWarningLine)`
  color: ${({ theme }: { theme: Theme }) => theme.warning.step9};
  height: 2rem;
  width: 2rem;
  margin-right: 0.5rem;
`;

const PropIdText = styled(ParSm)`
  margin-right: 0.5rem;
`;

export const OverviewHeader = ({
  loading,
  proposal,
}: {
  loading: boolean;
  proposal: MolochV3Proposal;
}) => {
  const { daochain, daoid } = useParams();

  const theme = useTheme();
  const isMobile = useBreakpoint(widthQuery.md);
  return (
    <OverviewContainer>
      {isMobile ? (
        <>
          <HeaderContainer>
            <PropIdText color={theme.secondary.step11}>
              {proposal.proposalId} |
            </PropIdText>
            {SENSITIVE_PROPOSAL_TYPES[proposal.proposalType] && (
              <Icon label="Warning">
                <WarningIcon />
              </Icon>
            )}
            <ParSm
              color={
                SENSITIVE_PROPOSAL_TYPES[proposal.proposalType]
                  ? theme.warning.step9
                  : theme.secondary.step11
              }
            >
              {getProposalTypeLabel(proposal.proposalType)}
            </ParSm>
          </HeaderContainer>
          <Tooltip
            content={formatShortDateTimeFromSeconds(proposal.createdAt)}
            triggerEl={
              <RiTimeLine color={theme.secondary.step9} size="1.6rem" />
            }
          />
        </>
      ) : (
        <>
          <HeaderContainer>
            <PropIdText color={theme.secondary.step11}>
              {proposal.proposalId} |
            </PropIdText>
            {SENSITIVE_PROPOSAL_TYPES[proposal.proposalType] && (
              <Icon label="Warning">
                <WarningIcon />
              </Icon>
            )}
            <ParSm color={theme.secondary.step11}>
              <StyledPropType
                warning={SENSITIVE_PROPOSAL_TYPES[proposal.proposalType]}
              >
                {getProposalTypeLabel(proposal.proposalType)}
              </StyledPropType>{' '}
              | {formatShortDateTimeFromSeconds(proposal.createdAt)}
            </ParSm>
          </HeaderContainer>
          <StyledRouterLink
            to={`/molochV3/${daochain}/${daoid}/proposals/${proposal.proposalId}`}
          >
            <Button color="secondary" size="sm" disabled={loading}>
              View Details
            </Button>
          </StyledRouterLink>
        </>
      )}
    </OverviewContainer>
  );
};
