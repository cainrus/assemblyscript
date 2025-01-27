import {
  process
} from "./process";

import {
  console as binding
} from "./bindings/dom";

// @ts-ignore: decorator
@lazy var timers = new Map<string,u64>();

export namespace console {

  export function assert<T>(condition: T, message: string = ""): void {
    if (isDefined(ASC_WASI)) {
      if (!condition) {
        let stderr = process.stderr;
        stderr.write("Assertion failed: ");
        stderr.write(message);
        stderr.write("\n");
      }
    } else {
      binding.assert(!!condition, message);
    }
  }

  export function log(message: string = ""): void {
    if (isDefined(ASC_WASI)) {
      let stdout = process.stdout;
      stdout.write(message);
      stdout.write("\n");
    } else {
      binding.log(message);
    }
  }

  export function debug(message: string = ""): void {
    if (isDefined(ASC_WASI)) {
      let stdout = process.stdout;
      stdout.write("Debug: ");
      stdout.write(message);
      stdout.write("\n");
    } else {
      binding.debug(message);
    }
  }

  export function info(message: string = ""): void {
    if (isDefined(ASC_WASI)) {
      let stdout = process.stdout;
      stdout.write("Info: ");
      stdout.write(message);
      stdout.write("\n");
    } else {
      binding.info(message);
    }
  }

  export function warn(message: string = ""): void {
    if (isDefined(ASC_WASI)) {
      let stdout = process.stdout;
      stdout.write("Warning: ");
      stdout.write(message);
      stdout.write("\n");
    } else {
      binding.warn(message);
    }
  }

  export function error(message: string = ""): void {
    if (isDefined(ASC_WASI)) {
      let stdout = process.stdout;
      stdout.write("Error: ");
      stdout.write(message);
      stdout.write("\n");
    } else {
      binding.error(message);
    }
  }

  export function time(label: string = "default"): void {
    if (isDefined(ASC_WASI)) {
      let stdout = process.stdout;
      if (timers.has(label)) {
        stdout.write("Warning: Label '");
        stdout.write(label);
        stdout.write("' already exists for console.time()\n");
        return;
      }
      timers.set(label, process.hrtime());
    } else {
      binding.time(label);
    }
  }

  export function timeLog(label: string = "default"): void {
    if (isDefined(ASC_WASI)) {
      let stdout = process.stdout;
      if (!timers.has(label)) {
        stdout.write("Warning: No such label '");
        stdout.write(label);
        stdout.write("' for console.timeLog()\n");
        return;
      }
      timeLogImpl(label);
    } else {
      binding.timeLog(label);
    }
  }

  export function timeEnd(label: string = "default"): void {
    if (isDefined(ASC_WASI)) {
      let stdout = process.stdout;
      if (!timers.has(label)) {
        stdout.write("Warning: No such label '");
        stdout.write(label);
        stdout.write("' for console.timeEnd()\n");
        return;
      }
      timeLogImpl(label);
      timers.delete(label);
    } else {
      binding.timeEnd(label);
    }
  }
}

function timeLogImpl(label: string): void {
  var start = changetype<u64>(timers.get(label));
  var end = process.hrtime();
  var nanos = end - start;
  var millis = nanos / 1000000;
  var millisStr = millis.toString();
  var stdout = process.stdout;
  stdout.write(label);
  stdout.write(": ");
  stdout.write(millisStr);
  stdout.write("ms\n");
}
