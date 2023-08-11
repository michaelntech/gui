// Copyright 2021 Northern.tech AS
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
import React from 'react';

import { defaultState, undefineds } from '../../../../../tests/mockData';
import { render } from '../../../../../tests/setupTests';
import { ALL_DEVICES, DEVICE_CONNECT_STATES } from '../../../constants/deviceConstants';
import { uiPermissionsById } from '../../../constants/userConstants';
import DeviceConnection, { DeviceConnectionMissingNote, DeviceDisconnectedNote, PortForwardLink } from './connection';

describe('tiny DeviceConnection components', () => {
  [DeviceConnectionMissingNote, DeviceDisconnectedNote, PortForwardLink].forEach(async Component => {
    it(`renders ${Component.displayName || Component.name} correctly`, () => {
      const { baseElement } = render(<Component lastConnectionTs={defaultState.devices.byId.a1.updated_ts} />);
      const view = baseElement.firstChild;
      expect(view).toMatchSnapshot();
      expect(view).toEqual(expect.not.stringMatching(undefineds));
    });
  });
});

describe('DeviceConnection Component', () => {
  const userCapabilities = {
    canAuditlog: true,
    canTroubleshoot: true,
    canWriteDevices: true,
    groupsPermissions: { [ALL_DEVICES]: [uiPermissionsById.connect.value, uiPermissionsById.manage.value] }
  };
  it('renders correctly', async () => {
    const { baseElement } = render(
      <DeviceConnection device={defaultState.devices.byId.a1} userCapabilities={userCapabilities} tenantCapabilities={{ hasDeviceConnect: true }} />
    );
    const view = baseElement.firstChild;
    expect(view).toMatchSnapshot();
    expect(view).toEqual(expect.not.stringMatching(undefineds));
  });
  it('renders correctly when disconnected', async () => {
    const { baseElement } = render(
      <DeviceConnection
        device={{ ...defaultState.devices.byId.a1, connect_status: DEVICE_CONNECT_STATES.disconnected }}
        userCapabilities={userCapabilities}
        tenantCapabilities={{ hasDeviceConnect: true }}
      />
    );
    const view = baseElement.firstChild;
    expect(view).toMatchSnapshot();
    expect(view).toEqual(expect.not.stringMatching(undefineds));
  });
  it('renders correctly when connected', async () => {
    const { baseElement } = render(
      <DeviceConnection
        device={{ ...defaultState.devices.byId.a1, connect_status: DEVICE_CONNECT_STATES.connected }}
        hasAuditlogs
        userCapabilities={userCapabilities}
        tenantCapabilities={{ hasDeviceConnect: true }}
      />
    );
    const view = baseElement.firstChild;
    expect(view).toMatchSnapshot();
    expect(view).toEqual(expect.not.stringMatching(undefineds));
  });
});
