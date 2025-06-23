FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \ 
    && apt-get install -y  g++\ 
    gcc \
    make \
    build-essential \
    git \
    curl \ 
    unzip \
    zip \
    ninja-build \
    tar python3 \
    python3-pip \
    autoconf \ 
    automake \ 
    autoconf-archive \ 
    openssl \
    expat \
    libtool \
    libbz2-dev \
    linux-libc-dev \
    ccache \
    nodejs \
    npm \
    pkg-config \
    && rm -rf /var/lib/apt/lists/* 


RUN apt-get upgrade
RUN pip install cmake --upgrade --break-system-packages

WORKDIR /home/node/app
COPY . .

RUN npm install 


WORKDIR /
RUN git clone https://github.com/Microsoft/vcpkg.git

WORKDIR /vcpkg
RUN git checkout 2024.01.12
ENV VCPKG_FORCE_SYSTEM_BINARIES=1
RUN echo %VCPKG_FORCE_SYSTEM_BINARIES%
RUN ./bootstrap-vcpkg.sh

WORKDIR /home/node/app
RUN /vcpkg/vcpkg install 2>&1
RUN cmake -B build -S . "-DCMAKE_TOOLCHAIN_FILE=/vcpkg/scripts/buildsystems/vcpkg.cmake"
RUN cmake --build build
EXPOSE 8000 8443


CMD [ "npm", "run", "start:dev"]

