/* eslint-disable no-bitwise */
import {MutableRefObject, useCallback, useMemo, useRef, useState} from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";
import { Buffer } from "buffer";

const HEART_RATE_UUID = "0000ffb1-0000-1000-8000-00805f9b34fb";
const HEART_RATE_CHARACTERISTIC = "0000ffb2-0000-1000-8000-00805f9b34fb";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  heartRate: MutableRefObject<number[]>;
  setHeartRate: (val: number[]) => void;
  // heartRate: {value: number, date: number}[];
  startTime: number
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  // const [heartRate, setHeartRate] = useState<{value: number, date: number}[]>([]);
  const [heartRatef, setHeartRate] = useState<number[]>([1.5]);
  const heartRate = useRef<number[]>([1.3])
  const [startTime, setStartTime] = useState<number>(0)

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setHeartRate([0]);
    }
  };
  let time = 0;
  const onHeartRateUpdate = useCallback((
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    console.log(heartRate, 'heartRate2')
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }

    const rawData = base64.decode(characteristic.value);
    const byteArray = Buffer.alloc(20, characteristic.value ,'base64');
    const integerArray: number[] = [];
    // const integerArray: {value: number, date: number}[] = [];
    for (let i = 0; i < 20; i+=2) {
      const value = byteArray.readUInt16BE(i);
      if (value >= -3600 && value <= 3600) {
        integerArray.push(value / 840);
        // integerArray.push({value: value / 840, date: time + (i * 5)});
      }
    }
    // console.log(heartRate);
    // time += 100;
    if (integerArray.length > 0) {

      // setHeartRate((state) => {
      //   state.concat(integerArray);
      //   return state;
      // });
      // setHeartRate(integerArray);
      heartRate.current = [...heartRate.current, ...integerArray]
      // setHeartRate(heartRate.concat(integerArray));
    }
    }, [startTime]);

  const startStreamingData = async (device: Device) => {
    if (device) {
      console.log(device)
      setStartTime(0);
      device.monitorCharacteristicForService(
        HEART_RATE_UUID,
        HEART_RATE_CHARACTERISTIC,
        onHeartRateUpdate
      );
    } else {
      console.log("No Device Connected");
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    heartRate,
    setHeartRate,
    startTime
  };
}

export default useBLE;
