import React, {useEffect, useMemo, useRef, useState} from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity, useWindowDimensions,
  View,
} from "react-native";
import DeviceModal from "./DeviceConnectionModal";
import { PulseIndicator } from "./PulseIndicator";
import useBLE from "./useBLE";
import {
  Canvas,
  Path,
  Group,
  LinearGradient,
  vec, Line, Skia,
} from "@shopify/react-native-skia";
import { GestureDetector, ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { PADDING, COLORS, getGraph } from "./Model";
import { getYForX } from "./Math";
import { Cursor } from "./components/Cursor";
import { Selection } from "./components/Selection";
import { List } from "./components/List";
import { Header } from "./components/Header";
import { Label } from "./components/Label";
import { useGraphTouchHandler } from "./components/useGraphTouchHandler";
import {SkCanvas} from "@shopify/react-native-skia/src/skia/types/Canvas";
import {DrawingInfo} from "@shopify/react-native-skia/src/views/types";
const touchableCursorSize = 80;
import { SkSurface } from '@shopify/react-native-skia';
const App = (children?: JSX.Element|JSX.Element[]) => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
    disconnectFromDevice,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };
  const GRAPH_HEIGHT = 400
  const GRAPH_WIDTH = 370
  const graphData = {curve: null}
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <PulseIndicator />
            <Text style={styles.heartRateTitleText}>Your Heart Rate Is:</Text>
            <Text style={styles.heartRateText}>{heartRate} bpm</Text>
            {/*<LineChart*/}
            {/*    style={{ width: 300, height: 200 }}*/}
            {/*    data={heartRate}*/}
            {/*    svg={{ stroke: 'rgb(134, 65, 244)' }}*/}
            {/*    contentInset={{ top: 20, bottom: 20 }}*/}
            {/*>*/}
            {/*  /!* Render your line chart *!/*/}
            {/*</LineChart>*/}
            <Text>Real-time Heart Rate Monitor</Text>
            {/*<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>*/}
            {/*  <Text>Real-time Heart Rate Monitor</Text>*/}
            {/*  <View style={{ width: 300, height: 200 }}>*/}
            {/*    <Canvas*/}
            {/*        ref={canvasRef}*/}
            {/*        style={{ width: 300, height: 200 }}*/}
            {/*        onDraw={drawCanvas}*/}
            {/*    />*/}
            {/*  </View>*/}
            {/*</View>*/}
            <Canvas
                style={{
                  width: GRAPH_WIDTH,
                  height: GRAPH_HEIGHT,
                }}
            >
              <Line
                  p1={vec(10, 130)}
                  p2={vec(400, 130)}
                  color="lightgrey"
                  style="stroke"
                  strokeWidth={1}
              />
              <Line
                  p1={vec(10, 250)}
                  p2={vec(400, 250)}
                  color="lightgrey"
                  style="stroke"
                  strokeWidth={1}
              />
              <Line
                  p1={vec(10, 370)}
                  p2={vec(400, 370)}
                  color="lightgrey"
                  style="stroke"
                  strokeWidth={1}
              />
              {/*<Path*/}
              {/*    style="stroke"*/}
              {/*    path={graphData.curve}*/}
              {/*    strokeWidth={4}*/}
              {/*    color="#6231ff"*/}
              {/*/>*/}
            </Canvas>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please Connect to a Heart Rate Monitor
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          {connectedDevice ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default App;
