app.service('opcodes', [function() {
    var opcodes = {
        NONE: 0,
        LOAD_FROM_MEMORY: 1,
        LOAD_WITH_CONSTANT: 2,
        STORE_TO_MEMORY: 3,
        MOVE: 4,
        ADD_INT: 5,
        ADD_FLOAT: 6,
        OR: 7,
        AND: 8,
        XOR: 9,
        ROTATE: 10,
        JUMP_IF_EQUAL: 11,
        HALT: 12,
        LOAD_FROM_POINTER: 13,
        STORE_TO_POINTER: 14,
        JUMP_IF_LESS: 15
    };

    return opcodes;
}]);

/*
 * Local variables:
 * c-basic-offset: 4
 * tab-width: 4
 * indent-tabs-mode: nil
 * End:
 */
