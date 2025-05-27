const cloudinaryBlockedExtensions = [
  "action", "apk", "app", "bat", "bin", "cmd", "com", "command", "cpl", "csh",
  "exe", "gadget", "inf1", "ins", "inx", "ipa", "isu", "job", "jse", "ksh",
  "lnk", "msc", "msi", "msp", "mst", "osx", "out", "paf", "pif", "prg", "ps1",
  "reg", "rgs", "run", "sct", "shb", "shs", "u3p", "vb", "vbe", "vbs",
  "vbscript", "workflow", "ws", "wsf", "zip", "rar", "tar.gz"
];

export const checkFileSupported = (ext)=> !cloudinaryBlockedExtensions.includes(ext)