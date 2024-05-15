FROM node:16-buster-slim

# Setup for unattended install
ARG DEBIAN_FRONTEND=noninteractive
ENV DEBCONF_NONINTERACTIVE_SEEN=true
RUN { echo 'tzdata tzdata/Areas select Etc'; echo 'tzdata tzdata/Zones/Etc select UTC'; } | debconf-set-selections

RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get -y install tzdata
RUN apt-get install -y apt-utils
RUN apt-get install -y git bash rsync openjdk-11-jre openjdk-11-jdk unzip

# Set default node ennvironment variables
ENV NODE_ENV development

# set default android environment variables
ARG arg_CLITOOLS_SDK_FNAME=commandlinetools-linux-8512546_latest.zip
ENV CLITOOLS_SDK_FNAME=${arg_CLITOOLS_SDK_FNAME}
ARG arg_ANDROID_HOME=/opt/android
ENV ANDROID_HOME=${arg_ANDROID_HOME}
ENV ANDROID_SDK_HOME=${ANDROID_HOME}
ENV ANDROID_PREFS_ROOT=${ANDROID_HOME}

ARG ANDROID_BUILD_VERSION=32
ARG ANDROID_TOOLS_VERSION=32.0.0
ARG NDK_VERSION=24.0.8215888
ARG CMAKE_VERSION=3.18.1
ARG ADB_INSTALL_TIMEOUT=10

ENV ANDROID_NDK=${ANDROID_HOME}/ndk/$NDK_VERSION
ENV ANDROID_NDK_HOME=${ANDROID_NDK}

# Build path
ENV PREV_PATH=${PATH}
ENV PATH=${ANDROID_NDK}:${ANDROID_HOME}/cmdline-tools/bin
ENV PATH=${PATH}:${ANDROID_HOME}/emulator:${ANDROID_HOME}/platform-tools
ENV PATH=${PATH}:${ANDROID_HOME}/tools:${ANDROID_HOME}/tools/bin
ENV PATH=${PATH}:${PREV_PATH}

ARG uid=1000
ARG gid=1000

# Setup android home in opt and owned by user.
RUN mkdir -p ${ANDROID_HOME} && chown $uid:$gid ${ANDROID_HOME}
RUN chown -R $uid:$gid ${ANDROID_HOME}

# This is our default expo project folder mount point
WORKDIR /opt/sayok/expo

RUN npm install -g pnpm
RUN chown $uid:$gid /opt/sayok/expo
COPY --chown=$uid:$gid ${CLITOOLS_SDK_FNAME} /tmp/
RUN unzip -q -d ${ANDROID_HOME} /tmp/${CLITOOLS_SDK_FNAME} \
  && rm -f /tmp/${CLITOOLS_SDK_FNAME}
RUN yes | sdkmanager --licenses --sdk_root=${ANDROID_HOME}
RUN yes | sdkmanager --sdk_root=${ANDROID_HOME} \
  "platform-tools" \
  "platforms;android-$ANDROID_BUILD_VERSION" \
  "build-tools;$ANDROID_TOOLS_VERSION" \
  "cmake;$CMAKE_VERSION" \
  "ndk;$NDK_VERSION"

USER $uid:$gid

# Set yarn defaults.
RUN yarn set version berry ; \
    sed -i '/^nodeLinker:/d' .yarnrc.yml ; \
    echo "nodeLinker: node-modules" >> .yarnrc.yml ; \
    yarn
