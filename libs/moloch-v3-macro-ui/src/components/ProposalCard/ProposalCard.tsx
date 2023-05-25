import { useState } from 'react';
import styled from 'styled-components';
import { Card, widthQuery } from '@daohaus/ui';

import { MolochV3Proposal } from '@daohaus/moloch-v3-data';
import { ProposalCardOverview } from './ProposalCardOverview';
import { ActionLifeCycleFns } from './types';
import { ProposalActions } from './ProposalActions';
import { PROPOSAL_TYPE_LABELS, SENSITIVE_PROPOSAL_TYPES } from '@daohaus/utils';

const ProposalCardContainer = styled(Card)`
  display: flex;
  gap: 3rem;
  width: 100%;

  margin-bottom: 3rem;
  padding: 2.3rem 2.5rem;
  border: none;
  min-height: 23.8rem;
  @media ${widthQuery.sm} {
    gap: 2rem;
    flex-direction: column;
    height: auto;
    margin-bottom: 2rem;
  }
`;

const LeftCard = styled.div`
  width: 100%;
  @media ${widthQuery.sm} {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }
`;

const RightCard = styled.div`
  width: 32rem;
  min-width: 32rem;

  @media ${widthQuery.sm} {
    max-width: 100%;
    min-width: 0;
  }
`;

type BaseProposalCardProps = {
  proposal: MolochV3Proposal;
  sensitiveProposalTypes?: Record<string, boolean>;
  proposalTypes?: Record<string, string>;
  daoChain: string;
  daoId: string;
  allowLinks?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
};

export const ProposalCard = ({
  proposal,
  sensitiveProposalTypes = SENSITIVE_PROPOSAL_TYPES,
  proposalTypes = PROPOSAL_TYPE_LABELS,
  daoChain,
  daoId,
  allowLinks = false,
  onSuccess,
  onError,
}: BaseProposalCardProps) => {
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const lifeCycleFnsOverride: ActionLifeCycleFns = {
    onActionTriggered: () => setActionLoading(true),
    onPollError: () => {
      onError?.();
      setActionLoading(false);
    },
    onPollSuccess: () => {
      onSuccess?.();
      setActionLoading(false);
    },
    onTxError: () => {
      onError?.();
      setActionLoading(false);
    },
  };

  return (
    <ProposalCardContainer>
      <LeftCard>
        <ProposalCardOverview
          loading={actionLoading}
          proposal={proposal}
          sensitiveProposalTypes={sensitiveProposalTypes}
          proposalTypes={proposalTypes}
          daoChain={daoChain}
          daoId={daoId}
          allowLinks={allowLinks}
        />
      </LeftCard>
      <RightCard>
        <ProposalActions
          lifeCycleFnsOverride={lifeCycleFnsOverride}
          proposal={proposal}
          daoChain={daoChain}
          daoId={daoId}
        />
      </RightCard>
    </ProposalCardContainer>
  );
};
