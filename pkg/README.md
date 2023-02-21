## Welcome friend!

If you like Rust and scheduling algorithms you've come to the right place :) We
can talk big-O, add features or optimize hot loops.

> Please contact me tijl.leenders@gmail.com or open an issue.

## Getting started
0. ```cd ~ && git clone https://github.com/tijlleenders/ZinZen-scheduler.git```  

1. [Install Rust](https://www.rust-lang.org/tools/install)

2. Add target for wasm:
```rustup target add wasm32-unknown-unknown```  
   ```cd ~/ZinZen-scheduler/ && cargo test``` should work now  

3. ```cargo install wasm-bindgen-cli``` or [Install wasm-bindgen command line interface](https://rustwasm.github.io/wasm-bindgen/reference/cli.html) with any dependencies if it fails (openssl, pkg-config) or 

4. ```sudo apt-get install wabt``` [... or DIY](https://github.com/WebAssembly/wabt)

5. ```sudo apt-get install binaryen```

6. [Install deno](https://deno.land/manual/getting_started/installation)

7. You can now run the test from javascript/deno land using ```deno test```  
  
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
