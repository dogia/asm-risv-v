_start:
    # Load max positive 32-bit integer (0x7FFFFFFF = 2147483647)
    lui a0, 0x7FFFF     # Load upper 20 bits (0x7FFFF000)
    addi a0, a0, 0xFFF  # Add lower 12 bits (0xFFF)

    # Load 1
    addi a1, zero, 1  

    # This should cause overflow: 2147483647 + 1 = -2147483648 (two's complement wrap-around)
    add a2, a0, a1  

    # Load min negative 32-bit integer (0x80000000 = -2147483648)
    lui a0, 0x80000     # Load upper 20 bits (0x80000000, sign-extended)

    # Load -1
    addi a1, zero, -1  

    # This should cause underflow: -2147483648 - 1 = 2147483647 (two's complement wrap-around)
    add a3, a0, a1  

    # Exit program
    addi a7, zero, 93   # System call for exit
    ecall