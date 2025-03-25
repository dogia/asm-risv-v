export const FMT_R = '[funct7][rs2][rs1][funct3][rd][opcode]';
export const FMT_I = '[imm(11:0)][rs1][funct3][rd][opcode]';
export const FMT_S = '[imm(11:5)][rs2][rs1][funct3][imm(4:0)][opcode]';
export const FMT_B = '[imm(12)][imm(10:5)][rs2][rs1][funct3][imm(4:1)][imm(11)][opcode]';
export const FMT_U = '[imm(31:12)][rd][opcode]';
export const FMT_J = '[imm(20)][imm(10:1)][imm(11)][imm(19:12)][rd][opcode]';