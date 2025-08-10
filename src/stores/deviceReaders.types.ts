import type { DeviceStatus } from "src/utils/enum";

export type DeviceRedersAPI = {
  id: string | number;
  readerId: string;
  label: string;
  status: string;
  locationId: number;
}

export type IReaderDevice = Omit<DeviceRedersAPI, 'status'> & {
  status: DeviceStatus;
};
