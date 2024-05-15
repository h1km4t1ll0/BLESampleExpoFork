#!/bin/sh

mkdir -p \
  .build/expo/build \
  .build/expo/output \
  .build/node/cache \
  .build/node/npm \
  .build/yarn/berry/cache \
  .yarn/berry/cache \
  .build/gradle

docker run -ti --rm \
  -w /opt/sayok/expo/android \
  -v $(pwd):/opt/sayok/expo \
  -v /home/hikmatillo/WebstormProjects/BLESampleExpo/node_modules/@shopify/react-native-skia/android/cpp/jsi/:/opt/sayok/expo/node_modules/@shopify/react-native-skia/android/cpp/jsi/ \
  -v /home/hikmatillo/WebstormProjects/BLESampleExpo/node_modules/@shopify/react-native-skia/android/cpp/jni/:/opt/sayok/expo/node_modules/@shopify/react-native-skia/android/cpp/jni/ \
  -v /home/hikmatillo/WebstormProjects/BLESampleExpo/node_modules/@shopify/react-native-skia/android/cpp/utils/:/opt/sayok/expo/node_modules/@shopify/react-native-skia/android/cpp/utils/ \
  -v /home/hikmatillo/WebstormProjects/BLESampleExpo/node_modules/@shopify/react-native-skia/android/cpp/skia/:/opt/sayok/expo/node_modules/@shopify/react-native-skia/android/cpp/skia/ \
  -v /home/hikmatillo/WebstormProjects/BLESampleExpo/node_modules/@shopify/react-native-skia/android/cpp/rnskia/:/opt/sayok/expo/node_modules/@shopify/react-native-skia/android/cpp/rnskia/ \
  -v /home/hikmatillo/WebstormProjects/BLESampleExpo/node_modules/@shopify/react-native-skia/android/cpp/:/opt/sayok/expo/node_modules/@shopify/react-native-skia/android/cpp/ \
  -v /home/hikmatillo/WebstormProjects/BLESampleExpo/node_modules/@shopify/react-native-skia/android/cpp/api/:/opt/sayok/expo/node_modules/@shopify/react-native-skia/android/cpp/api/ \
  -v /home/hikmatillo/WebstormProjects/BLESampleExpo/node_modules/@shopify/react-native-skia/android/cpp/skia/include/core/:/opt/sayok/expo/node_modules/@shopify/react-native-skia/android/cpp/skia/include/core/ \
  -v /home/hikmatillo/WebstormProjects/BLESampleExpo/node_modules/@shopify/react-native-skia/android/cpp/skia/include/:/opt/sayok/expo/node_modules/@shopify/react-native-skia/android/cpp/skia/include/ \
  -e EAS_LOCAL_BUILD_SKIP_CLEANUP=1 \
  -e EAS_LOCAL_BUILD_WORKINGDIR=/home/node/.expo/build \
  -e EAS_LOCAL_BUILD_ARTIFACTS_DIR=/home/node/.expo/output \
  -v $(pwd)/.build/node/cache:/home/node/.cache \
  -v $(pwd)/.build/yarn:/home/node/.yarn \
  -v $(pwd)/.build/node/npm:/home/node/.npm \
  -v $(pwd)/.build/expo:/home/node/.expo \
  -v $(pwd)/.build/gradle:/home/node/.gradle \
  -v /home/hikmatillo/Android/Sdk:/home/hikmatillo/Android/Sdk \
  --network host \
  crazychenz/eas $@
