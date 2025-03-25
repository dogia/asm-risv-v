_start:
    # Cargar constantes (sin usar li)
    addi t0, zero, 50    # t0 = S (número para calcular la raíz cuadrada)
    addi t1, zero, 10    # t1 = x (estimación inicial)
    addi t2, zero, 1     # t2 = tol (tolerancia)

newton_raphson:
    # Calcular S / x_n por sustracciones sucesivas
    add t3, zero, zero   # t3 = cociente (S / x_n)
    add t4, t0, zero     # t4 = copia de S

div_loop:
    blt t4, t1, div_done # Si el residuo es menor que el divisor, termina
    sub t4, t4, t1       # t4 -= x_n
    addi t3, t3, 1       # cociente += 1
    jal x0, div_loop
div_done:
    # Calcular (x_n + S / x_n)
    add t5, t1, t3       # t5 = x_n + (S / x_n)
    # Calcular (x_n + S / x_n) / 2 usando desplazamiento a la derecha
    srli t6, t5, 1       # t6 = (x_n + S / x_n) / 2

    # Calcular |x_n+1 - x_n| y almacenar el resultado en t4 (reutilizando t4)
    sub t4, t6, t1       # t4 = x_n+1 - x_n
    bge t4, zero, positive_diff
    sub t4, zero, t4     # t4 = -t4 (valor absoluto)
positive_diff:
    blt t4, t2, done     # Si |x_n+1 - x_n| < tol, termina

    # Actualizar x_n = x_n+1 y repetir
    add t1, t6, zero
    jal x0, newton_raphson

done:
    # Salir del programa
    addi a7, zero, 10
    ecall
