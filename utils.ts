
import { getEmojiMap, B64_CHARS, EMOJI_SET } from './constants';

export const encodeToEmoji = (input: string): string => {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary);
  
  const emojiMap = getEmojiMap();
  let result = '';
  for (let i = 0; i < b64.length; i++) {
    result += emojiMap[b64[i]] || b64[i];
  }
  return result;
};

export const generateLoader = (emojiString: string): string => {
  const allEmojis = EMOJI_SET.join('');
  const allChars = B64_CHARS;
  
  return `# EmojiScript Fast Loader
$e = "${emojiString}"
$k = "${allEmojis}"
$v = "${allChars}"
$m = @{}
for ($i = 0; $i -lt $v.Length; $i++) {
    $m[$k.Substring($i*2, 2)] = $v[$i]
}
$sb = New-Object System.Text.StringBuilder
for ($i = 0; $i -lt $e.Length; $i+=2) {
    [void]$sb.Append($m[$e.Substring($i, 2)])
}
$s = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($sb.ToString()))
Invoke-Expression $s`.trim();
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
