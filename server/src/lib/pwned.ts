import axios from "axios";
import { createHash } from "crypto";

export async function pwnCount(password: string) {
  const shasum = createHash("sha1");
  shasum.update(password);
  const hash = shasum.digest("hex").toUpperCase();
  const hashEnd = hash.substring(5);

  const res = await axios.get(
    "https://api.pwnedpasswords.com/range/" + hash.substring(0, 5)
  );

  const lines: string[] = res.data.split("\n");

  const match = lines.find((l) => l.split(":")[0] === hashEnd);

  if (match) {
    const count = parseInt(match.split(":")[1]);
    return count;
  }
  return 0;
}
