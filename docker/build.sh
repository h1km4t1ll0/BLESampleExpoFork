#!/bin/sh

CLITOOLS_SDK_FNAME=commandlinetools-linux-8512546_latest.zip
ANDROID_HOME=/opt/android

ANDROID_BUILD_VERSION=31
ANDROID_TOOLS_VERSION=30.0.3
NDK_VERSION=21.4.7075529
CMAKE_VERSION=3.18.1
ADB_INSTALL_TIMEOUT=10

# Fetch the Android sdkmanager for all android ndk installs.
# Full reference at https://dl.google.com/android/repository/repository2-1.xml
[ ! -d "context" ] && mkdir -p context
[ ! -f "context/${CLITOOLS_SDK_FNAME}" ] && \
  wget -P context https://dl.google.com/android/repository/${CLITOOLS_SDK_FNAME}

cat ./Dockerfile | docker build \
  --build-arg arg_CLITOOLS_SDK_FNAME="${CLITOOLS_SDK_FNAME}" \
  --build-arg arg_ANDROID_HOME="${ANDROID_HOME}" \
  --build-arg ANDROID_BUILD_VERSION="${ANDROID_BUILD_VERSION}" \
  --build-arg ANDROID_TOOLS_VERSION="${ANDROID_TOOLS_VERSION}" \
  --build-arg NDK_VERSION="${NDK_VERSION}" \
  --build-arg CMAKE_VERSION="${CMAKE_VERSION}" \
  --build-arg ADB_INSTALL_TIMEOUT="${ADB_INSTALL_TIMEOUT}" \
  -t crazychenz/eas -f - \
  context
