import { useState } from 'react';
import styled, { useTheme } from 'styled-components';

import { truncateAddress } from '@daohaus/utils';
import { getNetworkName } from '@daohaus/keychain-utils';

import {
  Button,
  DropdownMenu,
  DropdownProfileTrigger,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  ParXs,
} from '@daohaus/ui';

import { useDHConnect } from '../../HausConnectContext';
import { ExplorerLink } from '../ExplorerLink';

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const UserConnectedDropdown = ({ isSm }: { isSm: boolean }) => {
  const { disconnect, address, chainId, profile, validNetwork } =
    useDHConnect();
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const networkName = getNetworkName(chainId as string);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownProfileTrigger
        color="primary"
        profile={profile}
        avatarOnly={isSm}
      >
        {!isSm && (
          <ParXs color={theme.button.primary.solid.text}>
            {(networkName && `@${networkName}`) || 'Wrong Network'}
          </ParXs>
        )}
      </DropdownProfileTrigger>
      <DropdownContent align="end">
        <DropdownLabel>
          <AddressContainer className="address-container">
            <ExplorerLink
              className="explorer-link"
              address={address || undefined}
            >
              <ParXs>{address && truncateAddress(address)}</ParXs>
            </ExplorerLink>
          </AddressContainer>
          <ParXs>
            {validNetwork && chainId
              ? `Connected To ${getNetworkName(chainId)}`
              : 'Unsupported Network'}
          </ParXs>
        </DropdownLabel>
        <DropdownItem asChild>
          <Button
            color="secondary"
            variant="outline"
            size={isSm ? 'sm' : 'md'}
            fullWidth
            onClick={disconnect}
          >
            Disconnect
          </Button>
        </DropdownItem>
      </DropdownContent>
    </DropdownMenu>
  );
};
