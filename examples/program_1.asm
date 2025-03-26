_start:
    # Load n = 5
    addi a0, zero, 5  

    # Initialize sum = 0
    addi t0, zero, 0  

    # Initialize i = 1
    addi t1, zero, 1  

loop:
    # if t1 > a0, exit loop
    slt t2, a0, t1  # t2 = (a0 < t1) ? 1 : 0
    bne t2, zero, end  # If t2 == 1, jump to end  

    # sum += i
    add t0, t0, t1  

    # i++
    addi t1, t1, 1  

    # Unconditional jump back to loop
    beq zero, zero, loop  

end:
    addi zero, zero, 0  # Equivalent to nop