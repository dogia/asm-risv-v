# Recursive Fibonacci function
# Arguments:
#   a0 = n (the Fibonacci number index)
# Returns:
#   a0 = fib(n)
fib:
    addi sp, sp, -16      # Allocate stack space
    sw ra, 12(sp)         # Save return address
    sw a0, 8(sp)          # Save n

    # Base case: if n <= 0, return 0
    bge a0, zero, check_n1  # If n >= 0, check if n == 1
    addi a0, zero, 0        # Return 0
    beq zero, zero, fib_return  # Unconditional jump

check_n1:
    addi t0, zero, 1
    bne a0, t0, recursive_case  # If n != 1, go to recursive case
    addi a0, zero, 1            # Return 1
    beq zero, zero, fib_return   # Unconditional jump

recursive_case:
    addi a0, a0, -1       # Compute n-1
    addi sp, sp, -4       # Allocate space for recursive call
    sw a0, 0(sp)          # Store argument
    addi t1, ra, 0        # Save return address
    addi t2, sp, 0        # Save stack pointer

    # Manual call to fib(n-1)
    addi sp, sp, -4       # Push return address
    sw t1, 0(sp)
    jalr t1, zero, fib    # Jump to fib
    lw t1, 0(sp)          # Restore return address
    addi sp, sp, 4        # Pop return address

    lw a1, 0(t2)          # Restore n-1 argument
    addi sp, sp, 4        # Pop argument
    sw a0, 4(sp)          # Store fib(n-1)

    lw a0, 8(sp)          # Restore original n
    addi a0, a0, -2       # Compute n-2
    addi sp, sp, -4       # Allocate space for recursive call
    sw a0, 0(sp)          # Store argument

    # Manual call to fib(n-2)
    addi sp, sp, -4       # Push return address
    sw t1, 0(sp)
    jalr t1, zero, fib    # Jump to fib
    lw t1, 0(sp)          # Restore return address
    addi sp, sp, 4        # Pop return address

    lw t1, 4(sp)          # Retrieve fib(n-1)
    add a0, a0, t1        # Compute fib(n) = fib(n-1) + fib(n-2)
    addi sp, sp, 4        # Pop argument

fib_return:
    lw ra, 12(sp)         # Restore return address
    addi sp, sp, 16       # Free stack space
    jalr zero, ra, 0      # Return

# Program Entry Point
_start:
    addi a0, zero, 10     # Compute fib(10)
    addi sp, sp, -4       # Allocate stack space
    sw ra, 0(sp)          # Save return address

    jalr ra, zero, fib    # Call fib function

    lw ra, 0(sp)          # Restore return address
    addi sp, sp, 4        # Free stack space

    # Exit program
    lui a7, 0             # Load upper bits of syscall number (zeroing out)
    addi a7, a7, 93       # syscall for exit
    ecall