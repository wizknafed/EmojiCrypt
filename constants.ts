
export const B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

export const EMOJI_SET = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
  "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
  "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
  "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
  "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬",
  "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗",
  "🤔", "🤭", "🤫", "🤥", "😶"
];

export const getEmojiMap = () => {
  const map: Record<string, string> = {};
  for (let i = 0; i < B64_CHARS.length; i++) {
    map[B64_CHARS[i]] = EMOJI_SET[i];
  }
  return map;
};

export const getReverseEmojiMap = () => {
  const map: Record<string, string> = {};
  for (let i = 0; i < B64_CHARS.length; i++) {
    map[EMOJI_SET[i]] = B64_CHARS[i];
  }
  return map;
};
