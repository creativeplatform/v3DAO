import { useEffect, useState } from 'react';
import { isValidNetwork, ValidNetwork } from '@daohaus/keychain-utils';
import { MolochV3Proposal } from '@daohaus/moloch-v3-data';
import {
  DecodedMultiTX,
  decodeProposalActions,
  isActionError,
} from '@daohaus/tx-builder';
import {
  AddressDisplay,
  Bold,
  DataSm,
  Divider,
  H4,
  Spinner,
  useBreakpoint,
  widthQuery,
} from '@daohaus/ui';
import {
  DAO_METHOD_TO_PROPOSAL_TYPE,
  MulticallAction,
  MulticallArg,
  PROPOSAL_TYPE_WARNINGS,
  SENSITIVE_PROPOSAL_TYPES,
  TXLego,
  ValidArgType,
} from '@daohaus/utils';

import { ActionAlert } from './ActionAlert';
import {
  DisplayContainer,
  LoadingContainer,
  MainContainer,
} from './ProposalActionData.styles';
import { ProposalWarning } from './ProposalWarning';
import { ValueDisplay } from './ValueDisplay';

export type ProposalActionConfig = {
  sensitiveProposalTypes?: Record<string, boolean>;
  actionToProposalType?: Record<string, string>;
  proposalTypeWarning?: Record<string, string>;
};

type ProposalActionDataProps = {
  daoChain: string;
  daoId: string;
  proposal: MolochV3Proposal;
  proposalActionConfig?: ProposalActionConfig;
  txLegos?: Record<string, TXLego>;
};

export const ProposalActionData = ({
  daoChain,
  daoId,
  proposal,
  proposalActionConfig = {
    sensitiveProposalTypes: SENSITIVE_PROPOSAL_TYPES,
    actionToProposalType: DAO_METHOD_TO_PROPOSAL_TYPE,
    proposalTypeWarning: PROPOSAL_TYPE_WARNINGS,
  },
  txLegos = {},
}: ProposalActionDataProps) => {
  const [decodeError, setDecodeError] = useState<boolean>(false);
  const [actionData, setActionData] = useState<DecodedMultiTX | null>();
  const [actionsMeta, setActionsMeta] = useState<MulticallAction[]>();

  const network = isValidNetwork(daoChain) ? daoChain : undefined;
  const isMobile = useBreakpoint(widthQuery.sm);

  useEffect(() => {
    if (proposal?.proposalType) {
      const txLego = txLegos[proposal.proposalType]?.args?.find(
        (tx) => (tx as MulticallArg).type === 'multicall'
      );
      setActionsMeta(txLego && (txLego as MulticallArg).actions);
    }
  }, [proposal?.proposalType, txLegos]);

  useEffect(() => {
    let shouldUpdate = true;
    const fetchPropActions = async (
      chainId: ValidNetwork,
      actionData: string,
      actionMeta?: MulticallAction[]
    ) => {
      const proposalActions = await decodeProposalActions({
        chainId,
        actionData,
        actionsMeta: actionMeta,
      });
      if (shouldUpdate) {
        setActionData(proposalActions);
        setDecodeError(
          proposalActions.length === 0 ||
            proposalActions.some((action) => isActionError(action))
        );
      }
    };

    if (!isValidNetwork(daoChain) || !proposal) return;
    fetchPropActions(daoChain, proposal.proposalData, actionsMeta);

    return () => {
      shouldUpdate = false;
    };
  }, [daoChain, proposal, actionsMeta]);

  return (
    <MainContainer>
      <DisplayContainer>
        {!actionData && (
          <LoadingContainer>
            <Spinner size="6rem" />
          </LoadingContainer>
        )}
        {actionData?.map((action, index) => {
          if (isActionError(action)) {
            return (
              <div
                className="display-segment data"
                key={`${action.message}-${index}`}
              >
                <H4 className="space">Action {index + 1}: Error</H4>
                <DataSm className="space">{action.message}</DataSm>
                <Divider className="space" />
                <DataSm className="space">
                  <Bold>HEX DATA:</Bold>
                </DataSm>
                <DataSm className="space">{action.data}</DataSm>
              </div>
            );
          }
          return (
            <div className="display-segment" key={`action_${index}`}>
              <div className="data">
                <H4 className="space">
                  Action {index + 1}: {action.name}
                </H4>
                <ActionAlert
                  action={action}
                  daoId={daoId}
                  daoChain={daoChain}
                  proposalType={proposal.proposalType}
                  proposalActionConfig={proposalActionConfig}
                />
                <DataSm className="space">
                  <Bold>TARGET</Bold>
                </DataSm>
                <AddressDisplay
                  className="space"
                  address={action.to}
                  copy
                  explorerNetworkId={network}
                  truncate={isMobile}
                />
                <DataSm className="space">
                  <Bold>VALUE</Bold>
                </DataSm>
                <DataSm className="space">{action.value}</DataSm>
                <Divider className="spaced-divider" />
              </div>
              {action.params?.map((arg, index) => {
                return (
                  <div className="data" key={`${arg.name}-${index}`}>
                    <DataSm className="space">
                      <Bold>
                        PARAM
                        {index + 1}:{' '}
                      </Bold>
                      {arg.name}
                    </DataSm>
                    <DataSm className="space">
                      <Bold>TYPE: </Bold>
                      {arg.type}
                    </DataSm>
                    <DataSm className="space">
                      <Bold>VALUE: </Bold>
                    </DataSm>
                    <ValueDisplay
                      argValue={arg.value}
                      argType={arg.type}
                      network={network}
                      isMobile={isMobile}
                    />
                    <Divider />
                  </div>
                );
              })}
            </div>
          );
        })}
      </DisplayContainer>
      {decodeError && (
        <ProposalWarning
          proposalType={proposal.proposalType}
          decodeError={decodeError}
          txHash={proposal.txHash}
          proposalActionConfig={proposalActionConfig}
          daoChain={daoChain}
        />
      )}
    </MainContainer>
  );
};
