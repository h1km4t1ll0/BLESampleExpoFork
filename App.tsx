import React, {useMemo, useState} from "react";
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
  vec,
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
const touchableCursorSize = 80;
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

  const window = useWindowDimensions();
  const { width } = window;
  const height = Math.min(window.width, window.height) / 2;
  const translateY = height + PADDING;
  const graphs = useMemo(() => getGraph(width, height), [width, height]);
  // animation value to transition from one graph to the next
  const transition = useSharedValue(0);
  // indicices of the current and next graphs
  const state = useSharedValue({
    next: 0,
    current: 0,
  });
  // path to display
  const path = useDerivedValue(() => {
    const { current, next } = state.value;
    const start = graphs[current].data.path;
    const end = graphs[next].data.path;
    return end.interpolate(start, transition.value)!;
  });
  // x and y values of the cursor
  const x = useSharedValue(0);
  const y = useDerivedValue(() => getYForX(path.value.toCmds(), x.value));
  const gesture = useGraphTouchHandler(x, width);
  const style = useAnimatedStyle(() => {
    return {
      position: "absolute",
      width: touchableCursorSize,
      height: touchableCursorSize,
      left: x.value - touchableCursorSize / 2,
      top: translateY + y.value - touchableCursorSize / 2,
    };
  });


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <PulseIndicator />
            <Text style={styles.heartRateTitleText}>Your Heart Rate Is:</Text>
            <Text style={styles.heartRateText}>{heartRate} bpm</Text>
            <Canvas style={{ width, height: 2 * height + 30 }}>
              <Label
                  state={state}
                  y={y}
                  graphs={graphs}
                  width={width}
                  height={height}
              />
              <Group transform={[{ translateY }]}>
                <Path
                    style="stroke"
                    path={path}
                    strokeWidth={4}
                    strokeJoin="round"
                    strokeCap="round"
                >
                  <LinearGradient
                      start={vec(0, 0)}
                      end={vec(width, 0)}
                      colors={COLORS}
                  />
                </Path>
                <Cursor x={x} y={y} width={width} />
              </Group>
            </Canvas>
            <GestureDetector gesture={gesture}>
              <Animated.View style={style} />
            </GestureDetector>
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
