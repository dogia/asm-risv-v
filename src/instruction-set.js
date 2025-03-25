class Instruction {
    inst;
    name;
    fmt;
    opcode;
    funct3;
    funct7;

    constructor(inst, name, fmt, opcode, funct3, funct7) {
        this.inst = inst;
        this.name = name;
        this.fmt = fmt;
        this.opcode = opcode;
        this.funct3 = funct3;
        this.funct7 = funct7;
    }
}


// Type R
const add = new Instruction('add', 'ADD', 'R', 0b0110011, 0x0, 0x00);
const sub = new Instruction('sub', 'SUB', 'R', 0b0110011, 0x0, 0x20);
const xor = new Instruction('xor', 'XOR', 'R', 0b0110011, 0x4, 0x00);
const or  = new Instruction( 'or',  'OR', 'R', 0b0110011, 0x6, 0x00);
const and = new Instruction('and', 'AND', 'R', 0b0110011, 0x7, 0x00);

const sll = new Instruction('sll', 'Shift Left Logical', 'R', 0b0110011, 0x1, 0x00);
const srl = new Instruction('srl', 'Shift Right Logical', 'R', 0b0110011, 0x5, 0x00);
const sra = new Instruction('sra', 'Shift Right Arith*', 'R', 0b0110011, 0x5, 0x20);

const slt = new Instruction('slt', 'Set Less Than', 'R', 0b0110011, 0x2, 0x00);
const sltu = new Instruction('sltu', 'Set Less Than (U)', 'R', 0b0110011, 0x3, 0x00);

// Type I
const addi = new Instruction('addi', 'ADD Immediate', 'I', 0b0010011, 0x0, 0x00);
const xori = new Instruction('xori', 'XOR Immediate', 'I', 0b0010011, 0x4, 0x00);
const ori  = new Instruction( 'ori',  'OR Immediate', 'I', 0b0010011, 0x6, 0x00);
const andi = new Instruction('andi', 'AND Immediate', 'I', 0b0010011, 0x7, 0x00);

const slli = new Instruction('slli', 'Shift Left Logical Imm', 'I', 0b0010011, 0x1);
const srli = new Instruction('srli', 'Shift Right Logical Imm', 'I', 0b0010011, 0x5);
const srai = new Instruction('srai', 'Shift Right Arith Imm', 'I', 0b0010011, 0x5);

const slti = new Instruction('slti', 'Set Less Than Imm', 'I', 0b0010011, 0x2);
const sltiu = new Instruction('sltiu', 'Set Less Than Imm (U)', 'I', 0b0010011, 0x3);

// Type I (Load)
const lb = new Instruction('lb', 'Load Byte', 'L', 0b0000011, 0x0);
const lh = new Instruction('lh', 'Load Halfword', 'L', 0b0000011, 0x1);
const lw = new Instruction('lw', 'Load Word', 'L', 0b0000011, 0x2);
const lbu = new Instruction('lbu', 'Load Byte (U)', 'L', 0b0000011, 0x4);
const lhu = new Instruction('lhu', 'Load Halfword (U)', 'L', 0b0000011, 0x5);

// Type S
const sb = new Instruction('sb', 'Store Byte', 'S', 0b0100011, 0x0);
const sh = new Instruction('sh', 'Store Halfword', 'S', 0b0100011, 0x1);
const sw = new Instruction('sw', 'Store Word', 'S', 0b0100011, 0x2);

// Type B
const beq = new Instruction('beq', 'Branch Equal', 'B', 0b1100011, 0x0);
const bne = new Instruction('bne', 'Branch Not Equal', 'B', 0b1100011, 0x1);
const blt = new Instruction('blt', 'Branch Less Than', 'B', 0b1100011, 0x4);
const bge = new Instruction('bge', 'Branch Greater Equal', 'B', 0b1100011, 0x5);
const bltu = new Instruction('bltu', 'Branch Less Than (U)', 'B', 0b1100011, 0x6);
const bgeu = new Instruction('bgeu', 'Branch Greater Equal (U)', 'B', 0b1100011, 0x7);

// Type U
const lui = new Instruction('lui', 'Load Upper Immediate', 'U', 0b0110111, 0x0);
const auipc = new Instruction('auipc', 'Add Upper Immediate to PC', 'U', 0b0010111, 0x0);

// J
const jal = new Instruction('jal', 'Jump and Link', 'J', 0b1101111, 0x0);
const jalr = new Instruction('jalr', 'Jump and Link Register', 'I', 0b1100111, 0x0);

// Environment
const ecall = new Instruction('ecall', 'Environment Call', 'E', 0b1110011, 0x0, 0x0);
const ebreak = new Instruction('ebreak', 'Environment Break', 'E', 0b1110011, 0x0, 0x1);


export const InstructionSet = [
    // R
    add, sub, xor, or, and, sll, srl, sra, slt, sltu,
    // I
    addi, xori, ori, andi, slli, srli, srai, slti, sltiu, 
    lb, lh, lw, lbu, lhu,
    // S
    sb, sh, sw,
    // B
    beq, bne, blt, bge, bltu, bgeu,
    // U
    lui, auipc,
    // J
    jal, jalr,
    // Environment
    ecall, ebreak
];
