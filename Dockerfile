FROM node:14

# Set the npm registry to the public registry
RUN npm config set registry https://registry.npmjs.org/

# Install required packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        cmake \
        git \
        libusb-1.0-0-dev \
        librtlsdr-dev \
        pkg-config

# Clone and build rtl_433
RUN git clone https://github.com/merbanan/rtl_433.git && \
    cd rtl_433 && \
    mkdir build && \
    cd build && \
    cmake .. && \
    make && \
    make install

# Clean up
RUN apt-get remove -y build-essential cmake git pkg-config && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /rtl_433

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

CMD ["node", "rtl_433_to_mysql.js"]