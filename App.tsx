import "react-native-gesture-handler";
import {runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue} from "react-native-reanimated";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    SafeAreaView, StatusBar,
    StyleSheet,
    Text as RNText,
    TouchableOpacity, useWindowDimensions,
    View,
} from "react-native";
import DeviceModal from "./DeviceConnectionModal";
import {PulseIndicator} from "./PulseIndicator";
import useBLE from "./useBLE";
import {
  Canvas,
  Path,
  Group,
  LinearGradient,
  vec, Line, Skia, SkPath, Text, rect
} from "@shopify/react-native-skia";

// export type DataPoint = {
//     date: number;
//     value: number;
// };

import {curveBasis, line, ScaleLinear, scaleLinear, ScaleTime, scaleTime} from 'd3';


const App = (children?: JSX.Element | JSX.Element[]) => {
    const {
        requestPermissions,
        scanForPeripherals,
        allDevices,
        connectToDevice,
        connectedDevice,
        heartRate,
        setHeartRate,
        disconnectFromDevice,
        startTime
    } = useBLE();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    // const [myHR, setMyHR] = useState<number[]>([0])
    const myHR = useRef<number[]>([0])
    // const [myHR, setMyHR] = useState<{ date: number, value: number }[]>([])
    const [graphData, setGraphData] = useState<{ max: number, min: number, curve: SkPath }>()
    const [g, setG] = useState<{date: number, value: number}[]>([]);
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

    // const  makeGraph = useCallback((data: DataPoint[]) => {
    //     const max = Math.max(...myHR.map(val => val.value));
    //     const maxX = Math.max(...myHR.map(val => val.date));
    //     const min = Math.min(...myHR.map(val => val.value));
    //     const minX = Math.min(...myHR.map(val => val.date));
    //     const y = scaleLinear().domain([min, max]).range([GRAPH_HEIGHT, 35]);
    //     const x = scaleLinear().domain([minX, maxX]).range([10, GRAPH_WIDTH - 10]);
    //     const curvedLine = line<DataPoint>()
    //         .x(d => x(d.date))
    //         .y(d => y(d.value))
    //         .curve(curveBasis)(data);
    //     if (!curvedLine) {
    //         console.log("DAMMIT BLYAT")
    //         return
    //     }
    //     const skPath = Skia.Path.MakeFromSVGString(curvedLine!);
    //     console.log('FWRO(IHJ*(OIUHWEFPIOUWEHFPOIUWEFHPOIEWFH')
    //     return {
    //         max,
    //         min,
    //         curve: skPath!,
    //     }
    // }, [])

    // useEffect(() => {
        // setMyHR([...myHR, heartRate])
        // myHR.current = [...myHR.current, heartRate]
        // console.log(heartRate)
        // if (myHR.length > 2000) {
        //     setMyHR(myHR.slice(2000, myHR.length))
        // } else {
        //     setMyHR([...myHR, ...heartRate])
        // }
        // const sumDate = heartRate.reduce((a, b) => a + b.date, 0);
        // const sumValue = heartRate.reduce((a, b) => a + b.value, 0);
        // const len = heartRate.length;
        // setMyHR((state) => {
        //     if (myHR.length >= 100) {
        //         state.shift();
        //     }
        //     console.log(state)
        //     state.push({ date: sumDate /len, value: sumValue / len});
        //     return state;
        //
        //     setG([...g, ...heartRate]);
        // });
    // }, [heartRate]);

      // useEffect(() => {
      //     const interval = setInterval(() => {
      //         setMyHR((state) => {
      //             state.shift();
      //             const sumDate = g.reduce((a, b) => a + b.date, 0);
      //             const sumValue = g.reduce((a, b) => a + b.value, 0);
      //             state.push({date: sumDate / g.length, value: sumValue / g.length})
      //             setG([]);
      //             return state;
      //         });
      //     }, 1000);
      //     return () => clearInterval(interval);
      // }, []);

    // useEffect(() => {
    //     if (myHR.length >= 2000) {
    //         const newData = makeGraph(myHR)
    //         setGraphData(newData)
    //         console.log('new chunk', myHR.length)
    //     }
    // }, [myHR]);



    // const generateChart = (
    //     data: DataPoint[]
    // ): { curve: SkPath; x: ScaleTime<number, number>; y: ScaleLinear<number, number>;}  | null => {
    //     if (data.length === 0) {
    //         return null;
    //     }
    //     const max = Math.max(...data.map(val => val.value));
    //     const maxX = Math.max(...data.map(val => val.date));
    //     const min = Math.min(...data.map(val => val.value));
    //     const minX = Math.min(...data.map(val => val.date));
    //     const x = scaleTime().range([0, width]);
    //     // const x = scaleLinear().range([0, width]);
    //     const y = scaleLinear()
    //         .range([height - 20, 20])
    //         .domain([-4, 4]);
    //     x.domain([
    //         new Date(new Date().getTime() - 1000 * (40 - 2)),
    //                   new Date(new Date().getTime() - 1000 * 2)
    //     ]);
    //     console.log(...data.map(val => val.value), maxX)
    //     console.log(Math.min(...data.map(val => val.value), maxX))
    //     console.log(Math.max(...data.map(val => val.value), maxX))
    //     const l = line<DataPoint>()
    //         .x((d) => x(d.date))
    //         .y((d) => y(d.value))
    //         .curve(curveBasis);
    //     const path = l(data)!;
    //     console.log(path)
    //     console.log("s;eihrgfliosehrfliohserf")
    //     return { curve: Skia.Path.MakeFromSVGString(path)!, x, y };
    // };
    // const {curve, x, y} = generateChart(    [ {"date": 1, "value": 1}, {"date": 128200, "value": 0}, {"date": 128350, "value": -2.742857142857143}, {"date": 1, "value": 1}, {"date": 128580, "value": 1.2845238095238094}, {"date": 128670, "value": 3.1488095238095237}, {"date": 1, "value": 1}, {"date": 1, "value": 1}, {"date": 1, "value": 1}, {"date": 1, "value": 1}, {"date": 1, "value": 1}, {"date": 1, "value": 1}, {"date": 1, "value": 1}, {"date": 1, "value": 1}, {"date": 129590, "value": 0.125}, {"date": 129660, "value": 0.11865079365079363}, {"date": 129760, "value": 0.11706349206349205}, {"date": 129845, "value": 0.08779761904761904}, {"date": 129960, "value": 0.11666666666666665}, {"date": 130060, "value": 0.11587301587301586}, {"date": 130160, "value": 0.11666666666666665}, {"date": 130260, "value": 0.11666666666666665}, {"date": 130360, "value": 0.11666666666666665}, {"date": 130460, "value": 0.11626984126984126}, {"date": 130560, "value": 0.11587301587301586}, {"date": 130645, "value": 0.08660714285714285}, {"date": 130760, "value": 0.11666666666666665}, {"date": 130860, "value": 0.11666666666666665}, {"date": 130960, "value": 0.11666666666666665}, {"date": 131060, "value": 0.11626984126984126}, {"date": 131160, "value": 0.11626984126984126}, {"date": 131260, "value": 0.11626984126984126}, {"date": 131360, "value": 0.11666666666666665}, {"date": 131445, "value": 0.08720238095238095}, {"date": 131560, "value": 0.11547619047619047}, {"date": 131660, "value": 0.11587301587301586}, {"date": 131760, "value": 0.11587301587301586}, {"date": 131860, "value": 0.11587301587301586}, {"date": 131960, "value": 0.11666666666666665}, {"date": 132060, "value": 0.11587301587301586}]
    // )
    // const [path, setPath] = useState<string>(curve.toSVGString);
    // const yScale= useRef<ScaleLinear<number, number>>(y);
    // useEffect(() => {
    //     console.log(new Date().getTime())
    //     const interval = setInterval(() => {
    //         // const res = generateChart(g);
    //         // if (res !== null) {
    //         //     const {curve, x, y} = res;
    //         //     const kk = curve.toSVGString();
    //         //     setPath(kk);
    //         //     yScale.current = y;
    //         //     // console.log(y)
    //         // }
    //     }, 1000 / 60);
    //
    //     return () => clearInterval(interval);
    //
    // }, []);
    // type DataPoint = {
    //     date: number;
    //     value: number;
    // };


    const [width, height] = [300, 400];
    const [timeSlots, fps] = [160, 60];
    type DataPoint = {
        date: Date;
        value: number;
    };
    const randomInt = (min: number = 0, max: number = 100): number => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    const generateRandomDateValues = (n: number = 10, min = 0, max = 100, fromDate: Date = new Date()): DataPoint[] => {
        return Array.from(Array(n).keys()).map((_, i) => ({
            date: new Date(fromDate.getTime() - n * 1000 + 1000 * i),
            value: randomInt(1, 3)
        }));
    };
    const generateChart = (
        data: DataPoint[]
    ): {
        curve: SkPath;
        x: ScaleTime<number, number, never>;
        y: ScaleLinear<number, number, never>;
    } => {
        const x = scaleTime().range([0, width]);
        const y = scaleLinear()
            .range([height - 20, 20])
            .domain([-4, 4]);
        x.domain([
            new Date(new Date().getTime() - 250 * (timeSlots - 2)),
            new Date(new Date().getTime() - 250 * 2)
        ]);
        const l = line<DataPoint>()
            .x((d) => x(d.date))
            .y((d) => y(d.value))
            .curve(curveBasis);
        const path = l(data)!;
        return { curve: Skia.Path.MakeFromSVGString(path)!, x, y };
    };
  const [data, setData] = useState<DataPoint[]>(
      generateRandomDateValues(timeSlots)
  );
  const { curve, y } = generateChart(data);
  const [path, setPath] = useState<string>(curve.toSVGString());
  const yScale= useRef<ScaleLinear<number, number>>(y);

    useEffect(() => {
        const interval = setInterval(() => {
            setData((state) => {
                state.shift();
                // state.push({ date: new Date(),
                    // value: Math.max(...heartRate.current)});
                if (heartRate.current.length == 0) {
                    state.push({
                        date: new Date(),
                        value: 0
                        }
                    )
                }
                else {
                    state.push({
                        date: new Date(),
                        // value: Math.min(...heartRate.current)});
                        value: Math.sqrt(heartRate.current.map(item => item * item).reduce(
                            (acc, item) => {
                                acc += item;
                                return acc;
                            }) / heartRate.current.length)
                        // value: heartRate.current.reduce((partialSum, a) => partialSum + a, 0) / heartRate.current.length
                    });
                    // myHR.current = [];
                    heartRate.current = []
                }
                // setMyHR([]);
                // state.push({ date: new Date(), value: randomInt() });
                return state;
            });
        }, 250);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            const { curve, x, y } = generateChart(data);
            const kk = curve.toSVGString();
            setPath(kk);
            yScale.current = y;
        }, 250 / fps);

        return () => clearInterval(interval);
    }, []);

