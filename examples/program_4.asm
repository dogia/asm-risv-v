# Function: multiply(a, b)
# Implements a × b using repeated addition (RV32I-compliant)
multiply:
    addi t0, zero, 0    # t0 = 0 (Result)
    addi t1, zero, 0    # t1 = 0 (Counter)

mul_loop:
    beq t1, a1, mul_done  # If counter == b, return result
    add t0, t0, a0        # t0 += a (Repeated addition)
    addi t1, t1, 1        # Increment counter
    jal zero, mul_loop  # Repeat

mul_done:
    add a0, t0, zero  # Store result in a0
    

_start:
    # Load n (Fibonacci index)
    addi a0, zero, 10  # Example: Compute Fib(10)

    # Load base Fibonacci matrix: [[1, 1], [1, 0]]
    addi t0, zero, 1   # t0 = 1 (M[0][0])
    addi t1, zero, 1   # t1 = 1 (M[0][1])
    addi t2, zero, 1   # t2 = 1 (M[1][0])
    addi t3, zero, 0   # t3 = 0 (M[1][1])

    # Load identity matrix (result matrix)
    addi t4, zero, 1   # t4 = 1 (R[0][0])
    addi t5, zero, 0   # t5 = 0 (R[0][1])
    addi t6, zero, 0   # t6 = 0 (R[1][0])
    addi t6, zero, 1   # t6 = 1 (R[1][1])

    # If n <= 1, return n
    bge zero, a0, done # If n <= 0, return 0
    addi a1, zero, 1   # If n == 1, return 1
    beq a0, a1, done

exp_loop:
    # If n is odd, multiply result matrix by base matrix
    andi t6, a0, 1
    beq t6, zero, skip_mult

    # Matrix multiplication R = R * M
    add a1, t0, zero  
    jal ra, multiply
    add t3, a0, zero

    add a0, t5, zero  
    add a1, t2, zero
    jal ra, multiply
    add t3, t3, a0  

    add a0, t4, zero
    add a1, t1, zero
    jal ra, multiply
    add t4, a0, zero

    add a0, t5, zero
    add a1, t3, zero
    jal ra, multiply
    add t4, t4, a0  

    add a0, t6, zero
    add a1, t0, zero
    jal ra, multiply
    add t5, a0, zero

    add a0, t6, zero
    add a1, t2, zero
    jal ra, multiply
    add t5, t5, a0  

    add a0, t6, zero
    add a1, t1, zero
    jal ra, multiply
    add t6, a0, zero

    add a0, t6, zero
    add a1, t3, zero
    jal ra, multiply
    add t6, t6, a0  

    # Store results
    add t4, t3, zero
    add t5, t4, zero
    add t6, t5, zero
    add t6, t6, zero

skip_mult:
    # Square the matrix M = M * M
    add a0, t0, zero
    add a1, t0, zero
    jal ra, multiply
    add t3, a0, zero

    add a0, t1, zero
    add a1, t2, zero
    jal ra, multiply
    add t3, t3, a0  

    add a0, t0, zero
    add a1, t1, zero
    jal ra, multiply
    add t4, a0, zero

    add a0, t1, zero
    add a1, t3, zero
    jal ra, multiply
    add t4, t4, a0  

    add a0, t2, zero
    add a1, t0, zero
    jal ra, multiply
    add t5, a0, zero

    add a0, t3, zero
    add a1, t2, zero
    jal ra, multiply
    add t5, t5, a0  

    add a0, t2, zero
    add a1, t1, zero
    jal ra, multiply
    add t6, a0, zero

    add a0, t3, zero
    add a1, t3, zero
    jal ra, multiply
    add t6, t6, a0  

    # Store results
    add t0, t3, zero
    add t1, t4, zero
    add t2, t5, zero
    add t3, t6, zero

    # Divide n by 2
    srli a0, a0, 1
    bne a0, zero, exp_loop

done:
    # The Fibonacci number is in R[1][0] (t6)
    add a0, t6, zero  # Store result in a0

    # Exit program
    addi a7, zero, 93
    ecall