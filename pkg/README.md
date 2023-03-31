## Welcome friend!

If you like Rust and scheduling algorithms you've come to the right place :) We
can talk big-O, add features or optimize hot loops.

> Please contact me tijl.leenders@gmail.com or open an issue.

## Getting started
1. Clone repo
   ```shell
   # Go to Home Directory
   cd ~ 

   # You can clone into home directory or different directory
   git clone https://github.com/tijlleenders/ZinZen-scheduler.git
   ```  

2. [Install Rust](https://www.rust-lang.org/tools/install)

3. Add target for wasm:

   ```shell
   rustup target add wasm32-unknown-unknown  

   # Go to project directory
   cd ~/ZinZen-scheduler/
   ```

4. Install WASM dependencies 
   ```shell
   cargo install wasm-bindgen-cli 
   ```
   - Or [Install wasm-bindgen command line interface](https://rustwasm.github.io/wasm-bindgen/reference/cli.html) with any dependencies
   - If it fails (openssl, pkg-config) or
   ```shell
   sudo apt-get install wabt binaryen
   # [... or DIY](https://github.com/WebAssembly/wabt)
   ```
   
5. [Install deno](https://deno.land/manual/getting_started/installation)

6. You can now run the test from javascript/deno or from `cargo` as below:
   ```shell
   # Run tests by deno 
   ./deno_test.sh

   # Run tests by cargo
   cargo test
   ```

## Legal stuff

&copy;2020-now ZinZen&reg;

This code is licensed under AGPLv3 but this license does not implicitly grant
permission to use the trade names, trademarks, service marks, or product names
of the licensor, except as required for reasonable and customary use in
describing the origin of the Work and the content of the notice/attribution
file.

ZinZen&reg; supports an open and collaborative process. Registering the
ZinZen&reg; trademark is a tool to protect the ZinZen&reg; identity and the
quality perception of the ZinZen&reg; projects.