return (
        <SafeAreaView style={styles.container}>
            <View style={styles.heartRateTitleWrapper}>
                {connectedDevice ? (
                    <>
                        <PulseIndicator/>
                        <RNText style={styles.heartRateTitleText}>Your Heart Rate Is:</RNText>
                        <View style={styles.graph}>
                            <Canvas style={{ width, height }}>
                                <Group>
                                    {yScale.current && yScale.current.ticks(6).map((label: number, i: number) => {
                                        if (!yScale.current) {
                                            return
                                        }
                                        // console.log('0000')
                                        const yPoint = yScale.current(label);
                                        return (
                                            <Group key={label + i.toString()}>
                                                <Path
                                                    color="#ffffff"
                                                    style="stroke"
                                                    strokeWidth={2}
                                                    path={`M30,${yPoint} L${width},${yPoint}`}
                                                />
                                                <Text
                                                    text={label.toString()}
                                                    x={0}
                                                    y={yPoint + 5}
                                                    color="#474747"
                                                    font={null}
                                                />
                                            </Group>
                                        );
                                    })}
                                </Group>

                                {path && (
                                    <Group clip={rect(30, 0, width, height)}>
                                        <Path style="stroke" strokeWidth={2} color="#fff" path={path} />
                                    </Group>)
                                }
                            </Canvas>

                        </View>
                    </>
                ) : (
                    <RNText style={styles.heartRateTitleText}>
                        Please Connect to a Heart Rate Monitor
                    </RNText>
                )}
            </View>
            <TouchableOpacity
                onPress={connectedDevice ? disconnectFromDevice : openModal}
                style={styles.ctaButton}
            >
                <RNText style={styles.ctaButtonText}>
                    {connectedDevice ? "Disconnect" : "Connect"}
                </RNText>
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

// const styles = StyleSheet.create({

// });

const styles = StyleSheet.create({
        graph: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center'
    },
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
