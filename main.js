import * as fs from "node:fs";

import { FMT_I, FMT_J, FMT_R, FMT_S, FMT_U } from "./src/instruction-format.js";

import { InstructionSet } from "./src/instruction-set.js";
import { RegistryWorldSet } from "./src/registry-world-set.js";

let line = 0;
let instruction_counter = 0;

const argv = process.argv.slice(2);

let output = "v2.0 raw\n";

let tags = {};

function binPad(num, bits) {
  num = parseInt(`${num}`);

  if (isNaN(num))
    throw new Error(`Compilation failed, syntax error line: ${line}`);
  if (num >= 2 ** bits || num < -(2 ** (bits - 1)))
    throw new Error(
      `Stack overflow ${num} represented in ${bits} bits. Line: ${line}`
    );

  const bin =
    num >= 0
      ? num.toString(2).padStart(bits, "0")
      : (2 ** bits + num).toString(2);
  return bin;
}

try {
  let src = fs.readFileSync(argv[0], "utf8").split("\n");
  src = src.map((line) => line.replace(/#.*$/g, "").trim());
  src = src.filter((line) => line !== "");
  instruction_counter = 0;
  src = src.map((line) => {
    const isTag = line.match(/^(\w)*:$/g) !== null;
    if (isTag) {
      const tag = line.slice(0, -1);
      tags[tag] = instruction_counter * 4;
      return "";
    } else {
      instruction_counter++;
      return line;
    }
  });
  src = src.filter((line) => line !== "");
  src = src.map((line) => {
    Object.keys(tags).forEach((tag) => {
      line = line.replace(new RegExp("\\b" + tag + "\\b", "g"), tags[tag] - (instruction_counter * 4));
    });
    return line;
  });

  instruction_counter = 0;
  src.forEach((instruction) => {
    line++;
    let instruction_fragments = instruction.replaceAll(",", "").split(" ");

    if (instruction_fragments.join("") === "") return;

    const isLabel =
      instruction_fragments.join("").match(/^([A-z]|\d)*:$/g) !== null;

    if (isLabel) {
      const label = instruction_fragments[0].slice(0, -1);
      RegistryWorldSet.__label(label, instruction_counter);
      return;
    }

    const INSTRUCTION_TO_BUILD = InstructionSet.find(
      (instruction) => instruction.inst == instruction_fragments[0]
    );

    let build = "";
    switch (INSTRUCTION_TO_BUILD.fmt) {
      case "R":
        (() => {
          const rdn = RegistryWorldSet.__match(instruction_fragments[1]);
          const rs1n = RegistryWorldSet.__match(instruction_fragments[2]);
          const rs2n = RegistryWorldSet.__match(instruction_fragments[3]);

          const rd = binPad(rdn, 5);
          const rs1 = binPad(rs1n, 5);
          const rs2 = binPad(rs2n, 5);

          const format = `${FMT_R}`;
          const opcode = binPad(INSTRUCTION_TO_BUILD.opcode, 7);
          const funct3 = binPad(INSTRUCTION_TO_BUILD.funct3, 3);
          const funct7 = binPad(INSTRUCTION_TO_BUILD.funct7, 7);

          build = format.replace("[opcode]", opcode);
          build = build.replace("[rd]", rd);
          build = build.replace("[funct3]", funct3);
          build = build.replace("[rs1]", rs1);
          build = build.replace("[rs2]", rs2);
          build = build.replace("[funct7]", funct7);
        })();
        break;
      case "I":
        (() => {
          const rdn = RegistryWorldSet.__match(instruction_fragments[1]);
          const rs1n = RegistryWorldSet.__match(instruction_fragments[2]);
          const immn = parseInt(`${eval(instruction_fragments[3])}`);

          const format = `${FMT_I}`;
          const opcode = binPad(INSTRUCTION_TO_BUILD.opcode, 7);
          const rd = binPad(rdn, 5);
          const funct3 = binPad(INSTRUCTION_TO_BUILD.funct3, 3);
          const rs1 = binPad(rs1n, 5);
          const imm = binPad(immn, 12);

          build = format.replace("[opcode]", opcode);
          build = build.replace("[rd]", rd);
          build = build.replace("[funct3]", funct3);
          build = build.replace("[rs1]", rs1);
          build = build.replace("[imm(11:0)]", imm);
        })();
        break;

      case "L":
        (() => {
          const match = instruction_fragments[2].match(/(-?(?:0x[0-9A-Fa-f]+|0b[01]+|\d+))\(([a-zA-Z]\w*)\)/);
          if (!match)
            throw new Error(`Malformed load instruction at line ${line}`);

          const rdn = RegistryWorldSet.__match(instruction_fragments[1]);
          const rs1n = RegistryWorldSet.__match(match[2]);
          const immn = parseInt(`${eval(match[1])}`);

          const format = `${FMT_I}`;
          const opcode = binPad(INSTRUCTION_TO_BUILD.opcode, 7);
          const rd = binPad(rdn, 5);
          const funct3 = binPad(INSTRUCTION_TO_BUILD.funct3, 3);
          const rs1 = binPad(rs1n, 5);
          const imm = binPad(immn, 12);

          build = format.replace("[opcode]", opcode);
          build = build.replace("[rd]", rd);
          build = build.replace("[funct3]", funct3);
          build = build.replace("[rs1]", rs1);
          build = build.replace("[imm(11:0)]", imm);
        })();
        break;
      case "E":
        (() => {
          let immn = instruction_fragments[0].toLowerCase() === "ebreak" ? 1 : 0;

          const imm = binPad(immn, 12);
          const rs1 = binPad(0, 5);
          const rd = binPad(0, 5);
          const funct3 = binPad(0, 3);
          const opcode = binPad(INSTRUCTION_TO_BUILD.opcode, 7);

          build = FMT_I.replace("[imm(11:0)]", imm);
          build = build.replace("[rs1]", rs1);
          build = build.replace("[funct3]", funct3);
          build = build.replace("[rd]", rd);
          build = build.replace("[opcode]", opcode);
        })();
        break;
      case "S":
        (() => {
          const match = instruction_fragments[2].match(/(-?(?:0x[0-9A-Fa-f]+|0b[01]+|\d+))\(([a-zA-Z]\w*)\)/);

          const rs2n = RegistryWorldSet.__match(instruction_fragments[1]);
          const rs1n = RegistryWorldSet.__match(match[2]);
          const immn = parseInt(`${eval(match[1])}`);

          const imm_bin = binPad(immn, 12);
          const imm_11_5 = imm_bin.slice(0, 7); // Bits 11:5
          const imm_4_0 = imm_bin.slice(7); // Bits 4:0

          const opcode = binPad(INSTRUCTION_TO_BUILD.opcode, 7);
          const funct3 = binPad(INSTRUCTION_TO_BUILD.funct3, 3);
          const rs1 = binPad(rs1n, 5);
          const rs2 = binPad(rs2n, 5);

          build = FMT_S.replace("[imm(11:5)]", imm_11_5);
          build = build.replace("[rs2]", rs2);
          build = build.replace("[rs1]", rs1);
          build = build.replace("[funct3]", funct3);
          build = build.replace("[imm(4:0)]", imm_4_0);
          build = build.replace("[opcode]", opcode);
        })();
        break;
      case "B":
        (() => {
          const rs1n = RegistryWorldSet.__match(instruction_fragments[1]);
          const rs2n = RegistryWorldSet.__match(instruction_fragments[2]);
          const immn = parseInt(`${eval(instruction_fragments[3])}`);
          if (immn % 2 !== 0)
            throw new Error(
              `Branch offset must be divisible by 2, line: ${line}`
            );

          const imm_field = immn >> 1;
          const imm_bin = binPad(imm_field, 12);

          const imm_12 = imm_bin.slice(0, 1);
          const imm_10_5 = imm_bin.slice(1, 7);
          const imm_4_1 = imm_bin.slice(7, 11);
          const imm_11 = imm_bin.slice(11);

          const opcode = binPad(INSTRUCTION_TO_BUILD.opcode, 7);
          const funct3 = binPad(INSTRUCTION_TO_BUILD.funct3, 3);
          const rs1 = binPad(rs1n, 5);
          const rs2 = binPad(rs2n, 5);

          const FMT_B =
            "[imm(12)][imm(10:5)][rs2][rs1][funct3][imm(4:1)][imm(11)][opcode]";

          build = FMT_B.replace("[imm(12)]", imm_12);
          build = build.replace("[imm(10:5)]", imm_10_5);
          build = build.replace("[rs2]", rs2);
          build = build.replace("[rs1]", rs1);
          build = build.replace("[funct3]", funct3);
          build = build.replace("[imm(4:1)]", imm_4_1);
          build = build.replace("[imm(11)]", imm_11);
          build = build.replace("[opcode]", opcode);
        })();
        break;
      case "U":
        (() => {
          const rdn = RegistryWorldSet.__match(instruction_fragments[1]);
          const immn = parseInt(`${eval(instruction_fragments[2])}`);
          const imm = binPad(immn, 20);
          const rd = binPad(rdn, 5);
          const opcode = binPad(INSTRUCTION_TO_BUILD.opcode, 7);

          build = FMT_U.replace("[imm(31:12)]", imm);
          build = build.replace("[rd]", rd);
          build = build.replace("[opcode]", opcode);
        })();
        break;

      case "J":
        (() => {
          const rdn = RegistryWorldSet.__match(instruction_fragments[1]);
          const immn = parseInt(`${eval(instruction_fragments[2])}`);
          if (immn % 2 !== 0)
            throw new Error(
              `Jump offset must be divisible by 2, line: ${line}`
            );

          const imm_field = immn >> 1;
          const imm_bin = binPad(imm_field, 20);
          const imm20 = imm_bin.slice(0, 1); // Bit 20
          const imm_19_12 = imm_bin.slice(1, 9); // Bits 19:12
          const imm_11 = imm_bin.slice(9, 10); // Bit 11
          const imm_10_1 = imm_bin.slice(10); // Bits 10:1

          const rd = binPad(rdn, 5);
          const opcode = binPad(INSTRUCTION_TO_BUILD.opcode, 7);

          build = FMT_J.replace("[imm(20)]", imm20);
          build = build.replace("[imm(10:1)]", imm_10_1);
          build = build.replace("[imm(11)]", imm_11);
          build = build.replace("[imm(19:12)]", imm_19_12);
          build = build.replace("[rd]", rd);
          build = build.replace("[opcode]", opcode);
        })();
        break;
    }
    output += `${build}\n`;
    instruction_counter++;
  });
} catch (e) {
  console.error(e);
}

fs.writeFileSync(argv[0].replace(".asm", ".bin"), output.slice(0, -1));
