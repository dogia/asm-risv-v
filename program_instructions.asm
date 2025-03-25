    .text
    .globl main
main:
    # ---------------------------
    # Operaciones aritméticas y lógicas
    # ---------------------------
    li   a0, 10           # Pseudo: cargar inmediato en a0
    li   a1, 20           # Pseudo: cargar inmediato en a1
    add  a2, a0, a1       # Suma: a2 = a0 + a1
    sub  a3, a1, a0       # Resta: a3 = a1 - a0
    addi a4, a0, 5        # Suma inmediato: a4 = a0 + 5
    sll  a5, a0, a1       # Desplazamiento lógico a la izquierda
    srl  a6, a1, a0       # Desplazamiento lógico a la derecha
    sra  a7, a1, a0       # Desplazamiento aritmético a la derecha
    and  t0, a0, a1       # AND bit a bit
    or   t1, a0, a1       # OR bit a bit
    xor  t2, a0, a1       # XOR bit a bit
    slt  t3, a0, a1       # Set less than (con signo)
    sltu t4, a0, a1       # Set less than unsigned

    # ---------------------------
    # Instrucciones de alto inmediato
    # ---------------------------
    lui   t5, 0x12345     # Cargar los 20 bits altos en t5
    auipc t6, 0x1         # AUIPC: sumar inmediato a la PC y cargar en t6

    # ---------------------------
    # Instrucciones de ramas
    # ---------------------------
    beq  t3, t4, label_eq    # Si t3 == t4, salta a label_eq
    bne  t3, t4, label_ne    # Si t3 != t4, salta a label_ne
    blt  t3, t4, label_lt    # Si t3 < t4 (con signo), salta a label_lt
    bge  t3, t4, label_ge    # Si t3 >= t4 (con signo), salta a label_ge
    bltu t3, t4, label_ltu   # Si t3 < t4 (sin signo), salta a label_ltu
    bgeu t3, t4, label_geu   # Si t3 >= t4 (sin signo), salta a label_geu

    # ---------------------------
    # Instrucciones de salto
    # ---------------------------
    jal  ra, label_jal       # Salta incondicionalmente a label_jal, guarda la dirección de retorno en ra
label_jal:
    jalr ra, 0(ra)           # Salto indirecto usando ra

    # ---------------------------
    # Operaciones de carga y almacenamiento
    # ---------------------------
    la   t7, data           # Pseudo: cargar la dirección de 'data' en t7
    lb   t8, 0(t7)          # Cargar un byte con signo
    lbu  t9, 0(t7)          # Cargar un byte sin signo
    lh   s0, 0(t7)          # Cargar un medio palabra (halfword) con signo
    lhu  s1, 0(t7)          # Cargar un medio palabra sin signo
    lw   s2, 0(t7)          # Cargar una palabra
    sb   t8, 0(t7)          # Almacenar un byte
    sh   t8, 0(t7)          # Almacenar un medio palabra
    sw   t8, 0(t7)          # Almacenar una palabra

    # ---------------------------
    # Instrucciones de multiplicación y división (Extensión M)
    # ---------------------------
    mul    s3, a0, a1       # Multiplicación: s3 = a0 * a1 (bajo 32 bits)
    mulh   s4, a0, a1       # Multiplicación alta (con signo x signo)
    mulhsu s5, a0, a1       # Multiplicación alta (con signo x sin signo)
    mulhu  s6, a0, a1       # Multiplicación alta (sin signo x sin signo)
    div    s7, a1, a0       # División con signo: s7 = a1 / a0
    divu   t0, a1, a0       # División sin signo: t0 = a1 / a0
    rem    t1, a1, a0       # Resto con signo: t1 = a1 % a0
    remu   t2, a1, a0       # Resto sin signo: t2 = a1 % a0

    # ---------------------------
    # Instrucciones atómicas (Extensión A)
    # ---------------------------
    lr.w t3, (t7)           # Cargar palabra con reserva (load reserved)
    sc.w t4, t3, (t7)        # Almacenar condicionalmente la palabra (store conditional)

    # ---------------------------
    # Barreras de memoria
    # ---------------------------
    fence                   # Barrera de memoria general
    fence.i                 # Barrera para instrucciones (sincroniza la caché de instrucciones)

    # ---------------------------
    # Instrucciones CSR
    # ---------------------------
    csrr t5, mcycle         # Leer el contador de ciclos (CSR mcycle)

    # ---------------------------
    # Instrucciones de entorno
    # ---------------------------
    ecall                   # Llamada al entorno (por ejemplo, para servicios del sistema)
    ebreak                  # Punto de interrupción / depuración

    # ---------------------------
    # Pseudo-instrucciones adicionales y fin del programa
    # ---------------------------
    mv    t6, t7           # Mover (equivalente a addi t6, t7, 0)
    nop                    # No-operation (no hace nada)
    ret                    # Retorno (equivalente a jalr x0, ra, 0)

# ---------------------------
# Etiquetas de salto de las ramas
# ---------------------------
label_eq:
    nop
    j   end_label

label_ne:
    nop
    j   end_label

label_lt:
    nop
    j   end_label

label_ge:
    nop
    j   end_label

label_ltu:
    nop
    j   end_label

label_geu:
    nop
    j   end_label

end_label:
    nop

    .data
data:
    .byte 0x55           # Datos de ejemplo
