function setupMode() {
    CodeMirror.defineSimpleMode("asm", {
    // The start state contains the rules that are intially used
    start: [
      // The regex matches the token, the token property contains the type
      // label definition
      {regex: /(.?[a-zA-Z]*:)/,
      token: ["tag"]},
      // jump instruction
      {regex: /(J.{1,2}[ \t])([^; \t\n]*)/,
      token: ["keyword", "tag"]},
      // call instruction
      {regex: /(CALL[ \t])([^; \t\n]*)/,
      token: ["keyword", "tag"]},
      // other instructions
      {regex: /[A-Z]{2,4}($|[ \t])/,
      token: ["keyword", null]},
      // registers/variables
      {regex: /[ \t[]([A-D]){1}[, \]]/,
        token: ["variable"]},
      // comments
      {regex: /;.*/, token:["comment"]},
      // You can match multiple tokens at once. Note that the captured
      // groups must span the whole string in this case
      // number literals
      {regex: /(\d+d?)/,
       token: ["number"]},
       // string mode
       {regex: /"/,
       next: "string"},
       // character mode
       {regex: /'/,
       next: "character"}
    ],
    string: [
        {regex: /[^"]/, token: "string"},
        {regex: /"/,next:"start"}
    ],
    character: [
        {regex: /[^']/, token: "string-2"},
        {regex: /'/,next:"start"}
    ],
    // The meta property contains global information about the mode. It
    // can contain properties like lineComment, which are supported by
    // all modes, and also directives like dontIndentStates, which are
    // specific to simple modes.
    meta: {
      lineComment: ";"
    }
  });
}
setupMode();